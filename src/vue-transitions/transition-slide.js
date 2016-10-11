export default {
  enter (el, done) {
    Velocity(el, 'stop')
    Velocity(el, 'slideDown', done)
  },
  enterCancelled (el) {
    Velocity(el, 'stop')
    el.removeAttribute('style')
  },

  leave (el, done) {
    Velocity(el, 'stop')
    Velocity(el, 'slideUp', done)
  },
  leaveCancelled (el) {
    Velocity(el, 'stop')
    el.removeAttribute('style')
  }
}
