import {
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  watch
} from 'vue'

import useEventListener from '../use-event-listener/use-event-listener.js'
import { noop } from '../../utils/event/event.js'

/*
 * Usage:
 *    const {
 *      socketStatus, socketData, socketError, sendSocketMessage,
 *      openSocket, closeSocket
 *    } = useWebSocket(url, options)
 *
 * url     - the socket URL (string or URL), or a ref/getter of one; a
 *           relative or http(s) URL is resolved against the page and
 *           mapped to ws(s); an open socket reconnects to the new URL
 *           when it changes
 * options - plain object (all optional):
 *    lazy                 - do not open the socket on mount; openSocket()
 *                           or the first sendSocketMessage() does it
 *    protocols            - the native sub-protocol(s) (string or Array)
 *    binaryType           - 'blob' (default) or 'arraybuffer'
 *    autoReconnect        - reopen a socket that closed on its own
 *                           (default: true); false, or { retries, delay }
 *                           with retries the number of attempts (default:
 *                           Infinity) and delay the ms to wait before each
 *                           one (number or fn(attempt), default: 1s
 *                           doubling up to 30s); no attempt is made while
 *                           the browser is offline, the 'online' event
 *                           reconnects right away (attempts reset)
 *    heartbeat            - send a message at a fixed interval while open:
 *                           true, or { message (default: 'ping'), interval
 *                           (ms, default: 30000) }
 *    onOpen(evt)          - called each time the socket opens
 *    onMessage(data, evt) - called with each message received
 *    onClose(evt, reason) - called when the socket closes; reason is
 *                           'programmatic' (closeSocket()), 'unmount',
 *                           'url' (the URL changed) or 'remote' (the
 *                           socket closed on its own: server or network)
 *    onError(evt)         - called with the socket's 'error' event
 *    onReconnect(attempt, delay) - called when a reconnect gets
 *                           scheduled, with the 1-based attempt number
 *                           of the current run and the ms to wait
 *
 * socketStatus - Ref<'closed' | 'connecting' | 'open'>; 'connecting' also
 *                while waiting to reconnect
 * socketData   - ShallowRef of the last message's data
 * socketError  - ShallowRef of the last 'error' event
 * sendSocketMessage - sends a message; opens the socket if needed and
 *                queues the message until it is open
 * openSocket   - opens the socket (no-op while open or connecting)
 * closeSocket  - closes the socket (no reconnect, queued messages are
 *                dropped; also happens on unmount); code and reason are
 *                the native ones; openSocket() or sendSocketMessage()
 *                reopen it later
 */

const statusClosed = 'closed',
  statusConnecting = 'connecting',
  statusOpen = 'open'

const defaultHeartbeat = { message: 'ping', interval: 30_000 }

function defaultDelay(attempt) {
  return Math.min(1000 * 2 ** attempt, 30_000)
}

// the WebSocket constructor itself resolves relative URLs and maps
// http(s) to ws(s) since Chrome 125, Firefox 124 and Safari 17.4; the
// browsers at our floor need a ws(s) URL, so this helper can be dropped
// once the floor passes those versions
function resolveUrl(target) {
  const resolved = new URL(target, location.href)

  if (resolved.protocol === 'http:') {
    resolved.protocol = 'ws:'
  } else if (resolved.protocol === 'https:') {
    resolved.protocol = 'wss:'
  }

  return resolved
}

