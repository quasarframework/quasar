import $ from 'jquery'

export default {
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
}
