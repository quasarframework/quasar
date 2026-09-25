import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent, h, isRef, nextTick, ref } from 'vue'

import useBroadcastChannel from './use-broadcast-channel.js'

enableAutoUnmount(afterEach)

// Real channels: two BroadcastChannel objects with the same name deliver
// to each other even inside one document, so a plain peer plays the
// other tab. The global is subclassed only to record the instances that
// the composable creates.
const NativeBroadcastChannel = globalThis.BroadcastChannel
const channels = []

class RecordingBroadcastChannel extends NativeBroadcastChannel {
  constructor(name) {
    super(name)
    this.closeCalls = 0
    channels.push(this)
  }

  close() {
    this.closeCalls++
    super.close()
  }
}

// every test file runs in its own iframe of the same origin, so the
// names must not collide across files either
let uid = 0
let peers

function channelName() {
  return `q-test-${Date.now()}-${++uid}`
}

function createPeer(name) {
  const peer = new NativeBroadcastChannel(name)
  peer.received = []
  peer.addEventListener('message', evt => {
    peer.received.push(evt.data)
  })
  peers.push(peer)
  return peer
}

function settle() {
  // message delivery is a queued task
  return new Promise(resolve => {
    setTimeout(resolve, 20)
  })
}

beforeEach(() => {
  vi.stubGlobal('BroadcastChannel', RecordingBroadcastChannel)
  peers = []
})

afterEach(() => {
  vi.unstubAllGlobals()
  peers.forEach(peer => {
    peer.close()
  })
  channels.length = 0
})

function mountChannel(options, name = channelName()) {
  let result
  const wrapper = mount(
    defineComponent({
      setup() {
        result = useBroadcastChannel(name, options)
        return () => h('div')
      }
    })
  )

  return { wrapper, name, ...result }
}

function lastChannel() {
  return channels.at(-1)
}

