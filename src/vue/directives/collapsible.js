import $ from 'jquery'

export default (_Vue) => {
  _Vue.directive('collapsible', {
    bind () {
      var self = this

      $(this.el)
      .addClass('collapsible')
      .children().each(function () {
        $(this).find('div:first-child').click(function () {
          var items = $(this).parent().toggleClass('active')

          if (self.oneAtATime) {
            items.siblings().removeClass('active')
          }
        })
      })
    },
    update (freely) {
      this.oneAtATime = !freely
    },
    unbind () {
      $(this.el).find('li').each(function () {
        $(this).find('div:first-child').off('click')
      })
    }
  })
}
