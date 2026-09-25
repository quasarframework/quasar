import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  watch
} from 'vue'

import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      channelStatus, data, error, postMessage, connectChannel, closeChannel
 *    } = useBroadcastChannel(name, options)
 *
 * name    - the channel name (String), or a ref/getter of one; an open
 *           channel moves to the new name when it changes
 * options - plain object (all optional):
 *    manualConnect           - do not connect the channel on mount;
 *                           connectChannel() or postMessage() does it
 *    onMessage(data, evt) - called with each message received from
 *                           another browsing context (tab, window,
 *                           iframe, worker) of the same origin
 *    onError(evt)         - called with the channel's 'messageerror'
 *                           event (a message that could not be
 *                           deserialized)
 *
 * channelStatus  - Ref<'closed' | 'connected'>
 * data           - ShallowRef of the last message received (a structured
 *                  clone of what the other context posted)
 * error          - ShallowRef of the last 'messageerror' event
 * postMessage    - posts a message to the other contexts on the channel
 *                  (never to the current one); connects the channel
 *                  first if it is closed
 * connectChannel - connects the channel (no-op while connected)
 * closeChannel   - closes the channel (also happens on unmount);
 *                  connectChannel() reconnects it later
 */

const statusClosed = 'closed',
  statusConnected = 'connected'

export default function useBroadcastChannel(name, options) {
  const channelStatus = ref(statusClosed)
  const data = shallowRef(null)
  const error = shallowRef(null)

  if (__QUASAR_SSR_SERVER__) {
    return {
      channelStatus,
      data,
      error,
      postMessage: noop,
      connectChannel: noop,
      closeChannel: noop
    }
  }

  const vm = getCurrentInstance()
  const { manualConnect, onMessage, onError } = options ?? {}

  let channel = null

  function onChannelMessage(evt) {
    data.value = evt.data
    onMessage?.(evt.data, evt)
  }

  function onChannelError(evt) {
    error.value = evt
    onError?.(evt)
  }

  function connectChannel() {
    if (channel !== null) return

    channel = new BroadcastChannel(toValue(name))
    channel.addEventListener('message', onChannelMessage)
    channel.addEventListener('messageerror', onChannelError)
    channelStatus.value = statusConnected
  }

  // a closed BroadcastChannel delivers nothing anymore, so there is
  // nothing to detach
  function closeChannel() {
    if (channel !== null) {
      channel.close()
      channel = null
      channelStatus.value = statusClosed
    }
  }

  function postMessage(message) {
    connectChannel()
    channel.postMessage(message)
  }

  watch(
    () => toValue(name),
    () => {
      if (channel !== null) {
        closeChannel()
        connectChannel()
      }
    }
  )

  if (vm !== null) {
    if (manualConnect !== true) {
      // the server has no channel, so the client cannot have one before
      // hydration either
      onMounted(connectChannel)
    }

    onBeforeUnmount(closeChannel)
  } else if (manualConnect !== true) {
    connectChannel()
  }

  return {
    channelStatus,
    data,
    error,
    postMessage,
    connectChannel,
    closeChannel
  }
}
