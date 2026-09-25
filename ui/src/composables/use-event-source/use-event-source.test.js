import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, nextTick, ref } from 'vue'

import useEventSource from './use-event-source.js'

enableAutoUnmount(afterEach)

const url = 'http://localhost/stream'

// The test runner has no SSE server to talk to, so the global is
// replaced with a stand-in that records what the composable does to it
// and lets the tests play the server side (open, message, error).
const sources = []

class FakeEventSource extends EventTarget {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSED = 2

  constructor(target, init) {
    super()
    this.url = String(target)
    this.withCredentials = init?.withCredentials === true
    this.readyState = FakeEventSource.CONNECTING
    this.closeCalls = 0
    sources.push(this)
  }

  close() {
    this.closeCalls++
    this.readyState = FakeEventSource.CLOSED
  }

  // the server side
  serverOpen() {
    this.readyState = FakeEventSource.OPEN
    this.dispatchEvent(new Event('open'))
  }

  serverMessage(data, { type = 'message', lastEventId = '' } = {}) {
    this.dispatchEvent(new MessageEvent(type, { data, lastEventId }))
  }

  // a transient network error: the browser retries by itself
  serverRetry() {
    this.readyState = FakeEventSource.CONNECTING
    this.dispatchEvent(new Event('error'))
  }

  // a fatal error (non-200 response, wrong content type): the browser
  // gives up
  serverFail() {
    this.readyState = FakeEventSource.CLOSED
    this.dispatchEvent(new Event('error'))
  }
}

// navigator.onLine is a read-only prototype getter; an own configurable
// getter shadows it for the offline scenarios
let isOnline = true

Object.defineProperty(navigator, 'onLine', {
  configurable: true,
  get: () => isOnline
})

function setOnline(val) {
  isOnline = val
  window.dispatchEvent(new Event(val ? 'online' : 'offline'))
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('EventSource', FakeEventSource)
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  sources.length = 0
  isOnline = true
})

function mountSource(options, target = url) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useEventSource(target, options)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...result }
}

function lastSource() {
  return sources.at(-1)
}

