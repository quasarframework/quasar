export default {
  bind () {
    this.clickHandler = () => {
      this.el.classList.toggle('active')

      if (!this.free) {
        [].slice.call(this.el.parentNode.children).forEach(li => {
          if (li !== this.el) {
            li.classList.remove('active')
          }
        })
      }
    }

    this.el.children[0].addEventListener('click', this.clickHandler)
  },
  update () {
    this.free = !!this.modifiers.free
  },
  unbind () {
    this.el.children[0].removeEventListener('click', this.clickHandler)
  }
}
