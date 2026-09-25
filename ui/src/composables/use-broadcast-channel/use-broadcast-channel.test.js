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
          isChannelConnected,
          channelData,
          channelError,
          postChannelMessage,
          connectChannel,
          closeChannel
        } = mountChannel({ lazy: true })

        expect(isRef(isChannelConnected)).toBe(true)
        expect(isChannelConnected.value).toBe(false)
        expect(isRef(channelData)).toBe(true)
        expect(channelData.value).toBeNull()
        expect(isRef(channelError)).toBe(true)
        expect(channelError.value).toBeNull()
        expect(postChannelMessage).toBeTypeOf('function')
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
              statusAtSetup = result.isChannelConnected.value
              return () => h('div')
            }
          })
        )

        expect(statusAtSetup).toBe(false)
        expect(result.isChannelConnected.value).toBe(true)
        expect(channels).toHaveLength(1)
        expect(lastChannel().name).toBe(name)
      })

      test('"lazy" option waits for connectChannel() or postChannelMessage()', async () => {
        const {
          isChannelConnected,
          connectChannel,
          postChannelMessage,
          closeChannel,
          name
        } = mountChannel({ lazy: true })
        const peer = createPeer(name)

        expect(channels).toHaveLength(0)
        expect(isChannelConnected.value).toBe(false)

        connectChannel()
        expect(channels).toHaveLength(1)
        expect(lastChannel().name).toBe(name)
        expect(isChannelConnected.value).toBe(true)

        closeChannel()
        expect(isChannelConnected.value).toBe(false)

        postChannelMessage('via post')
        expect(channels).toHaveLength(2)
        expect(isChannelConnected.value).toBe(true)
        await vi.waitFor(() => {
          expect(peer.received).toEqual(['via post'])
        })
      })

      test('receives the messages posted by another context', async () => {
        const onMessage = vi.fn()
        const { channelData, name } = mountChannel({ onMessage })
        const peer = createPeer(name)

        peer.postMessage('hello')

        await vi.waitFor(() => {
          expect(channelData.value).toBe('hello')
        })
        expect(onMessage).toHaveBeenCalledExactlyOnceWith(
          'hello',
          expect.any(MessageEvent)
        )
        expect(onMessage.mock.calls[0][1].data).toBe('hello')

        peer.postMessage('again')

        await vi.waitFor(() => {
          expect(channelData.value).toBe('again')
        })
        expect(onMessage).toHaveBeenCalledTimes(2)
      })

      test('delivers a structured clone of the message', async () => {
        const { channelData, name } = mountChannel()
        const message = { list: [1, 2], when: new Date(0) }

        createPeer(name).postMessage(message)

        await vi.waitFor(() => {
          expect(channelData.value).toEqual(message)
        })
        expect(channelData.value).not.toBe(message)
        expect(channelData.value.when).toBeInstanceOf(Date)
      })

      test('postChannelMessage() reaches the other contexts, not the current one', async () => {
        const onMessage = vi.fn()
        const { channelData, postChannelMessage, name } = mountChannel({
          onMessage
        })
        const peer = createPeer(name)
        const other = createPeer(name)

        postChannelMessage({ n: 1 })

        await vi.waitFor(() => {
          expect(peer.received).toEqual([{ n: 1 }])
          expect(other.received).toEqual([{ n: 1 }])
        })
        await settle()
        expect(channelData.value).toBeNull()
        expect(onMessage).not.toHaveBeenCalled()
      })

      test('postChannelMessage() opens a closed channel first', async () => {
        const { postChannelMessage, closeChannel, name } = mountChannel()
        const peer = createPeer(name)

        closeChannel()
        expect(channels).toHaveLength(1)
        expect(lastChannel().closeCalls).toBe(1)

        postChannelMessage('back')

        expect(channels).toHaveLength(2)
        expect(lastChannel().name).toBe(name)
        await vi.waitFor(() => {
          expect(peer.received).toEqual(['back'])
        })
      })

      test('mirrors a messageerror event into channelError and onError', () => {
        const onError = vi.fn()
        const { channelError } = mountChannel({ onError })
        const evt = new MessageEvent('messageerror', { data: null })

        lastChannel().dispatchEvent(evt)

        expect(channelError.value).toBe(evt)
        expect(onError).toHaveBeenCalledExactlyOnceWith(evt)
      })

      test('calls onConnect each time the channel gets connected', async () => {
        const onConnect = vi.fn()
        const name = ref(channelName())
        const { connectChannel, closeChannel } = mountChannel(
          { onConnect },
          name
        )

        expect(onConnect).toHaveBeenCalledTimes(1)

        // no-op while connected
        connectChannel()
        expect(onConnect).toHaveBeenCalledTimes(1)

        closeChannel()
        connectChannel()
        expect(onConnect).toHaveBeenCalledTimes(2)

        name.value = channelName()
        await nextTick()
        expect(onConnect).toHaveBeenCalledTimes(3)
      })

      test('"lazy" option delays onConnect to the first connection', () => {
        const onConnect = vi.fn()
        const { postChannelMessage } = mountChannel({ lazy: true, onConnect })

        expect(onConnect).not.toHaveBeenCalled()

        postChannelMessage('first')
        expect(onConnect).toHaveBeenCalledTimes(1)
      })

      test('calls onClose with the reason: closeChannel(), a name change, unmount', async () => {
        const onClose = vi.fn()
        const onConnect = vi.fn()
        const name = ref(channelName())
        const { wrapper, closeChannel, connectChannel } = mountChannel(
          { onConnect, onClose },
          name
        )

        closeChannel()
        expect(onClose).toHaveBeenCalledExactlyOnceWith('programmatic')

        // idempotent
        closeChannel()
        expect(onClose).toHaveBeenCalledTimes(1)

        connectChannel()
        name.value = channelName()
        await nextTick()
        expect(onClose).toHaveBeenCalledTimes(2)
        expect(onClose).toHaveBeenLastCalledWith('name')
        expect(onConnect).toHaveBeenCalledTimes(3)
        expect(onClose.mock.invocationCallOrder[1]).toBeLessThan(
          onConnect.mock.invocationCallOrder[2]
        )

        wrapper.unmount()
        expect(onClose).toHaveBeenCalledTimes(3)
        expect(onClose).toHaveBeenLastCalledWith('unmount')
      })

      test('onClose is not called when there is no channel to close', () => {
        const onClose = vi.fn()
        const { wrapper, closeChannel } = mountChannel({ lazy: true, onClose })

        closeChannel()
        wrapper.unmount()

        expect(onClose).not.toHaveBeenCalled()
      })

      test('closeChannel() stops receiving; connectChannel() reconnects', async () => {
        const {
          isChannelConnected,
          channelData,
          closeChannel,
          connectChannel,
          name
        } = mountChannel()
        const peer = createPeer(name)
        const first = lastChannel()

        expect(isChannelConnected.value).toBe(true)

        closeChannel()
        expect(first.closeCalls).toBe(1)
        expect(isChannelConnected.value).toBe(false)

        // idempotent
        closeChannel()
        expect(first.closeCalls).toBe(1)

        peer.postMessage('lost')
        await settle()
        expect(channelData.value).toBeNull()

        connectChannel()
        expect(channels).toHaveLength(2)
        expect(lastChannel()).not.toBe(first)
        expect(isChannelConnected.value).toBe(true)

        // no-op while open
        connectChannel()
        expect(channels).toHaveLength(2)

        peer.postMessage('found')
        await vi.waitFor(() => {
          expect(channelData.value).toBe('found')
        })
      })

      test('moves a connected channel when the name changes', async () => {
        const name = ref(channelName())
        const { isChannelConnected, channelData } = mountChannel(void 0, name)
        const first = lastChannel()
        const oldPeer = createPeer(name.value)

        name.value = channelName()
        await nextTick()

        expect(first.closeCalls).toBe(1)
        expect(channels).toHaveLength(2)
        expect(lastChannel().name).toBe(name.value)
        expect(isChannelConnected.value).toBe(true)

        const newPeer = createPeer(name.value)

        oldPeer.postMessage('old')
        newPeer.postMessage('new')

        await vi.waitFor(() => {
          expect(channelData.value).toBe('new')
        })
        await settle()
        expect(channelData.value).toBe('new')
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
        const { wrapper, isChannelConnected, channelData, name } =
          mountChannel()
        const peer = createPeer(name)

        wrapper.unmount()

        expect(lastChannel().closeCalls).toBe(1)
        expect(isChannelConnected.value).toBe(false)

        peer.postMessage('late')
        await settle()
        expect(channelData.value).toBeNull()
      })

      test('does nothing once the component got destroyed', async () => {
        const {
          wrapper,
          isChannelConnected,
          connectChannel,
          postChannelMessage,
          name
        } = mountChannel()
        const peer = createPeer(name)

        wrapper.unmount()

        connectChannel()
        postChannelMessage('late')
        await settle()

        expect(channels).toHaveLength(1)
        expect(isChannelConnected.value).toBe(false)
        expect(peer.received).toEqual([])
      })

      test('closeChannel() releases the name watcher outside of a component; connectChannel() attaches it again', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const room = ref(channelName())
        const name = vi.fn(() => room.value)
        const { connectChannel, closeChannel } = useBroadcastChannel(name)

        expect(channels).toHaveLength(1)

        closeChannel()

        // the watcher is gone: a name change reads nothing anymore
        name.mockClear()
        room.value = channelName()
        await nextTick()
        expect(name).not.toHaveBeenCalled()
        expect(channels).toHaveLength(1)

        connectChannel()
        expect(channels).toHaveLength(2)
        expect(lastChannel().name).toBe(room.value)

        room.value = channelName()
        await nextTick()
        expect(channels).toHaveLength(3)
        expect(lastChannel().name).toBe(room.value)

        closeChannel()
        expect(lastChannel().closeCalls).toBe(1)
        expect(warn).not.toHaveBeenCalled()
        warn.mockRestore()
      })

      test('"lazy" option holds outside of a component too', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const { connectChannel, closeChannel } = useBroadcastChannel(
          channelName(),
          { lazy: true }
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
        const {
          isChannelConnected,
          channelData,
          postChannelMessage,
          closeChannel
        } = useBroadcastChannel(name)
        const peer = createPeer(name)

        expect(warn).not.toHaveBeenCalled()
        expect(channels).toHaveLength(1)
        expect(isChannelConnected.value).toBe(true)

        peer.postMessage('hi')
        await vi.waitFor(() => {
          expect(channelData.value).toBe('hi')
        })

        postChannelMessage('there')
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
