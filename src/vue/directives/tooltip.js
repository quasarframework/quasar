import $ from 'jquery'

export default (_Vue) => {
  _Vue.directive('tooltip', {
    bind () {
      var element = $(this.el)

      if (this.modifiers.wrap) {
        element.wrap('<div class="quasar-tooltip"></div>')
        this.target = element.parent()
      }
      else {
        this.target = element.addClass('quasar-tooltip')
      }

      if (this.modifiers.inline) {
        this.target.addClass('flex inline')
      }
    },
    update (value) {
      this.target.attr('quasar-tooltip', value)
    },
    unbind () {
      if (this.modifiers.wrap) {
        this.target.children().unwrap()
      }
      else {
        this.target
          .removeClass('quasar-tooltip')
          .removeAttr('quasar-tooltip')
      }
    }
  })
}
