import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, nextTick, ref } from 'vue'

import useWebSocket from './use-web-socket.js'

enableAutoUnmount(afterEach)

const url = 'ws://localhost/socket'
const defaultHeartbeatInterval = 30_000

// The test runner has no WebSocket server to talk to, so the global is
// replaced with a stand-in that records what the composable does to it
// and lets the tests play the server side (open, message, error, close).
// Like the real one, send() throws unless the socket is open.
const sockets = []

class FakeWebSocket extends EventTarget {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  constructor(target, protocols) {
    super()
    this.url = String(target)
    this.protocols = protocols
    this.readyState = FakeWebSocket.CONNECTING
    this.binaryType = 'blob'
    this.sent = []
    this.closeCalls = []
    sockets.push(this)
  }

  send(message) {
    if (this.readyState !== FakeWebSocket.OPEN) {
      throw new Error('InvalidStateError: the socket is not open')
    }
    this.sent.push(message)
  }

  close(code, reason) {
    this.closeCalls.push([code, reason])
    this.readyState = FakeWebSocket.CLOSING
  }

  // the server side
  serverOpen() {
    this.readyState = FakeWebSocket.OPEN
    this.dispatchEvent(new Event('open'))
  }

  serverMessage(data) {
    this.dispatchEvent(new MessageEvent('message', { data }))
  }

  serverError() {
    this.dispatchEvent(new Event('error'))
  }

  serverClose(code = 1006) {
    this.readyState = FakeWebSocket.CLOSED
    this.dispatchEvent(new CloseEvent('close', { code }))
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
  vi.stubGlobal('WebSocket', FakeWebSocket)
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  sockets.length = 0
  isOnline = true
})

function mountSocket(options, target = url) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useWebSocket(target, options)
        return () => h('div')
      }
    })
  )

  return { wrapper, ...result }
}

function lastSocket() {
  return sockets.at(-1)
}

