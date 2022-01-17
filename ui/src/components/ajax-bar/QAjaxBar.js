import Vue from 'vue'

import { between } from '../../utils/format.js'
import { isSSR } from '../../plugins/Platform.js'
import { ariaHidden } from '../../mixins/attrs'

const
  xhr = isSSR ? null : XMLHttpRequest,
  open = isSSR ? null : xhr.prototype.open,
  positionValues = [ 'top', 'right', 'bottom', 'left' ]

let stack = []
let highjackCount = 0

function translate ({ p, pos, active, horiz, reverse, dir }) {
  let x = 1, y = 1

  if (horiz === true) {
    if (reverse === true) { x = -1 }
    if (pos === 'bottom') { y = -1 }
    return { transform: `translate3d(${x * (p - 100)}%,${active ? 0 : y * -200}%,0)` }
  }

  if (reverse === true) { y = -1 }
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

function highjackAjax (stackEntry) {
  highjackCount++

  stack.push(stackEntry)

  if (highjackCount > 1) { return }

  xhr.prototype.open = function (_, url) {
    const stopStack = []

    const loadStart = () => {
      stack.forEach(entry => {
        const hijackFilter = entry.getHijackFilter()
        if (
          hijackFilter === null ||
          hijackFilter(url) === true
        ) {
          entry.start()
          stopStack.push(entry.stop)
        }
      })
    }

    const loadEnd = () => {
      stopStack.forEach(stop => { stop() })
    }

    this.addEventListener('loadstart', loadStart, { once: true })
    this.addEventListener('loadend', loadEnd, { once: true })

    open.apply(this, arguments)
  }
}

function restoreAjax (start) {
  stack = stack.filter(entry => entry.start !== start)

  highjackCount = Math.max(0, highjackCount - 1)
  if (!highjackCount) {
    xhr.prototype.open = open
  }
}

export default Vue.extend({
  name: 'QAjaxBar',

  props: {
    position: {
      type: String,
      default: 'top',
      validator: val => positionValues.includes(val)
    },

    size: {
      type: String,
      default: '2px'
    },

    color: String,
    reverse: Boolean,

    skipHijack: Boolean,
    hijackFilter: Function
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
      return `q-loading-bar q-loading-bar--${this.position}` +
        (this.color !== void 0 ? ` bg-${this.color}` : '') +
        (this.animate === true ? '' : ' no-transition')
    },

    style () {
      const active = this.onScreen

      const o = translate({
        p: this.progress,
        pos: this.position,
        active,
        horiz: this.horizontal,
        reverse: this.$q.lang.rtl === true && ['top', 'bottom'].includes(this.position)
          ? this.reverse === false
          : this.reverse,
        dir: this.$q.lang.rtl === true ? -1 : 1
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
    },

    attrs () {
      return this.onScreen === true
        ? {
          role: 'progressbar',
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': this.progress
        }
        : ariaHidden
    }
  },

  methods: {
    start (speed = 300) {
      const oldSpeed = this.speed
      const newSpeed = this.speed = Math.max(0, speed) || 0

      this.calls++

      if (this.calls > 1) {
        if (oldSpeed === 0 && newSpeed > 0) {
          this.__work()
        }
        else if (oldSpeed > 0 && newSpeed <= 0) {
          clearTimeout(this.timer)
        }

        return this.calls
      }

      clearTimeout(this.timer)
      this.$emit('start')

      this.progress = 0

      this.timer = setTimeout(() => {
        this.animate = true
        newSpeed > 0 && this.__work()
      }, this.onScreen === true ? 500 : 1)

      if (this.onScreen !== true) {
        this.onScreen = true
        this.animate = false
      }

      return this.calls
    },

    increment (amount) {
      if (this.calls > 0) {
        this.progress = inc(this.progress, amount)
      }

      return this.calls
    },

    stop () {
      this.calls = Math.max(0, this.calls - 1)

      if (this.calls > 0) {
        return this.calls
      }

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

      return this.calls
    },

    __work () {
      if (this.progress < 100) {
        this.timer = setTimeout(() => {
          this.increment()
          this.__work()
        }, this.speed)
      }
    }
  },

  mounted () {
    if (this.skipHijack !== true) {
      this.hijacked = true
      highjackAjax({
        start: this.start,
        stop: this.stop,
        getHijackFilter: () => this.hijackFilter || null
      })
    }
  },

  beforeDestroy () {
    clearTimeout(this.timer)
    this.hijacked === true && restoreAjax(this.start)
  },

  render (h) {
    return h('div', {
      class: this.classes,
      style: this.style,
      attrs: this.attrs
    })
  }
})
