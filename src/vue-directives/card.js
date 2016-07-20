import $ from 'jquery'

export default (_Vue) => {
  _Vue.directive('card-minimize', {
    bind () {
      this.button = $(this.el)
      this.target = this.button.parents('.card').children().filter(':not(.card-title)')
    },
    update (fn) {
      if (fn && typeof fn !== 'function') {
        throw new Error('v-card-minimize requires a function if parameter is specified. ' + fn)
      }

      this.button.click(() => {
        this.target.slideToggle({complete: fn})
      })
    },
    unbind () {
      this.button.off('click')
    }
  })

  _Vue.directive('card-close', {
    bind () {
      this.button = $(this.el)
      this.card = $(this.button.parents('.card').get(0))
    },
    update (fn) {
      if (fn && typeof fn !== 'function') {
        throw new Error('v-card-close requires a function if parameter is specified. ' + fn)
      }

      this.button.click(() => {
        this.card.slideUp({complete: fn})
      })
    },
    unbind () {
      this.button.off('click')
    }
  })

  _Vue.directive('card-details', {
    bind () {
      let
        el = $(this.el),
        cover = el.find('> .card-cover'),
        content = el.find('> .card-content'),
        reveal = el.find('> .card-details'),
        activatorTarget = content.length > 0 ? content : cover

      if (cover.length === 0 || reveal.length === 0) {
        throw new Error('Card reveal directive with no cover and/or reveal content.')
      }

      this.dismisser = $('<div class="default dismiss"><i>close</i></div>')
      this.dismisser
        .appendTo(reveal)
        .click(() => {
          reveal.removeClass('active')
        })

      this.activator = $('<div class="card-details-activator"><i>more_horiz</i></div>')
      this.activator
        .appendTo(activatorTarget)
        .click(() => {
          reveal.addClass('active')
        })

      el.addClass('card-with-details')
      activatorTarget.css('position', 'relative')
    },
    unbind () {
      this.dismisser.off('click')
      this.activator.off('click')
    }
  })
}
