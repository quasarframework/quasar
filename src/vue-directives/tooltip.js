export default {
  bind () {
    if (this.modifiers.wrap) {
      this.target = document.createElement('div')

      this.el.parentNode.insertBefore(this.target, this.el)
      this.target.appendChild(this.el)
    }
    else {
      this.target = this.el
    }

    this.target.classList.add('quasar-tooltip')

    if (this.modifiers.inline) {
      this.target.classList.add('flex', 'inline')
    }
  },
  update (value) {
    this.target.setAttribute('quasar-tooltip', value)
  }
}
