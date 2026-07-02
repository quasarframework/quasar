import {
  computed,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

import { createComponent } from '../../utils/private.create/create.js'
import { between } from '../../utils/format/format.js'

const xhr = __QUASAR_SSR_SERVER__ ? null : XMLHttpRequest,
  open = __QUASAR_SSR_SERVER__ ? null : xhr.prototype.open,
  positionValues = ['top', 'right', 'bottom', 'left']

let stack = []
let highjackCount = 0

function translate({ p, pos, active, horiz, reverse, dir }) {
  let x = 1,
    y = 1

  if (horiz) {
    if (reverse) {
      x = -1
    }
    if (pos === 'bottom') {
      y = -1
    }
    return {
      transform: `translate3d(${x * (p - 100)}%,${active ? 0 : y * -200}%,0)`
    }
  }

  if (reverse) {
    y = -1
  }
  if (pos === 'right') {
    x = -1
  }
  return {
    transform: `translate3d(${active ? 0 : dir * x * -200}%,${y * (p - 100)}%,0)`
  }
}

function inc(p, amount) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * 3 + 3
    } else if (p < 65) {
      amount = Math.random() * 3
    } else if (p < 85) {
      amount = Math.random() * 2
    } else if (p < 99) {
      amount = 0.6
    } else {
      amount = 0
    }
  }
  return between(p + amount, 0, 100)
}

function highjackAjax(stackEntry) {
  highjackCount++

  stack.push(stackEntry)

  if (highjackCount > 1) return

  // oxlint-disable-next-line func-name-matching
  xhr.prototype.open = function qOpen(method, url, ...restArgs) {
    const stopStack = []

    const loadStart = () => {
      stack.forEach(entry => {
        if (
          entry.hijackFilter.value === null ||
          entry.hijackFilter.value(url)
        ) {
          entry.start()
          stopStack.push(entry.stop)
        }
      })
    }

    const loadEnd = () => {
      stopStack.forEach(stop => {
        stop()
      })
    }

    this.addEventListener('loadstart', loadStart, { once: true })
    this.addEventListener('loadend', loadEnd, { once: true })

    // Modern replacement for open.apply(this, arguments)
    open.call(this, method, url, ...restArgs)
  }
}

