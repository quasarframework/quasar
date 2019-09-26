import Vue from 'vue'

import { between } from '../../utils/format.js'
import { isSSR } from '../../plugins/Platform.js'

const
  xhr = isSSR ? null : XMLHttpRequest,
  send = isSSR ? null : xhr.prototype.send,
  stackStart = [],
  stackStop = []

let highjackCount = 0

function translate ({ p, pos, active, horiz, reverse, dir }) {
  let x = 1, y = 1

  if (horiz) {
    if (reverse) { x = -1 }
    if (pos === 'bottom') { y = -1 }
    return { transform: `translate3d(${x * (p - 100)}%,${active ? 0 : y * -200}%,0)` }
  }

  if (reverse) { y = -1 }
  if (pos === 'right') { x = -1 }
  return { transform: `translate3d(${active ? 0 : dir * x * -200}%,${y * (p - 100)}%,0)` }
}

function inc (p, amount) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * 3 + 3
    }
    else if (p < 65) {
      amount = Math.random() * 3
    }
    else if (p < 85) {
      amount = Math.random() * 2
    }
    else if (p < 99) {
      amount = 0.6
    }
    else {
      amount = 0
    }
  }
  return between(p + amount, 0, 100)
}

function highjackAjax (start, stop) {
  stackStart.push(start)
  stackStop.push(stop)

  highjackCount++

  if (highjackCount > 1) { return }

  function endHandler () {
    stackStop.forEach(fn => { fn() })
  }

  xhr.prototype.send = function (/* ...args */) {
    stackStart.forEach(fn => { fn() })
    this.addEventListener('loadend', endHandler, false)
    send.apply(this, arguments)
  }
}

function restoreAjax (start, stop) {
  stackStart.splice(stackStart.indexOf(start), 1)
  stackStop.splice(stackStop.indexOf(stop), 1)

  highjackCount = Math.max(0, highjackCount - 1)
  if (!highjackCount) {
    xhr.prototype.send = send
  }
}

export default Vue.extend({
  name: 'QAjaxBar',

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
      default: '2px'
    },
    color: {
      type: String,
      default: 'red'
    },
    skipHijack: Boolean,
    reverse: Boolean
  },

  data () {
    return {
      calls: 0,
      progress: 0,
      onScreen: false,
      animate: true
    }
  },

  computed: {
    classes () {
      return [
        `q-loading-bar--${this.position}`,
        `bg-${this.color}`,
        this.animate === true ? '' : 'no-transition'
      ]
    },

    style () {
      const active = this.onScreen

      let o = translate({
        p: this.progress,
        pos: this.position,
        active,
        horiz: this.horizontal,
        reverse: this.$q.lang.rtl && ['top', 'bottom'].includes(this.position)
          ? !this.reverse
          : this.reverse,
        dir: this.$q.lang.rtl ? -1 : 1
      })

      o[this.sizeProp] = this.size
      o.opacity = active ? 1 : 0

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
    start (speed = 300) {
      this.calls++
      if (this.calls > 1) { return }

      clearTimeout(this.timer)
      this.$emit('start')

      if (this.onScreen) { return }

      this.progress = 0
      this.onScreen = true
      this.animate = false
      this.timer = setTimeout(() => {
        this.animate = true
        this.__work(speed)
      }, 100)
    },

    increment (amount) {
      this.calls > 0 && (this.progress = inc(this.progress, amount))
    },

    stop () {
      this.calls = Math.max(0, this.calls - 1)
      if (this.calls > 0) { return }

      clearTimeout(this.timer)
      this.$emit('stop')

      const end = () => {
        this.animate = true
        this.progress = 100
        this.timer = setTimeout(() => {
          this.onScreen = false
        }, 1000)
      }

      if (this.progress === 0) {
        this.timer = setTimeout(end, 1)
      }
      else {
        end()
      }
    },

    __work (speed) {
      if (this.progress < 100) {
        this.timer = setTimeout(() => {
          this.increment()
          this.__work(speed)
        }, speed)
      }
    }
  },

  mounted () {
    if (!this.skipHijack) {
      this.hijacked = true
      highjackAjax(this.start, this.stop)
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
    this.hijacked && restoreAjax(this.start, this.stop)
  },

  render (h) {
    return h('div', {
      staticClass: 'q-loading-bar',
      class: this.classes,
      style: this.style
    })
  }
})