describe('[useEventSource API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const {
          sourceStatus,
          sourceData,
          sourceLastEventId,
          sourceError,
          openSource,
          closeSource
        } = mountSource({ lazy: true })

        expect(isRef(sourceStatus)).toBe(true)
        expect(sourceStatus.value).toBe('closed')
        expect(isRef(sourceData)).toBe(true)
        expect(sourceData.value).toBeNull()
        expect(isRef(sourceLastEventId)).toBe(true)
        expect(sourceLastEventId.value).toBeNull()
        expect(isRef(sourceError)).toBe(true)
        expect(sourceError.value).toBeNull()
        expect(openSource).toBeTypeOf('function')
        expect(closeSource).toBeTypeOf('function')
      })

      test('opens the stream on mount, not in setup', () => {
        let result, statusAtSetup
        mount(
          defineComponent({
            setup() {
              result = useEventSource(url)
              statusAtSetup = result.sourceStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('closed')
        expect(sources).toHaveLength(1)
        expect(sources[0].url).toBe(url)
        expect(sources[0].withCredentials).toBe(false)
        expect(result.sourceStatus.value).toBe('connecting')

        sources[0].serverOpen()
        expect(result.sourceStatus.value).toBe('open')
      })

      test('accepts a URL object', () => {
        mountSource(void 0, new URL(url))

        expect(sources[0].url).toBe(url)
      })

      test('"withCredentials" option is passed to the stream', () => {
        mountSource({ withCredentials: true })

        expect(sources[0].withCredentials).toBe(true)
      })

      test('"lazy" option leaves the stream closed until openSource()', () => {
        const { sourceStatus, openSource } = mountSource({ lazy: true })

        expect(sources).toHaveLength(0)
        expect(sourceStatus.value).toBe('closed')

        openSource()

        expect(sources).toHaveLength(1)
        expect(sourceStatus.value).toBe('connecting')

        // no second stream while one is connecting or open
        openSource()
        sources[0].serverOpen()
        openSource()

        expect(sources).toHaveLength(1)
      })

      test('calls onOpen with the event each time the stream opens', () => {
        const onOpen = vi.fn()
        mountSource({ onOpen })

        sources[0].serverOpen()

        expect(onOpen).toHaveBeenCalledTimes(1)
        expect(onOpen.mock.calls[0][0]).toBeInstanceOf(Event)

        // the browser's own retry reopens the same stream
        sources[0].serverRetry()
        sources[0].serverOpen()

        expect(onOpen).toHaveBeenCalledTimes(2)
        expect(sources).toHaveLength(1)
      })

      test('mirrors the unnamed events into sourceData, sourceLastEventId and onMessage', () => {
        const onMessage = vi.fn()
        const { sourceData, sourceLastEventId } = mountSource({ onMessage })

        sources[0].serverOpen()
        sources[0].serverMessage('hello', { lastEventId: '42' })

        expect(sourceData.value).toBe('hello')
        expect(sourceLastEventId.value).toBe('42')
        expect(onMessage).toHaveBeenCalledTimes(1)

        const [payload, evt] = onMessage.mock.calls[0]
        expect(payload).toBe('hello')
        expect(evt).toBeInstanceOf(MessageEvent)
        expect(evt.type).toBe('message')

        // an event without an id keeps the last one
        sources[0].serverMessage('again')

        expect(sourceData.value).toBe('again')
        expect(sourceLastEventId.value).toBe('42')
      })

      test('"events" option listens to the named events too', () => {
        const onMessage = vi.fn()
        const { sourceData } = mountSource({
          events: ['update', 'delete'],
          onMessage
        })

        sources[0].serverOpen()
        sources[0].serverMessage('a', { type: 'update' })
        sources[0].serverMessage('b', { type: 'delete' })
        sources[0].serverMessage('c')
        sources[0].serverMessage('ignored', { type: 'other' })

        expect(sourceData.value).toBe('c')
        expect(onMessage).toHaveBeenCalledTimes(3)
        expect(onMessage.mock.calls.map(([, evt]) => evt.type)).toEqual([
          'update',
          'delete',
          'message'
        ])
      })

      test('mirrors the error event into sourceError and onError', () => {
        const onError = vi.fn()
        const { sourceError } = mountSource({ onError })

        sources[0].serverRetry()

        expect(sourceError.value).toBeInstanceOf(Event)
        expect(onError).toHaveBeenCalledWith(sourceError.value)
      })

      test('leaves the browser to retry a transient error', () => {
        const onClose = vi.fn()
        const onReconnect = vi.fn()
        const { sourceStatus } = mountSource({ onClose, onReconnect })

        sources[0].serverOpen()
        sources[0].serverRetry()

        expect(sourceStatus.value).toBe('connecting')
        expect(onClose).not.toHaveBeenCalled()
        expect(onReconnect).not.toHaveBeenCalled()

        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(1)

        sources[0].serverOpen()
        expect(sourceStatus.value).toBe('open')
      })

      test('closeSource() closes the stream, without reconnecting', () => {
        const onClose = vi.fn()
        const { sourceStatus, closeSource } = mountSource({ onClose })
        const source = sources[0]

        source.serverOpen()
        closeSource()

        expect(source.closeCalls).toBe(1)
        expect(sourceStatus.value).toBe('closed')
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledWith('programmatic')

        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(1)

        // a second call is a no-op
        closeSource()
        expect(source.closeCalls).toBe(1)
        expect(onClose).toHaveBeenCalledTimes(1)
      })

      test('closeSource() lets openSource() reconnect', () => {
        const { sourceStatus, openSource, closeSource } = mountSource()

        sources[0].serverOpen()
        closeSource()
        openSource()

        expect(sources).toHaveLength(2)
        expect(sourceStatus.value).toBe('connecting')

        sources[1].serverOpen()
        expect(sourceStatus.value).toBe('open')
      })

      test('ignores the events of a stream closed through closeSource()', () => {
        const onMessage = vi.fn()
        const { sourceData, closeSource, openSource } = mountSource({
          onMessage
        })
        const old = sources[0]

        old.serverOpen()
        closeSource()
        openSource()

        old.serverMessage('late')

        expect(sourceData.value).toBeNull()
        expect(onMessage).not.toHaveBeenCalled()
        expect(sources).toHaveLength(2)
      })

      test('reconnects with a doubling delay when the browser gives up', () => {
        const onClose = vi.fn()
        const { sourceStatus } = mountSource({ onClose })

        sources[0].serverOpen()
        sources[0].serverFail()

        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledWith('remote')
        expect(sourceStatus.value).toBe('connecting')
        expect(sources).toHaveLength(1)

        vi.advanceTimersByTime(999)
        expect(sources).toHaveLength(1)
        vi.advanceTimersByTime(1)
        expect(sources).toHaveLength(2)

        sources[1].serverFail()
        vi.advanceTimersByTime(1999)
        expect(sources).toHaveLength(2)
        vi.advanceTimersByTime(1)
        expect(sources).toHaveLength(3)

        sources[2].serverFail()
        vi.advanceTimersByTime(4000)
        expect(sources).toHaveLength(4)

        // a successful open resets the delay
        sources[3].serverOpen()
        expect(sourceStatus.value).toBe('open')
        sources[3].serverFail()
        vi.advanceTimersByTime(1000)
        expect(sources).toHaveLength(5)
      })

      test('calls onClose before scheduling the reconnect; closeSource() from within it keeps the stream closed', () => {
        const api = {}
        const onReconnect = vi.fn()
        const onClose = vi.fn(reason => {
          if (reason === 'remote' && api.stayClosed) {
            api.closeSource()
          }
        })
        const { sourceStatus } = Object.assign(
          api,
          mountSource({ onClose, onReconnect, autoReconnect: { delay: 10 } })
        )

        sources[0].serverOpen()
        sources[0].serverFail()

        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onReconnect).toHaveBeenCalledTimes(1)
        expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
          onReconnect.mock.invocationCallOrder[0]
        )
        vi.advanceTimersByTime(10)
        expect(sources).toHaveLength(2)

        api.stayClosed = true
        sources[1].serverOpen()
        sources[1].serverFail()

        expect(onClose).toHaveBeenCalledTimes(2)
        expect(onReconnect).toHaveBeenCalledTimes(1)
        expect(sourceStatus.value).toBe('closed')
        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(2)
      })

      test('caps the default reconnect delay at 30s', () => {
        mountSource()

        for (let i = 0; i < 6; i++) {
          lastSource().serverFail()
          vi.advanceTimersByTime(30_000)
        }

        expect(sources).toHaveLength(7)
      })

      test('"autoReconnect: false" leaves the stream closed', () => {
        const onClose = vi.fn()
        const { sourceStatus } = mountSource({ autoReconnect: false, onClose })

        sources[0].serverOpen()
        sources[0].serverFail()

        expect(sourceStatus.value).toBe('closed')
        expect(onClose).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(1)
      })

      test('"autoReconnect.retries" limits the attempts', () => {
        const { sourceStatus } = mountSource({
          autoReconnect: { retries: 2, delay: 10 }
        })

        sources[0].serverFail()
        vi.advanceTimersByTime(10)
        expect(sources).toHaveLength(2)

        sources[1].serverFail()
        vi.advanceTimersByTime(10)
        expect(sources).toHaveLength(3)

        sources[2].serverFail()
        expect(sourceStatus.value).toBe('closed')

        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(3)
      })

      test('calls onReconnect with the attempt and the delay', () => {
        const onReconnect = vi.fn()
        mountSource({ onReconnect })

        sources[0].serverFail()
        expect(onReconnect).toHaveBeenLastCalledWith(1, 1000)
        vi.advanceTimersByTime(1000)

        sources[1].serverFail()
        expect(onReconnect).toHaveBeenLastCalledWith(2, 2000)
        vi.advanceTimersByTime(2000)

        // a successful open starts the count over
        sources[2].serverOpen()
        sources[2].serverFail()
        expect(onReconnect).toHaveBeenLastCalledWith(1, 1000)
        expect(onReconnect).toHaveBeenCalledTimes(3)
      })

      test('"autoReconnect.delay" accepts a function of the attempt', () => {
        const delay = vi.fn(attempt => 100 * (attempt + 1))
        mountSource({ autoReconnect: { delay } })

        sources[0].serverFail()
        expect(delay).toHaveBeenLastCalledWith(0)
        vi.advanceTimersByTime(100)
        expect(sources).toHaveLength(2)

        sources[1].serverFail()
        expect(delay).toHaveBeenLastCalledWith(1)
        vi.advanceTimersByTime(200)
        expect(sources).toHaveLength(3)
      })

      test('waits for the "online" event instead of retrying while offline', () => {
        const onReconnect = vi.fn()
        const { sourceStatus } = mountSource({
          autoReconnect: { retries: 2, delay: 10 },
          onReconnect
        })

        sources[0].serverOpen()
        setOnline(false)
        sources[0].serverFail()

        expect(sourceStatus.value).toBe('connecting')
        expect(onReconnect).not.toHaveBeenCalled()
        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(1)

        setOnline(true)

        // a fresh run of attempts: the immediate one is attempt 1
        expect(sources).toHaveLength(2)
        expect(sourceStatus.value).toBe('connecting')
        expect(onReconnect).toHaveBeenLastCalledWith(1, 0)

        sources[1].serverFail()
        expect(onReconnect).toHaveBeenLastCalledWith(2, 10)
        vi.advanceTimersByTime(10)
        expect(sources).toHaveLength(3)

        sources[2].serverFail()
        expect(sourceStatus.value).toBe('closed')
        expect(onReconnect).toHaveBeenCalledTimes(2)
      })

      test('"offline" event cancels a pending reconnect', () => {
        mountSource()

        sources[0].serverFail()
        setOnline(false)
        vi.advanceTimersByTime(60_000)

        expect(sources).toHaveLength(1)

        setOnline(true)
        expect(sources).toHaveLength(2)
      })

      test('"online" event reconnects a stream that gave up', () => {
        const { sourceStatus } = mountSource({
          autoReconnect: { retries: 0 }
        })

        sources[0].serverFail()
        expect(sourceStatus.value).toBe('closed')

        setOnline(false)
        setOnline(true)

        expect(sources).toHaveLength(2)
        expect(sourceStatus.value).toBe('connecting')
      })

      test('"online" event does nothing for a stream closed by the user or without reconnect', () => {
        const manual = mountSource({ lazy: true })
        const closed = mountSource({ autoReconnect: false })

        sources[0].serverFail()
        manual.closeSource()
        closed.closeSource()

        setOnline(false)
        setOnline(true)

        expect(sources).toHaveLength(1)
      })

      test('reconnects to a new URL while wanted', async () => {
        const onClose = vi.fn()
        const target = ref(url)
        const { sourceStatus, closeSource } = mountSource({ onClose }, target)

        sources[0].serverOpen()
        target.value = 'http://localhost/other'
        await nextTick()

        expect(sources[0].closeCalls).toBe(1)
        expect(sources).toHaveLength(2)
        expect(sources[1].url).toBe('http://localhost/other')
        expect(sourceStatus.value).toBe('connecting')
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledWith('url')

        // the move does not count as a failure
        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(2)

        closeSource()
        target.value = 'http://localhost/third'
        await nextTick()

        expect(sources).toHaveLength(2)
      })

      test('closes the stream when the component unmounts', () => {
        const onClose = vi.fn()
        const { wrapper, sourceStatus } = mountSource({ onClose })
        const source = sources[0]

        source.serverOpen()
        wrapper.unmount()

        expect(source.closeCalls).toBe(1)
        expect(sourceStatus.value).toBe('closed')
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose).toHaveBeenCalledWith('unmount')

        vi.advanceTimersByTime(60_000)
        expect(sources).toHaveLength(1)
      })

      test('does nothing once the component got destroyed', () => {
        const { wrapper, sourceStatus, openSource } = mountSource()

        sources[0].serverOpen()
        wrapper.unmount()

        openSource()
        setOnline(false)
        setOnline(true)

        expect(sources).toHaveLength(1)
        expect(sourceStatus.value).toBe('closed')
      })

      test('closeSource() releases the window listeners and the url watcher outside of a component; openSource() attaches them again', async () => {
        const room = ref('a')
        const target = vi.fn(() => `http://localhost/${room.value}`)
        const addListener = vi.spyOn(window, 'addEventListener')
        const removeListener = vi.spyOn(window, 'removeEventListener')
        const listened = () =>
          addListener.mock.calls.filter(([name]) =>
            ['online', 'offline'].includes(name)
          ).length -
          removeListener.mock.calls.filter(([name]) =>
            ['online', 'offline'].includes(name)
          ).length

        const { openSource, closeSource } = useEventSource(target)

        expect(listened()).toBe(2)

        closeSource()

        expect(listened()).toBe(0)

        // the watcher is gone: a url change reads nothing anymore
        target.mockClear()
        room.value = 'b'
        await nextTick()
        expect(target).not.toHaveBeenCalled()
        expect(sources).toHaveLength(1)

        openSource()

        expect(listened()).toBe(2)
        expect(sources).toHaveLength(2)
        expect(sources[1].url).toBe('http://localhost/b')

        room.value = 'c'
        await nextTick()
        expect(sources).toHaveLength(3)
        expect(sources[2].url).toBe('http://localhost/c')

        sources[2].serverFail()
        setOnline(false)
        setOnline(true)
        expect(sources).toHaveLength(4)

        closeSource()
        expect(listened()).toBe(0)
        addListener.mockRestore()
        removeListener.mockRestore()
      })

      test('can be used outside of a component', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { sourceStatus, sourceData, closeSource } = useEventSource(url)

        expect(warn).not.toHaveBeenCalled()
        expect(sources).toHaveLength(1)
        expect(sourceStatus.value).toBe('connecting')

        sources[0].serverOpen()
        sources[0].serverMessage('hi')
        expect(sourceData.value).toBe('hi')

        closeSource()
        expect(sourceStatus.value).toBe('closed')
        warn.mockRestore()
      })
    })
  })
})