function restoreAjax(start) {
  stack = stack.filter(entry => entry.start !== start)

  highjackCount = Math.max(0, highjackCount - 1)
  if (highjackCount === 0) {
    xhr.prototype.open = open
  }
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/ajax-bar
 */
export default createComponent({
  name: 'QAjaxBar',

  props: {
    /**
     * Position within window of where QAjaxBar should be displayed
     *
     * @api prop position
     * @type {String}
     * @default 'top'
     * @category style
     * @value 'top'
     * @value 'right'
     * @value 'bottom'
     * @value 'left'
     */
    position: {
      type: String,
      default: 'top',
      validator: val => positionValues.includes(val)
    },

    /**
     * Size in CSS units, including unit name
     *
     * @api prop size
     * @extends size
     * @default '2px'
     */
    size: {
      type: String,
      default: '2px'
    },

    /**
     * Color name for component from the Quasar Color Palette
     *
     * @api prop color
     * @extends color
     */
    color: String,

    /**
     * Skip Ajax hijacking (not a reactive prop)
     *
     * @api prop skip-hijack
     * @type {Boolean}
     * @category behavior
     */
    skipHijack: Boolean,

    /**
     * Reverse direction of progress
     *
     * @api prop reverse
     * @type {Boolean}
     * @category behavior
     */
    reverse: Boolean,

    /**
     * Filter which URL should trigger start() + stop()
     *
     * @api prop hijack-filter
     * @type {Function}
     * @category behavior
     * @addedIn v2.4.5
     * @param {String} url The URL being triggered
     * @returns {Boolean} Should the URL received as param trigger start() + stop()?
     */
    hijackFilter: Function
  },

  emits: [
    /**
     * Emitted when bar is triggered to appear
     *
     * @api event start
     */
    'start',

    /**
     * Emitted when bar has finished its job
     *
     * @api event stop
     */
    'stop'
  ],

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()

    const progress = ref(0)
    const onScreen = ref(false)
    const animate = ref(true)

    let sessions = 0,
      timer = null,
      speed

    const classes = computed(
      () =>
        `q-loading-bar q-loading-bar--${props.position}` +
        (props.color !== void 0 ? ` bg-${props.color}` : '') +
        (animate.value ? '' : ' no-transition')
    )

    const horizontal = computed(
      () => props.position === 'top' || props.position === 'bottom'
    )
    const sizeProp = computed(() => (horizontal.value ? 'height' : 'width'))

    const style = computed(() => {
      const active = onScreen.value

      const obj = translate({
        p: progress.value,
        pos: props.position,
        active,
        horiz: horizontal.value,
        reverse:
          proxy.$q.lang.rtl && ['top', 'bottom'].includes(props.position)
            ? !props.reverse
            : props.reverse,
        dir: proxy.$q.lang.rtl ? -1 : 1
      })

      obj[sizeProp.value] = props.size
      obj.opacity = active ? 1 : 0

      return obj
    })

    const attributes = computed(() =>
      onScreen.value
        ? {
            role: 'progressbar',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': progress.value
          }
        : { 'aria-hidden': 'true' }
    )

    /**
     * Notify bar you are waiting for a new process to finish
     *
     * @api method start
     * @param {Number} speed Delay (in milliseconds) between progress auto-increments; If delay is 0 then it disables auto-incrementing
     * @default 300
     * @returns {Number} Number of active simultaneous sessions
     */
    function start(newSpeed = 300) {
      const oldSpeed = speed
      speed = Math.max(0, newSpeed) || 0

      sessions++

      if (sessions > 1) {
        if (oldSpeed === 0 && newSpeed > 0) {
          planNextStep()
        } else if (timer !== null && oldSpeed > 0 && newSpeed <= 0) {
          clearTimeout(timer)
          timer = null
        }

        return sessions
      }

      if (timer !== null) clearTimeout(timer)
      emit('start')

      progress.value = 0

      /**
       * We're trying to avoid side effects if start() is called inside a watchEffect()
       * so we're accessing the _value property directly (under the covers implementation detail of ref())
       *
       * Otherwise, any refs() accessed here would be marked as deps for the watchEffect()
       * -- and we are changing them below, which would cause an infinite loop
       */

      timer = setTimeout(
        () => {
          timer = null
          animate.value = true
          if (newSpeed > 0) planNextStep()
        },
        onScreen._value === true ? 500 : 1
      )

      if (onScreen._value !== true) {
        onScreen.value = true
        animate.value = false
      }

      return sessions
    }

    /**
     * Manually trigger a bar progress increment
     *
     * @api method increment
     * @param {Number} amount Amount (0 < x <= 100) to increment with
     * @returns {Number} Number of active simultaneous sessions
     */
    function increment(amount) {
      if (sessions > 0) {
        progress.value = inc(progress.value, amount)
      }

      return sessions
    }

    /**
     * Notify bar that one process you were waiting has finished
     *
     * @api method stop
     * @returns {Number} Number of active simultaneous sessions
     */
    function stop() {
      sessions = Math.max(0, sessions - 1)
      if (sessions > 0) return sessions

      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }

      emit('stop')

      const end = () => {
        animate.value = true
        progress.value = 100
        timer = setTimeout(() => {
          timer = null
          onScreen.value = false
        }, 1000)
      }

      if (progress.value === 0) {
        timer = setTimeout(end, 1)
      } else {
        end()
      }

      return sessions
    }

    function planNextStep() {
      if (progress.value < 100) {
        timer = setTimeout(() => {
          timer = null
          increment()
          planNextStep()
        }, speed)
      }
    }

    let hijacked = false

    onMounted(() => {
      if (!props.skipHijack) {
        hijacked = true
        highjackAjax({
          start,
          stop,
          hijackFilter: computed(() => props.hijackFilter || null)
        })
      }
    })

    onBeforeUnmount(() => {
      if (timer !== null) clearTimeout(timer)
      if (hijacked) restoreAjax(start)
    })

    // expose public methods
    Object.assign(proxy, { start, stop, increment })

    return () =>
      h('div', {
        class: classes.value,
        style: style.value,
        ...attributes.value
      })
  }
})
