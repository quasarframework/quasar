import $ from 'jquery'

export default (_Vue) => {
  _Vue.transition('slide', {
    css: false,

    enter (el, done) {
      $(el).velocity('stop').velocity('slideDown', done)
    },
    enterCancelled (el) {
      $(el).velocity('stop')
    },

    leave (el, done) {
      $(el).velocity('stop').velocity('slideUp', done)
    },
    leaveCancelled (el) {
      $(el).velocity('stop')
    }
  })
}
