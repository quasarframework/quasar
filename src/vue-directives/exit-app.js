import $ from 'jquery'
import Environment from '../environment'

export default (_Vue) => {
  _Vue.directive('exit-app', {
    bind () {
      this.container = $(this.el)

      if (!Environment.runs.on.android) {
        this.container.addClass('hidden')
        return
      }

      this.container.click(() => {
        navigator.app.exitApp()
      })
    },
    unbind () {
      if (!Environment.runs.on.android) {
        return
      }

      this.container.off('click')
    }
  })
}