describe('[useBroadcastChannel API]', () => {
  describe('[Functions]', () => {
    describe('[(function)default]', () => {
      test('has correct return value', () => {
        const {
          channelStatus,
          data,
          error,
          postMessage,
          connectChannel,
          closeChannel
        } = mountChannel({ manualConnect: true })

        expect(isRef(channelStatus)).toBe(true)
        expect(channelStatus.value).toBe('closed')
        expect(isRef(data)).toBe(true)
        expect(data.value).toBeNull()
        expect(isRef(error)).toBe(true)
        expect(error.value).toBeNull()
        expect(postMessage).toBeTypeOf('function')
        expect(connectChannel).toBeTypeOf('function')
        expect(closeChannel).toBeTypeOf('function')
      })

      test('connects the channel on mount, not in setup', () => {
        const name = channelName()
        let result, statusAtSetup

        mount(
          defineComponent({
            setup() {
              result = useBroadcastChannel(name)
              statusAtSetup = result.channelStatus.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe('closed')
        expect(result.channelStatus.value).toBe('connected')
        expect(channels).toHaveLength(1)
        expect(lastChannel().name).toBe(name)
      })

      test('manualConnect waits for connectChannel() or postMessage()', async () => {
        const {
          channelStatus,
          connectChannel,
          postMessage,
          closeChannel,
          name
        } = mountChannel({ manualConnect: true })
        const peer = createPeer(name)

        expect(channels).toHaveLength(0)
        expect(channelStatus.value).toBe('closed')

        connectChannel()
        expect(channels).toHaveLength(1)
        expect(lastChannel().name).toBe(name)
        expect(channelStatus.value).toBe('connected')

        closeChannel()
        expect(channelStatus.value).toBe('closed')

        postMessage('via post')
        expect(channels).toHaveLength(2)
        expect(channelStatus.value).toBe('connected')
        await vi.waitFor(() => {
          expect(peer.received).toEqual(['via post'])
        })
      })

      test('receives the messages posted by another context', async () => {
        const onMessage = vi.fn()
        const { data, name } = mountChannel({ onMessage })
        const peer = createPeer(name)

        peer.postMessage('hello')

        await vi.waitFor(() => {
          expect(data.value).toBe('hello')
        })
        expect(onMessage).toHaveBeenCalledExactlyOnceWith(
          'hello',
          expect.any(MessageEvent)
        )
        expect(onMessage.mock.calls[0][1].data).toBe('hello')

        peer.postMessage('again')

        await vi.waitFor(() => {
          expect(data.value).toBe('again')
        })
        expect(onMessage).toHaveBeenCalledTimes(2)
      })

      test('delivers a structured clone of the message', async () => {
        const { data, name } = mountChannel()
        const message = { list: [1, 2], when: new Date(0) }

        createPeer(name).postMessage(message)

        await vi.waitFor(() => {
          expect(data.value).toEqual(message)
        })
        expect(data.value).not.toBe(message)
        expect(data.value.when).toBeInstanceOf(Date)
      })

      test('postMessage() reaches the other contexts, not the current one', async () => {
        const onMessage = vi.fn()
        const { data, postMessage, name } = mountChannel({ onMessage })
        const peer = createPeer(name)
        const other = createPeer(name)

        postMessage({ n: 1 })

        await vi.waitFor(() => {
          expect(peer.received).toEqual([{ n: 1 }])
          expect(other.received).toEqual([{ n: 1 }])
        })
        await settle()
        expect(data.value).toBeNull()
        expect(onMessage).not.toHaveBeenCalled()
      })

      test('postMessage() opens a closed channel first', async () => {
        const { postMessage, closeChannel, name } = mountChannel()
        const peer = createPeer(name)

        closeChannel()
        expect(channels).toHaveLength(1)
        expect(lastChannel().closeCalls).toBe(1)

        postMessage('back')

        expect(channels).toHaveLength(2)
        expect(lastChannel().name).toBe(name)
        await vi.waitFor(() => {
          expect(peer.received).toEqual(['back'])
        })
      })

      test('mirrors a messageerror event into error and onError', () => {
        const onError = vi.fn()
        const { error } = mountChannel({ onError })
        const evt = new MessageEvent('messageerror', { data: null })

        lastChannel().dispatchEvent(evt)

        expect(error.value).toBe(evt)
        expect(onError).toHaveBeenCalledExactlyOnceWith(evt)
      })

      test('closeChannel() stops receiving; connectChannel() reconnects', async () => {
        const { channelStatus, data, closeChannel, connectChannel, name } =
          mountChannel()
        const peer = createPeer(name)
        const first = lastChannel()

        expect(channelStatus.value).toBe('connected')

        closeChannel()
        expect(first.closeCalls).toBe(1)
        expect(channelStatus.value).toBe('closed')

        // idempotent
        closeChannel()
        expect(first.closeCalls).toBe(1)

        peer.postMessage('lost')
        await settle()
        expect(data.value).toBeNull()

        connectChannel()
        expect(channels).toHaveLength(2)
        expect(lastChannel()).not.toBe(first)
        expect(channelStatus.value).toBe('connected')

        // no-op while open
        connectChannel()
        expect(channels).toHaveLength(2)

        peer.postMessage('found')
        await vi.waitFor(() => {
          expect(data.value).toBe('found')
        })
      })

      test('moves a connected channel when the name changes', async () => {
        const name = ref(channelName())
        const { channelStatus, data } = mountChannel(void 0, name)
        const first = lastChannel()
        const oldPeer = createPeer(name.value)

        name.value = channelName()
        await nextTick()

        expect(first.closeCalls).toBe(1)
        expect(channels).toHaveLength(2)
        expect(lastChannel().name).toBe(name.value)
        expect(channelStatus.value).toBe('connected')

        const newPeer = createPeer(name.value)

        oldPeer.postMessage('old')
        newPeer.postMessage('new')

        await vi.waitFor(() => {
          expect(data.value).toBe('new')
        })
        await settle()
        expect(data.value).toBe('new')
      })

      test('a name change on a closed channel leaves it closed', async () => {
        const name = ref(channelName())
        const { closeChannel, connectChannel } = mountChannel(void 0, name)

        closeChannel()
        name.value = channelName()
        await nextTick()

        expect(channels).toHaveLength(1)

        connectChannel()
        expect(channels).toHaveLength(2)
        expect(lastChannel().name).toBe(name.value)
      })

      test('closes the channel when the component gets destroyed', async () => {
        const { wrapper, channelStatus, data, name } = mountChannel()
        const peer = createPeer(name)

        wrapper.unmount()

        expect(lastChannel().closeCalls).toBe(1)
        expect(channelStatus.value).toBe('closed')

        peer.postMessage('late')
        await settle()
        expect(data.value).toBeNull()
      })

      test('manualConnect holds outside of a component too', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { connectChannel, closeChannel } = useBroadcastChannel(
          channelName(),
          { manualConnect: true }
        )

        expect(channels).toHaveLength(0)

        connectChannel()
        expect(channels).toHaveLength(1)

        closeChannel()
        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
      })

      test('can be used outside of a component', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const name = channelName()
        const { channelStatus, data, postMessage, closeChannel } =
          useBroadcastChannel(name)
        const peer = createPeer(name)

        expect(warn).not.toHaveBeenCalled()
        expect(channels).toHaveLength(1)
        expect(channelStatus.value).toBe('connected')

        peer.postMessage('hi')
        await vi.waitFor(() => {
          expect(data.value).toBe('hi')
        })

        postMessage('there')
        await vi.waitFor(() => {
          expect(peer.received).toEqual(['there'])
        })

        closeChannel()
        expect(lastChannel().closeCalls).toBe(1)
        warn.mockRestore()
      })
    })
  })
})
