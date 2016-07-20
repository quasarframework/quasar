import $ from 'jquery'

const
  body = $('body'),
  win = $(window),
  offset = 20

function animate (menuElement, position, duration, opening, fixed) {
  let
    windowWidth = win.width(),
    windowHeight = win.height(),
    menu = $(menuElement),
    menuWidth = menu.width(),
    menuHeight = menu.height(),
    toRight = position.left + menuWidth < windowWidth || 2 * position.left < windowWidth,
    toBottom = position.top + menuHeight < windowHeight || 2 * position.top < windowHeight,
    css = {
      top: '',
      right: '',
      bottom: '',
      left: '',
      maxHeight: ''
    }

  if (toRight) {
    css.left = position.left + 'px'
  }
  else {
    css.left = Math.max(10, position.left - menuWidth) + 'px'
  }

  if (toBottom) {
    css.top = position.top + 'px'
    if (windowHeight - position.top < menuHeight) {
      css.maxHeight = windowHeight - position.top - offset + 'px'
    }
  }
  else {
    css.top = Math.max(10, position.top - menuHeight) + 'px'
    if (position.top < menuHeight) {
      css.maxHeight = position.top - offset + 'px'
    }
  }

  if (!opening) {
    toBottom = !toBottom
  }

  menu
    .velocity('stop')
    .css(css)
    .velocity('transition.slide' + (toBottom ? 'Down' : 'Up') + (opening ? 'In' : 'Out'), {
      duration: duration
    })
}

export default {
  props: {
    duration: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    toggle (event) {
      this[this.opened ? 'close' : 'open'](event)
    },
    open (event) {
      event.preventDefault()

      if (this.opened) {
        return
      }

      this.opened = true
      this.$nextTick(() => {
        body.mousedown(this.close)
      })

      this.position = {
        top: event.clientY,
        left: event.clientX
      }

      animate(this.$els.menu, this.position, this.duration, this.opened)

      return false
    },
    close () {
      if (!this.opened) {
        return
      }

      this.opened = false
      body.off('mousedown', this.close)

      animate(this.$els.menu, this.position, this.duration, this.opened)
    }
  }
}
