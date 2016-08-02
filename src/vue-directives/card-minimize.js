import $ from 'jquery'

export default {
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
}
