import $ from 'jquery'
import Platform from '../platform'

export default {
  update (handler) {
    if (!Platform.is.desktop) {
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
    if (!Platform.is.desktop) {
      return
    }

    this.container.off('hover')
  }
}
