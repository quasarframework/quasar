import Utils from '../../utils'
import Platform from '../../platform'

const
  offset = 20,
  duration = 100

function animate (menu, position, opening) {
  // necessary to compute menu width and height
  menu.style.display = 'block'

  let
    viewport = Utils.dom.viewport(),
    windowWidth = viewport.width,
    windowHeight = viewport.height,
    menuWidth = Utils.dom.width(menu),
    menuHeight = Utils.dom.height(menu),
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
  Utils.dom.css(menu, css)
  Velocity(
    menu,
    'transition.slide' + (toBottom ? 'Down' : 'Up') + (opening ? 'In' : 'Out'),
    {duration}
  )
}

export default {
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
        if (Platform.has.touch) {
          document.body.addEventListener('touchstart', this.close)
        }
      })

      this.position = {
        top: event.clientY,
        left: event.clientX
      }

      animate(this.$els.menu, this.position, this.opened)
    },
    close () {
      if (!this.opened) {
        return
      }

      this.opened = false
      document.body.removeEventListener('mousedown', this.close)
      if (Platform.has.touch) {
        document.body.removeEventListener('touchstart', this.close)
      }

      animate(this.$els.menu, this.position, this.opened)
    }
  }
}
