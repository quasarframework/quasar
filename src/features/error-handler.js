import Events from './events'
import { isServer } from './platform'

/*
 * Capture errors
 */

if (!isServer) {
  window.onerror = function (message, source, lineno, colno, error) {
    Events.$emit('app:error', {
      message: message,
      source: source,
      lineno: lineno,
      colno: colno,
      error: error
    })
  }
}
