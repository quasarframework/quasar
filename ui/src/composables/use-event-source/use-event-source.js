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
 *      sourceStatus, sourceData, sourceLastEventId, sourceError,
 *      openSource, closeSource
 *    } = useEventSource(url, options)
 *
 * url     - the stream URL (string or URL), or a ref/getter of one; an
 *           open stream reconnects to the new URL when it changes
 * options - plain object (all optional):
 *    lazy                 - do not open the stream on mount; openSource()
 *                           does it
 *    withCredentials      - send cookies/auth on a cross-origin URL
 *    events               - Array of named event types to listen to on
 *                           top of the unnamed ("message") ones
 *    autoReconnect        - reopen a stream the browser gave up on (a
 *                           non-200 response, a wrong content type, a
 *                           refused connection); the browser retries
 *                           transient network errors by itself (default:
 *                           true); false, or { retries, delay } with
 *                           retries the number of attempts (default:
 *                           Infinity) and delay the ms to wait before
 *                           each one (number or fn(attempt), default: 1s
 *                           doubling up to 30s); no attempt is made while
 *                           the browser is offline, the 'online' event
 *                           reconnects right away (attempts reset)
 *    onOpen(evt)          - called each time the stream (re)opens
 *    onMessage(data, evt) - called with each event received (evt.type is
 *                           the event name, evt.lastEventId its id)
 *    onClose(reason)      - called when the stream closes; reason is
 *                           'programmatic' (closeSource()), 'unmount',
 *                           'url' (the URL changed) or 'remote' (the
 *                           browser gave up on the connection)
 *    onError(evt)         - called with the stream's 'error' event (also
 *                           fired by the browser before its own retry)
 *    onReconnect(attempt, delay) - called when a reconnect gets
 *                           scheduled, with the 1-based attempt number
 *                           of the current run and the ms to wait
 *
 * sourceStatus - Ref<'closed' | 'connecting' | 'open'>; 'connecting' also
 *                while the browser retries or while waiting to reconnect
 * sourceData   - ShallowRef of the last event's data (String)
 * sourceLastEventId - ShallowRef of the last event's id (String)
 * sourceError  - ShallowRef of the last 'error' event
 * openSource   - opens the stream (no-op while open or connecting)
 * closeSource  - closes the stream (no reconnect; also happens on
 *                unmount); openSource() reopens it later
 */

const statusClosed = 'closed',
  statusConnecting = 'connecting',
  statusOpen = 'open'

function defaultDelay(attempt) {
  return Math.min(1000 * 2 ** attempt, 30_000)
}

export default function useEventSource(url, options) {
  const sourceStatus = ref(statusClosed)
  const sourceData = shallowRef(null)
  const sourceLastEventId = shallowRef(null)
  const sourceError = shallowRef(null)

  if (__QUASAR_SSR_SERVER__) {
    return {
      sourceStatus,
      sourceData,
      sourceLastEventId,
      sourceError,
      openSource: noop,
      closeSource: noop
    }
  }

  const vm = getCurrentInstance()
  const {
    lazy,
    withCredentials,
    events,
    autoReconnect,
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

  const eventTypes = ['message', ...(events ?? [])]

  let source = null,
    // the stream should be up (set by openSource(), cleared by
    // closeSource()); survives a failed reconnect so that the 'online'
    // event can try again
    wanted = false,
    attempt = 0,
    reconnectTimer = null

  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function detach(es) {
    es.removeEventListener('open', onSourceOpen)
    es.removeEventListener('error', onSourceError)
    eventTypes.forEach(type => {
      es.removeEventListener(type, onSourceMessage)
    })
  }

  // drops the current stream (if any) without touching `wanted`;
  // EventSource.close() is synchronous and silent, so the close is
  // reported right away
  function disconnect(reason) {
    clearReconnectTimer()

    if (source !== null) {
      const es = source
      source = null
      detach(es)
      es.close()
      onClose?.(reason)
    }
  }

  function connect() {
    const es = new EventSource(
      toValue(url),
      withCredentials === true ? { withCredentials: true } : void 0
    )

    es.addEventListener('open', onSourceOpen)
    es.addEventListener('error', onSourceError)
    eventTypes.forEach(type => {
      es.addEventListener(type, onSourceMessage)
    })

    source = es
    sourceStatus.value = statusConnecting
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

  function onSourceOpen(evt) {
    if (evt.target !== source) return

    attempt = 0
    sourceStatus.value = statusOpen
    onOpen?.(evt)
  }

  function onSourceMessage(evt) {
    if (evt.target !== source) return

    sourceData.value = evt.data
    if (evt.lastEventId !== '') {
      sourceLastEventId.value = evt.lastEventId
    }
    onMessage?.(evt.data, evt)
  }

  function onSourceError(evt) {
    if (evt.target !== source) return

    sourceError.value = evt
    onError?.(evt)

    // the browser retries transient errors by itself and reports each
    // one here with the stream back in CONNECTING; only a CLOSED stream
    // was given up on
    if (source.readyState !== EventSource.CLOSED) {
      sourceStatus.value = statusConnecting
      return
    }

    detach(source)
    source = null

    if (wanted && reconnect !== null && attempt < reconnect.retries) {
      sourceStatus.value = statusConnecting
      scheduleReconnect()
    } else {
      sourceStatus.value = statusClosed
    }

    onClose?.('remote')
  }

  function openSource() {
    wanted = true

    if (source === null && reconnectTimer === null) {
      attempt = 0
      connect()
    }
  }

  function close(reason) {
    wanted = false
    sourceStatus.value = statusClosed
    disconnect(reason)
  }

  function closeSource() {
    close('programmatic')
  }

  useEventListener(
    () => window,
    'online',
    () => {
      if (wanted && source === null && reconnect !== null) {
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
      // the server has no stream, so the client cannot have one before
      // hydration either
      onMounted(openSource)
    }

    onBeforeUnmount(() => {
      close('unmount')
    })
  } else if (lazy !== true) {
    openSource()
  }

  return {
    sourceStatus,
    sourceData,
    sourceLastEventId,
    sourceError,
    openSource,
    closeSource
  }
}
