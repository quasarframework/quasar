import $ from 'jquery'
import Environment from '../../environment'

export default (_Vue) => {
  _Vue.directive('hover', {
    update (handler) {
      if (!Environment.runs.on.desktop) {
        return
      }

      this.container = $(this.el)
      this.onHover = () => {
        handler(true)
      }
      this.onBlur = () => {
        handler(false)
      }

      this.container.hover(this.onHover, this.onBlur)
    },
    unbind () {
      if (!Environment.runs.on.desktop) {
        return
      }

      this.container.off('hover')
    }
  })
}
