import { events } from './events'

/*
 * Capture errors
 */
window.onerror = function (message, source, lineno, colno, error) {
  events.trigger('app:error', {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error
  })
}
