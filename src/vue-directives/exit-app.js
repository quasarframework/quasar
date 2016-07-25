import $ from 'jquery'
import Platform from '../platform'

export default (_Vue) => {
  _Vue.directive('exit-app', {
    bind () {
      this.container = $(this.el)

      if (!Platform.is.android) {
        this.container.addClass('hidden')
        return
      }

      this.container.click(() => {
        navigator.app.exitApp()
      })
    },
    unbind () {
      if (!Platform.is.android) {
        return
      }

      this.container.off('click')
    }
  })
}
