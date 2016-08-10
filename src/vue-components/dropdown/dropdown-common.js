import Utils from '../../utils'

const offset = 20

function animate (menu, position, duration, opening, fixed) {
  let
    viewport = Utils.viewport(),
    windowWidth = viewport.width,
    windowHeight = viewport.height,
    menuWidth = menu.offsetWidth,
    menuHeight = menu.offsetHeight,
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

  Velocity(menu, 'stop')
  Utils.css(menu, css)
  Velocity(menu, 'transition.slide' + (toBottom ? 'Down' : 'Up') + (opening ? 'In' : 'Out'), {
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
        document.body.addEventListener('mousedown', this.close)
      })

      this.position = {
        top: event.clientY,
        left: event.clientX
      }

      animate(this.$els.menu, this.position, this.duration, this.opened)
    },
    close () {
      if (!this.opened) {
        return
      }

      this.opened = false
      document.body.removeEventListener('mousedown', this.close)
      animate(this.$els.menu, this.position, this.duration, this.opened)
    }
  }
}