describe('[useWebSocket API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const { socketStatus, data, error, send, openSocket, closeSocket } =
          mountSocket({ manualOpen: true })

        expect(isRef(socketStatus)).toBe(true)
        expect(socketStatus.value).toBe('closed')
        expect(isRef(data)).toBe(true)
        expect(data.value).toBeNull()
        expect(isRef(error)).toBe(true)
        expect(error.value).toBeNull()
        expect(send).toBeTypeOf('function')
        expect(openSocket).toBeTypeOf('function')
        expect(closeSocket).toBeTypeOf('function')
      })

      test('opens the socket on mount, not in setup', () => {
        let result, statusAtSetup
        mount(
          defineComponent({
            setup() {
              result = useWebSocket(url, { protocols: ['chat', 'v2'] })
              statusAtSetup = result.socketStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('closed')
        expect(sockets).toHaveLength(1)
        expect(sockets[0].url).toBe(url)
        expect(sockets[0].protocols).toEqual(['chat', 'v2'])
        expect(result.socketStatus.value).toBe('connecting')

        sockets[0].serverOpen()
        expect(result.socketStatus.value).toBe('open')
      })

      test('accepts a URL object', () => {
        mountSocket(void 0, new URL(url))

        expect(sockets[0].url).toBe(url)
      })

      test('resolves a relative URL against the page, as ws(s)', () => {
        mountSocket(void 0, '/live?room=1')

        // the test runner's page is served over http
        expect(sockets[0].url).toBe(`ws://${location.host}/live?room=1`)
      })

      test('maps http(s) URLs to ws(s)', () => {
        mountSocket(void 0, 'http://example.com/a')
        mountSocket(void 0, 'https://example.com/b')
        mountSocket(void 0, new URL('https://example.com/c'))

        expect(sockets.map(s => s.url)).toEqual([
          'ws://example.com/a',
          'wss://example.com/b',
          'wss://example.com/c'
        ])
      })

      test('leaves ws(s) URLs untouched', () => {
        mountSocket(void 0, 'wss://example.com/secure')

        expect(sockets[0].url).toBe('wss://example.com/secure')
      })

      test('sets the "binaryType" option on the socket', () => {
        mountSocket({ binaryType: 'arraybuffer' })

        expect(sockets[0].binaryType).toBe('arraybuffer')
      })

      test('"manualOpen" option leaves the socket closed until openSocket()', () => {
        const { socketStatus, openSocket } = mountSocket({ manualOpen: true })

        expect(sockets).toHaveLength(0)
        expect(socketStatus.value).toBe('closed')

        openSocket()

        expect(sockets).toHaveLength(1)
        expect(socketStatus.value).toBe('connecting')

        // no second socket while one is connecting or open
        openSocket()
        sockets[0].serverOpen()
        openSocket()

        expect(sockets).toHaveLength(1)
      })

      test('calls onOpen with the event each time the socket opens', () => {
        const onOpen = vi.fn()
        mountSocket({ onOpen, autoReconnect: { delay: 10 } })

        sockets[0].serverOpen()

        expect(onOpen).toHaveBeenCalledTimes(1)
        expect(onOpen.mock.calls[0][0]).toBeInstanceOf(Event)

        sockets[0].serverClose()
        vi.advanceTimersByTime(10)
        sockets[1].serverOpen()

        expect(onOpen).toHaveBeenCalledTimes(2)
      })

      test('mirrors the received messages into data and onMessage', () => {
        const onMessage = vi.fn()
        const { data } = mountSocket({ onMessage })

        sockets[0].serverOpen()
        sockets[0].serverMessage('hello')

        expect(data.value).toBe('hello')
        expect(onMessage).toHaveBeenCalledTimes(1)

        const [payload, evt] = onMessage.mock.calls[0]
        expect(payload).toBe('hello')
        expect(evt).toBeInstanceOf(MessageEvent)
      })

      test('mirrors the error event into error and onError', () => {
        const onError = vi.fn()
        const { error } = mountSocket({ onError })

        sockets[0].serverError()

        expect(error.value).toBeInstanceOf(Event)
        expect(onError).toHaveBeenCalledWith(error.value)
      })

      test('send() sends right away while open', () => {
        const { send } = mountSocket()

        sockets[0].serverOpen()
        send('one')

        expect(sockets[0].sent).toEqual(['one'])
      })

      test('send() queues messages until the socket opens, after those of onOpen', () => {
        const api = {}
        const onOpen = () => {
          api.send('auth')
        }
        const { send } = Object.assign(api, mountSocket({ onOpen }))

        send('one')
        send('two')
        expect(sockets[0].sent).toEqual([])

        sockets[0].serverOpen()

        expect(sockets[0].sent).toEqual(['auth', 'one', 'two'])
      })

      test('send() opens a closed socket', () => {
        const { socketStatus, send } = mountSocket({ manualOpen: true })

        send('early')

        expect(sockets).toHaveLength(1)
        expect(socketStatus.value).toBe('connecting')

        sockets[0].serverOpen()

        expect(sockets[0].sent).toEqual(['early'])
      })

      test('closeSocket() closes with the code and reason, without reconnecting', () => {
        const onClose = vi.fn()
        const { socketStatus, send, closeSocket } = mountSocket({
          onClose
        })
        const socket = sockets[0]

        socket.serverOpen()
        send('queued')
        closeSocket(4000, 'bye')

        expect(socket.closeCalls).toEqual([[4000, 'bye']])
        expect(socketStatus.value).toBe('closed')
        expect(onClose).not.toHaveBeenCalled()

        // the close event comes later and reports the programmatic close
        socket.serverClose(4000)
        vi.advanceTimersByTime(60_000)

        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose.mock.calls[0][0]).toBeInstanceOf(CloseEvent)
        expect(onClose.mock.calls[0][1]).toBe('programmatic')
        expect(sockets).toHaveLength(1)
        expect(socketStatus.value).toBe('closed')
      })

      test('closeSocket() lets openSocket() and send() reconnect', () => {
        const { socketStatus, send, openSocket, closeSocket } = mountSocket()

        sockets[0].serverOpen()
        closeSocket()
        openSocket()

        expect(sockets).toHaveLength(2)
        expect(socketStatus.value).toBe('connecting')

        sockets[1].serverOpen()
        closeSocket()
        send('again')

        expect(sockets).toHaveLength(3)
        sockets[2].serverOpen()
        expect(sockets[2].sent).toEqual(['again'])
      })

      test('closeSocket() drops the queued messages', () => {
        const { send, closeSocket, openSocket } = mountSocket({
          manualOpen: true
        })

        send('lost')
        closeSocket()
        openSocket()
        sockets[1].serverOpen()

        expect(sockets[1].sent).toEqual([])
      })

      test('ignores the events of a socket closed through closeSocket()', () => {
        const onMessage = vi.fn()
        const { data, closeSocket, openSocket } = mountSocket({
          onMessage
        })
        const old = sockets[0]

        old.serverOpen()
        closeSocket()
        openSocket()

        old.serverMessage('late')

        expect(data.value).toBeNull()
        expect(onMessage).not.toHaveBeenCalled()
        expect(sockets).toHaveLength(2)
      })

      test('reconnects with a doubling delay when the socket closes on its own', () => {
        const onClose = vi.fn()
        const { socketStatus } = mountSocket({ onClose })

        sockets[0].serverOpen()
        sockets[0].serverClose()

        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose.mock.calls[0][0]).toBeInstanceOf(CloseEvent)
        expect(onClose.mock.calls[0][1]).toBe('remote')
        expect(socketStatus.value).toBe('connecting')
        expect(sockets).toHaveLength(1)

        vi.advanceTimersByTime(999)
        expect(sockets).toHaveLength(1)
        vi.advanceTimersByTime(1)
        expect(sockets).toHaveLength(2)

        sockets[1].serverClose()
        vi.advanceTimersByTime(1999)
        expect(sockets).toHaveLength(2)
        vi.advanceTimersByTime(1)
        expect(sockets).toHaveLength(3)

        sockets[2].serverClose()
        vi.advanceTimersByTime(4000)
        expect(sockets).toHaveLength(4)

        // a successful open resets the delay
        sockets[3].serverOpen()
        expect(socketStatus.value).toBe('open')
        sockets[3].serverClose()
        vi.advanceTimersByTime(1000)
        expect(sockets).toHaveLength(5)
      })

      test('caps the default reconnect delay at 30s', () => {
        mountSocket()

        for (let i = 0; i < 6; i++) {
          lastSocket().serverClose()
          vi.advanceTimersByTime(30_000)
        }

        expect(sockets).toHaveLength(7)
      })

      test('"autoReconnect: false" leaves the socket closed', () => {
        const onClose = vi.fn()
        const { socketStatus } = mountSocket({
          autoReconnect: false,
          onClose
        })

        sockets[0].serverOpen()
        sockets[0].serverClose()

        expect(socketStatus.value).toBe('closed')
        expect(onClose).toHaveBeenCalledTimes(1)

        vi.advanceTimersByTime(60_000)
        expect(sockets).toHaveLength(1)
      })

      test('"autoReconnect.retries" limits the attempts', () => {
        const { socketStatus } = mountSocket({
          autoReconnect: { retries: 2, delay: 10 }
        })

        sockets[0].serverClose()
        vi.advanceTimersByTime(10)
        expect(sockets).toHaveLength(2)

        sockets[1].serverClose()
        vi.advanceTimersByTime(10)
        expect(sockets).toHaveLength(3)

        sockets[2].serverClose()
        expect(socketStatus.value).toBe('closed')

        vi.advanceTimersByTime(60_000)
        expect(sockets).toHaveLength(3)
      })

      test('calls onReconnect with the attempt and the delay', () => {
        const onReconnect = vi.fn()
        mountSocket({ onReconnect })

        sockets[0].serverClose()
        expect(onReconnect).toHaveBeenLastCalledWith(1, 1000)
        vi.advanceTimersByTime(1000)

        sockets[1].serverClose()
        expect(onReconnect).toHaveBeenLastCalledWith(2, 2000)
        vi.advanceTimersByTime(2000)

        // a successful open starts the count over
        sockets[2].serverOpen()
        sockets[2].serverClose()
        expect(onReconnect).toHaveBeenLastCalledWith(1, 1000)
        expect(onReconnect).toHaveBeenCalledTimes(3)
      })

      test('"autoReconnect.delay" accepts a function of the attempt', () => {
        const delay = vi.fn(attempt => 100 * (attempt + 1))
        mountSocket({ autoReconnect: { delay } })

        sockets[0].serverClose()
        expect(delay).toHaveBeenLastCalledWith(0)
        vi.advanceTimersByTime(100)
        expect(sockets).toHaveLength(2)

        sockets[1].serverClose()
        expect(delay).toHaveBeenLastCalledWith(1)
        vi.advanceTimersByTime(200)
        expect(sockets).toHaveLength(3)
      })

      test('waits for the "online" event instead of retrying while offline', () => {
        const onReconnect = vi.fn()
        const { socketStatus } = mountSocket({
          autoReconnect: { retries: 2, delay: 10 },
          onReconnect
        })

        sockets[0].serverOpen()
        setOnline(false)
        sockets[0].serverClose()

        expect(socketStatus.value).toBe('connecting')
        expect(onReconnect).not.toHaveBeenCalled()
        vi.advanceTimersByTime(60_000)
        expect(sockets).toHaveLength(1)

        setOnline(true)

        // a fresh run of attempts: the immediate one is attempt 1
        expect(sockets).toHaveLength(2)
        expect(socketStatus.value).toBe('connecting')
        expect(onReconnect).toHaveBeenLastCalledWith(1, 0)

        sockets[1].serverClose()
        expect(onReconnect).toHaveBeenLastCalledWith(2, 10)
        vi.advanceTimersByTime(10)
        expect(sockets).toHaveLength(3)

        sockets[2].serverClose()
        expect(socketStatus.value).toBe('closed')
        expect(onReconnect).toHaveBeenCalledTimes(2)
      })

      test('"offline" event cancels a pending reconnect', () => {
        mountSocket()

        sockets[0].serverClose()
        setOnline(false)
        vi.advanceTimersByTime(60_000)

        expect(sockets).toHaveLength(1)

        setOnline(true)
        expect(sockets).toHaveLength(2)
      })

      test('"online" event reconnects a socket that gave up', () => {
        const { socketStatus } = mountSocket({
          autoReconnect: { retries: 0 }
        })

        sockets[0].serverClose()
        expect(socketStatus.value).toBe('closed')

        setOnline(false)
        setOnline(true)

        expect(sockets).toHaveLength(2)
        expect(socketStatus.value).toBe('connecting')
      })

      test('"online" event does nothing for a socket closed by the user or without reconnect', () => {
        const manual = mountSocket({ manualOpen: true })
        const closed = mountSocket({ autoReconnect: false })

        sockets[0].serverClose()
        manual.closeSocket()
        closed.closeSocket()

        setOnline(false)
        setOnline(true)

        expect(sockets).toHaveLength(1)
      })

      test('"heartbeat: true" sends "ping" every 30s while open', () => {
        mountSocket({ heartbeat: true })
        const socket = sockets[0]

        vi.advanceTimersByTime(defaultHeartbeatInterval)
        expect(socket.sent).toEqual([])

        socket.serverOpen()
        vi.advanceTimersByTime(defaultHeartbeatInterval - 1)
        expect(socket.sent).toEqual([])
        vi.advanceTimersByTime(1)
        expect(socket.sent).toEqual(['ping'])
        vi.advanceTimersByTime(defaultHeartbeatInterval)
        expect(socket.sent).toEqual(['ping', 'ping'])

        socket.serverClose()
        vi.advanceTimersByTime(defaultHeartbeatInterval)
        expect(socket.sent).toEqual(['ping', 'ping'])
      })

      test('"heartbeat" accepts a message and an interval', () => {
        const { closeSocket } = mountSocket({
          heartbeat: { message: '{"type":"hb"}', interval: 500 }
        })
        const socket = sockets[0]

        socket.serverOpen()
        vi.advanceTimersByTime(1000)
        expect(socket.sent).toEqual(['{"type":"hb"}', '{"type":"hb"}'])

        closeSocket()
        vi.advanceTimersByTime(1000)
        expect(socket.sent).toHaveLength(2)
      })

      test('reconnects to a new URL while wanted', async () => {
        const onClose = vi.fn()
        const target = ref(url)
        const { socketStatus, send, closeSocket } = mountSocket(
          { onClose },
          target
        )

        sockets[0].serverOpen()
        target.value = 'ws://localhost/other'
        await nextTick()

        expect(sockets[0].closeCalls).toHaveLength(1)
        expect(sockets).toHaveLength(2)
        expect(sockets[1].url).toBe('ws://localhost/other')
        expect(socketStatus.value).toBe('connecting')

        // the old socket's close is reported but does not count as a failure
        sockets[0].serverClose()
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose.mock.calls[0][1]).toBe('url')
        vi.advanceTimersByTime(60_000)
        expect(sockets).toHaveLength(2)

        // queued messages go to the new socket
        send('kept')
        sockets[1].serverOpen()
        expect(sockets[1].sent).toEqual(['kept'])

        closeSocket()
        target.value = 'ws://localhost/third'
        await nextTick()

        expect(sockets).toHaveLength(2)
      })

      test('closes the socket when the component unmounts', () => {
        const onClose = vi.fn()
        const { wrapper, socketStatus } = mountSocket({ onClose })
        const socket = sockets[0]

        socket.serverOpen()
        wrapper.unmount()

        expect(socket.closeCalls).toHaveLength(1)
        expect(socketStatus.value).toBe('closed')

        socket.serverClose()
        vi.advanceTimersByTime(60_000)
        expect(sockets).toHaveLength(1)
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onClose.mock.calls[0][1]).toBe('unmount')
      })

      test('can be used outside of a component', () => {
        const { socketStatus, send, closeSocket } = useWebSocket(url)

        expect(sockets).toHaveLength(1)
        expect(socketStatus.value).toBe('connecting')

        sockets[0].serverOpen()
        send('hi')
        expect(sockets[0].sent).toEqual(['hi'])

        closeSocket()
        expect(socketStatus.value).toBe('closed')
      })
    })
  })
})
