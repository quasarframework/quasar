import { cssTransform } from '../../utils/dom'
import { between } from '../../utils/format'

const
  xhr = XMLHttpRequest,
  send = xhr.prototype.send

function translate ({p, pos, active, horiz, reverse}) {
  let x = 1, y = 1

  if (horiz) {
    if (reverse) { x = -1 }
    if (pos === 'bottom') { y = -1 }
    return cssTransform(`translate3d(${x * (p - 100)}%, ${active ? 0 : y * -200}%, 0)`)
  }

  if (reverse) { y = -1 }
  if (pos === 'right') { x = -1 }

  return cssTransform(`translate3d(${active ? 0 : x * -200}%, ${y * (p - 100)}%, 0)`)
}

function inc (p, amount) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * (5 - 3 + 1) + 3
    }
    else if (p < 65) {
      amount = Math.random() * 3
    }
    else if (p < 85) {
      amount = Math.random() * 2
    }
    else if (p < 99) {
      amount = 0.5
    }
    else {
      amount = 0
    }
  }
  return between(p + amount, 0, 100)
}

function highjackAjax (startHandler, endHandler) {
  xhr.prototype.send = function (...args) {
    startHandler()

    this.addEventListener('abort', endHandler, false)
    this.addEventListener('readystatechange', () => {
      if (this.readyState === 4) {
        endHandler()
      }
    }, false)

    send.apply(this, args)
  }
}

function restoreAjax () {
  xhr.prototype.send = send
}

export default {
  name: 'q-ajax-bar',
  props: {
    position: {
      type: String,
      default: 'top',
      validator (val) {
        return ['top', 'right', 'bottom', 'left'].includes(val)
      }
    },
    size: {
      type: String,
      default: '4px'
    },
    color: {
      type: String,
      default: 'red'
    },
    speed: {
      type: Number,
      default: 250
    },
    delay: {
      type: Number,
      default: 1000
    },
    reverse: Boolean
  },
  data () {
    return {
      animate: false,
      active: false,
      progress: 0,
      calls: 0
    }
  },
  computed: {
    classes () {
      return [
        this.position,
        { 'no-trantion': this.animate }
      ]
    },
    innerClasses () {
      return `bg-${this.color}`
    },
    style () {
      let o = translate({
        p: this.progress,
        pos: this.position,
        active: this.active,
        horiz: this.horizontal,
        reverse: this.reverse
      })
      o[this.sizeProp] = this.size
      return o
    },
    horizontal () {
      return this.position === 'top' || this.position === 'bottom'
    },
    sizeProp () {
      return this.horizontal ? 'height' : 'width'
    }
  },
  methods: {
    start () {
      this.calls++
      if (!this.active) {
        this.progress = 0
        this.active = true
        this.animate = false
        this.$emit('start')
        this.timer = setTimeout(() => {
          this.animate = true
          this.move()
        }, this.delay)
      }
      else if (this.closing) {
        this.closing = false
        clearTimeout(this.timer)
        this.progress = 0
        this.move()
      }
    },
    increment (amount) {
      if (this.active) {
        this.progress = inc(this.progress, amount)
      }
    },
    stop () {
      this.calls = Math.max(0, this.calls - 1)
      if (this.calls > 0) {
        return
      }

      clearTimeout(this.timer)

      if (!this.animate) {
        this.active = false
        return
      }
      this.closing = true
      this.progress = 100
      this.$emit('stop')
      this.timer = setTimeout(() => {
        this.closing = false
        this.active = false
      }, 1050)
    },
    move () {
      this.timer = setTimeout(() => {
        this.increment()
        this.move()
      }, this.speed)
    }
  },
  mounted () {
    highjackAjax(this.start, this.stop)
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    restoreAjax()
  },
  render (h) {
    return h('div', {
      staticClass: 'q-loading-bar shadow-4',
      'class': this.classes,
      style: this.style
    }, [
      h('div', {
        staticClass: 'q-loading-bar-inner',
        'class': this.innerClasses
      })
    ])
  }
}
