import $ from 'jquery'

export default {
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
}