export default function useWebSocket(url, options) {
  const socketStatus = ref(statusClosed)
  const socketData = shallowRef(null)
  const socketError = shallowRef(null)

  if (__QUASAR_SSR_SERVER__) {
    return {
      socketStatus,
      socketData,
      socketError,
      sendSocketMessage: noop,
      openSocket: noop,
      closeSocket: noop
    }
  }

  const vm = getCurrentInstance()
  const {
    lazy,
    protocols,
    binaryType,
    autoReconnect,
    heartbeat,
    onOpen,
    onMessage,
    onClose,
    onError,
    onReconnect
  } = options ?? {}

  const reconnect =
    autoReconnect === false
      ? null
      : {
          retries: autoReconnect?.retries ?? Infinity,
          delay: autoReconnect?.delay ?? defaultDelay
        }

  const ping =
    heartbeat === void 0 || heartbeat === false
      ? null
      : { ...defaultHeartbeat, ...(heartbeat === true ? {} : heartbeat) }

  let socket = null,
    // the socket should be up (set by openSocket()/sendSocketMessage(),
    // cleared by
    // closeSocket()); survives a failed reconnect so that the 'online'
    // event can try again
    wanted = false,
    attempt = 0,
    reconnectTimer = null,
    heartbeatTimer = null,
    queue = []

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function stopHeartbeat() {
    if (heartbeatTimer !== null) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  function detach(ws) {
    ws.removeEventListener('open', onSocketOpen)
    ws.removeEventListener('message', onSocketMessage)
    ws.removeEventListener('error', onSocketError)
    ws.removeEventListener('close', onSocketClose)
  }

  // drops the current socket (if any) without touching `wanted`; the
  // socket's own close event still reports it through onClose, with
  // the given reason, once it arrives
  function disconnect(reason, code, nativeReason) {
    clearReconnectTimer()
    stopHeartbeat()

    if (socket !== null) {
      const ws = socket
      socket = null
      detach(ws)

      if (onClose !== void 0) {
        ws.addEventListener(
          'close',
          evt => {
            onClose(evt, reason)
          },
          { once: true }
        )
      }

      ws.close(code, nativeReason)
    }
  }

  function connect() {
    const ws = new WebSocket(resolveUrl(toValue(url)), protocols)

    if (binaryType !== void 0) {
      ws.binaryType = binaryType
    }

    ws.addEventListener('open', onSocketOpen)
    ws.addEventListener('message', onSocketMessage)
    ws.addEventListener('error', onSocketError)
    ws.addEventListener('close', onSocketClose)

    socket = ws
    socketStatus.value = statusConnecting
  }

  function scheduleReconnect() {
    // the 'online' event connects as soon as the browser is back
    if (!navigator.onLine) return

    const { delay } = reconnect
    const ms = typeof delay === 'function' ? delay(attempt) : delay

    attempt++
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connect()
    }, ms)

    onReconnect?.(attempt, ms)
  }

  function onSocketOpen(evt) {
    if (evt.target !== socket) return

    attempt = 0
    socketStatus.value = statusOpen

    if (ping !== null) {
      heartbeatTimer = setInterval(() => {
        socket.send(ping.message)
      }, ping.interval)
    }

    // the hook goes first so that a handshake it sends (authentication)
    // reaches the server before the queued messages
    onOpen?.(evt)

    if (queue.length !== 0) {
      const pending = queue
      queue = []
      pending.forEach(message => {
        socket.send(message)
      })
    }
  }

  function onSocketMessage(evt) {
    if (evt.target !== socket) return

    socketData.value = evt.data
    onMessage?.(evt.data, evt)
  }

  function onSocketError(evt) {
    if (evt.target !== socket) return

    socketError.value = evt
    onError?.(evt)
  }

  function onSocketClose(evt) {
    if (evt.target !== socket) return

    detach(socket)
    socket = null
    stopHeartbeat()

    if (wanted && reconnect !== null && attempt < reconnect.retries) {
      socketStatus.value = statusConnecting
      scheduleReconnect()
    } else {
      socketStatus.value = statusClosed
    }

    onClose?.(evt, 'remote')
  }

  function openSocket() {
    wanted = true

    if (socket === null && reconnectTimer === null) {
      attempt = 0
      connect()
    }
  }

  function close(reason, code, nativeReason) {
    wanted = false
    queue = []
    socketStatus.value = statusClosed
    disconnect(reason, code, nativeReason)
  }

  function closeSocket(code, reason) {
    close('programmatic', code, reason)
  }

  useEventListener(
    () => window,
    'online',
    () => {
      if (wanted && socket === null && reconnect !== null) {
        // a fresh run of attempts, starting right away
        clearReconnectTimer()
        attempt = 1
        connect()
        onReconnect?.(1, 0)
      }
    }
  )

  useEventListener(() => window, 'offline', clearReconnectTimer)

  watch(
    () => toValue(url),
    () => {
      if (wanted) {
        disconnect('url')
        attempt = 0
        connect()
      }
    }
  )

  if (vm !== null) {
    if (lazy !== true) {
      // the server has no socket, so the client cannot have one before
      // hydration either
      onMounted(openSocket)
    }

    onBeforeUnmount(() => {
      close('unmount')
    })
  } else if (lazy !== true) {
    openSocket()
  }

  return {
    socketStatus,
    socketData,
    socketError,

    sendSocketMessage(message) {
      if (socket !== null && socket.readyState === WebSocket.OPEN) {
        socket.send(message)
      } else {
        queue.push(message)
        openSocket()
      }
    },

    openSocket,
    closeSocket
  }
}
