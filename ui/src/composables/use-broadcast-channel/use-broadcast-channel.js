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
 *      isChannelConnected, channelData, channelError,
 *      postChannelMessage, connectChannel, closeChannel
 *    } = useBroadcastChannel(name, options)
 *
 * name    - the channel name (String), or a ref/getter of one; an open
 *           channel moves to the new name when it changes
 * options - plain object (all optional):
 *    lazy                 - do not connect the channel on mount (or
 *                           right away, outside of a component);
 *                           connectChannel() or postChannelMessage()
 *                           does it
 *    onConnect()          - called each time the channel gets connected
 *    onMessage(data, evt) - called with each message received from
 *                           another browsing context (tab, window,
 *                           iframe, worker) of the same origin
 *    onError(evt)         - called with the channel's 'messageerror'
 *                           event (a message that could not be
 *                           deserialized)
 *    onClose(reason)      - called each time the channel gets closed;
 *                           reason is 'programmatic' (a closeChannel()
 *                           call), 'unmount' or 'name' (the channel
 *                           moves to a new name, so onConnect() follows)
 *
 * isChannelConnected - Ref<Boolean>
 * channelData        - ShallowRef of the last message received (a
 *                      structured clone of what the other context
 *                      posted)
 * channelError       - ShallowRef of the last 'messageerror' event
 * postChannelMessage - posts a message to the other contexts on the
 *                      channel (never to the current one); connects the
 *                      channel first if it is closed
 * connectChannel     - connects the channel (no-op while connected)
 * closeChannel       - closes the channel (also happens on unmount);
 *                      connectChannel() reconnects it later
 *
 * The name watcher only lives while the channel is connected, so a call
 * outside of a component is fully released by closeChannel(). Once the
 * component got destroyed, connectChannel() and postChannelMessage()
 * are no-ops.
 */

export default function useBroadcastChannel(name, options) {
  const isChannelConnected = ref(false)
  const channelData = shallowRef(null)
  const channelError = shallowRef(null)

  if (__QUASAR_SSR_SERVER__) {
    return {
      isChannelConnected,
      channelData,
      channelError,
      postChannelMessage: noop,
      connectChannel: noop,
      closeChannel: noop
    }
  }

  const vm = getCurrentInstance()
  const { lazy, onConnect, onMessage, onError, onClose } = options ?? {}

  let channel = null,
    // set once the component got destroyed; the channel stays closed
    unmounted = false,
    // the name watcher, while connected
    stopNameWatch = null

  function onChannelMessage(evt) {
    channelData.value = evt.data
    onMessage?.(evt.data, evt)
  }

  function onChannelError(evt) {
    channelError.value = evt
    onError?.(evt)
  }

  function connectChannel() {
    if (channel !== null || unmounted) return

    channel = new BroadcastChannel(toValue(name))
    channel.addEventListener('message', onChannelMessage)
    channel.addEventListener('messageerror', onChannelError)
    isChannelConnected.value = true

    // a connected channel moves to the new name; released with the
    // channel, so that nothing survives a closeChannel() outside of a
    // component
    if (stopNameWatch === null) {
      stopNameWatch = watch(
        () => toValue(name),
        () => {
          close('name')
          connectChannel()
        }
      )
    }

    onConnect?.()
  }

  // a closed BroadcastChannel delivers nothing anymore, so there is
  // nothing to detach
  function close(reason) {
    if (channel !== null) {
      channel.close()
      channel = null
      isChannelConnected.value = false
      onClose?.(reason)
    }
  }

  function release(reason) {
    close(reason)

    if (stopNameWatch !== null) {
      stopNameWatch()
      stopNameWatch = null
    }
  }

  function closeChannel() {
    release('programmatic')
  }

  function postChannelMessage(message) {
    connectChannel()
    channel?.postMessage(message)
  }

  if (vm !== null) {
    if (lazy !== true) {
      // the server has no channel, so the client cannot have one before
      // hydration either
      onMounted(connectChannel)
    }

    onBeforeUnmount(() => {
      unmounted = true
      release('unmount')
    })
  } else if (lazy !== true) {
    connectChannel()
  }

  return {
    isChannelConnected,
    channelData,
    channelError,
    postChannelMessage,
    connectChannel,
    closeChannel
  }
}
