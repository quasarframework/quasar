import Vue from 'vue'

import QIcon from '../icon/QIcon.js'
import QResizeObserver from '../observer/QResizeObserver.js'

import slot from '../../utils/slot.js'

function getIndicatorClass (color, top, vertical) {
  const pos = vertical === true
    ? ['left', 'right']
    : ['top', 'bottom']

  return `absolute-${top === true ? pos[0] : pos[1]}${color ? ` text-${color}` : ''}`
}

function bufferPrioritySort (t1, t2) {
  if (t1.priorityMatched === t2.priorityMatched) {
    return t2.priorityHref - t1.priorityHref
  }
  return t2.priorityMatched - t1.priorityMatched
}

function bufferCleanSelected (t) {
  t.selected = false
  return t
}

const
  bufferFilters = [
    function (t) { return t.selected === true && t.exact === true && t.redirected !== true },
    function (t) { return t.selected === true && t.exact === true },
    function (t) { return t.selected === true && t.redirected !== true },
    function (t) { return t.selected === true },
    function (t) { return t.exact === true && t.redirected !== true },
    function (t) { return t.redirected !== true },
    function (t) { return t.exact === true },
    function (t) { return true }
  ],
  bufferFiltersLen = bufferFilters.length

export default Vue.extend({
  name: 'QTabs',

  provide () {
    return {
      tabs: this.tabs,
      __activateTab: this.__activateTab,
      __activateRoute: this.__activateRoute
    }
  },

  props: {
    value: [Number, String],

    align: {
      type: String,
      default: 'center',
      validator: v => ['left', 'center', 'right', 'justify'].includes(v)
    },
    breakpoint: {
      type: [String, Number],
      default: 600
    },

    vertical: Boolean,
    shrink: Boolean,

    activeColor: String,
    activeBgColor: String,
    indicatorColor: String,
    leftIcon: String,
    rightIcon: String,

    // TODO remove in v1 final
    topIndicator: Boolean,
    switchIndicator: Boolean,

    narrowIndicator: Boolean,
    inlineLabel: Boolean,
    noCaps: Boolean,

    dense: Boolean
  },

  data () {
    return {
      tabs: {
        current: this.value,
        activeColor: this.activeColor,
        activeBgColor: this.activeBgColor,
        indicatorClass: getIndicatorClass(
          this.indicatorColor,
          this.topIndicator || this.switchIndicator,
          this.vertical
        ),
        narrowIndicator: this.narrowIndicator,
        inlineLabel: this.inlineLabel,
        noCaps: this.noCaps
      },
      scrollable: false,
      leftArrow: true,
      rightArrow: false,
      justify: false
    }
  },

  watch: {
    value (name) {
      this.__activateTab(name)
    },

    activeColor (v) {
      this.tabs.activeColor = v
    },

    activeBgColor (v) {
      this.tabs.activeBgColor = v
    },

    vertical (v) {
      this.tabs.indicatorClass = getIndicatorClass(this.indicatorColor, this.switchIndicatorPos, v)
    },

    indicatorColor (v) {
      this.tabs.indicatorClass = getIndicatorClass(v, this.switchIndicatorPos, this.vertical)
    },

    // TODO remove in v1 final
    topIndicator (v) {
      this.tabs.indicatorClass = getIndicatorClass(this.indicatorColor, v, this.vertical)
    },

    switchIndicator (v) {
      this.tabs.indicatorClass = getIndicatorClass(this.indicatorColor, v, this.vertical)
    },

    narrowIndicator (v) {
      this.tabs.narrowIndicator = v
    },

    inlineLabel (v) {
      this.tabs.inlineLabel = v
    },

    noCaps (v) {
      this.tabs.noCaps = v
    }
  },

  computed: {
    alignClass () {
      const align = this.scrollable === true
        ? 'left'
        : (this.justify === true ? 'justify' : this.align)

      return `q-tabs__content--align-${align}`
    },

    classes () {
      return `q-tabs--${this.scrollable === true ? '' : 'not-'}scrollable` +
        (this.dense === true ? ' q-tabs--dense' : '') +
        (this.shrink === true ? ' col-shrink' : '') +
        (this.vertical === true ? ' q-tabs--vertical' : '')
    },

    // TODO remove in v1 final, directly use switchIndicator
    switchIndicatorPos () {
      return this.topIndicator || this.switchIndicator
    }
  },

  methods: {
    __activateTab (name) {
      if (this.tabs.current !== name) {
        this.__animate(this.tabs.current, name)
        this.tabs.current = name
        this.$emit('input', name)
      }
    },

    __activateRoute (params) {
      if (this.bufferRoute !== this.$route && this.buffer.length > 0) {
        clearTimeout(this.bufferTimer)
        this.bufferTimer = void 0
        this.buffer.length = 0
      }
      this.bufferRoute = this.$route

      if (params !== void 0) {
        if (params.remove === true) {
          this.buffer = this.buffer.filter(t => t.name !== params.name)
        }
        else {
          this.buffer.push(params)
        }
      }

      if (this.bufferTimer === void 0) {
        this.bufferTimer = setTimeout(() => {
          let tabs = []

          for (let i = 0; i < bufferFiltersLen && tabs.length === 0; i += 1) {
            tabs = this.buffer.filter(bufferFilters[i])
          }

          tabs.sort(bufferPrioritySort)

          this.__activateTab(tabs.length === 0 ? null : tabs[0].name)

          this.buffer = this.buffer.map(bufferCleanSelected)

          this.bufferTimer = void 0
        }, 1)
      }
    },

    __updateContainer ({ width, height }) {
      const offset = this.scrollable === true ? this.extraOffset : 0
      const scroll = this.vertical === true
        ? this.$refs.content.scrollHeight - offset > height
        : this.$refs.content.scrollWidth - offset > width

      if (this.scrollable !== scroll) {
        this.scrollable = scroll
      }

      scroll === true && this.$nextTick(() => this.__updateArrows())

      const justify = (this.vertical === true ? height : width) < parseInt(this.breakpoint, 10)
      if (this.justify !== justify) {
        this.justify = justify
      }
    },

    __animate (oldName, newName) {
      const
        oldTab = oldName
          ? this.$children.find(tab => tab.name === oldName)
          : null,
        newTab = newName
          ? this.$children.find(tab => tab.name === newName)
          : null

      if (oldTab && newTab) {
        const
          oldEl = oldTab.$el.getElementsByClassName('q-tab__indicator')[0],
          newEl = newTab.$el.getElementsByClassName('q-tab__indicator')[0]

        clearTimeout(this.animateTimer)

        oldEl.style.transition = 'none'
        oldEl.style.transform = 'none'
        newEl.style.transition = 'none'
        newEl.style.transform = 'none'

        const
          oldPos = oldEl.getBoundingClientRect(),
          newPos = newEl.getBoundingClientRect()

        newEl.style.transform = this.vertical === true
          ? `translate3d(0, ${oldPos.top - newPos.top}px, 0) scale3d(1, ${newPos.height ? oldPos.height / newPos.height : 1}, 1)`
          : `translate3d(${oldPos.left - newPos.left}px, 0, 0) scale3d(${newPos.width ? oldPos.width / newPos.width : 1}, 1, 1)`

        // allow scope updates to kick in
        this.$nextTick(() => {
          this.animateTimer = setTimeout(() => {
            newEl.style.transition = 'transform .25s cubic-bezier(.4, 0, .2, 1)'
            newEl.style.transform = 'none'
          }, 30)
        })
      }

      if (newTab && this.scrollable) {
        const
          { left, width, top, height } = this.$refs.content.getBoundingClientRect(),
          newPos = newTab.$el.getBoundingClientRect()

        let offset = this.vertical === true ? newPos.top - top : newPos.left - left

        if (offset < 0) {
          this.$refs.content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] += offset
          this.__updateArrows()
          return
        }

        offset += this.vertical === true ? newPos.height - height : newPos.width - width
        if (offset > 0) {
          this.$refs.content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] += offset
          this.__updateArrows()
        }
      }
    },

    __updateArrows () {
      const
        content = this.$refs.content,
        rect = content.getBoundingClientRect(),
        left = this.vertical === true ? content.scrollTop : content.scrollLeft

      this.leftArrow = left > 0
      this.rightArrow = this.vertical === true
        ? left + rect.height + 5 < content.scrollHeight
        : left + rect.width + 5 < content.scrollWidth
    },

    __animScrollTo (value) {
      this.__stopAnimScroll()
      this.__scrollTowards(value)

      this.scrollTimer = setInterval(() => {
        if (this.__scrollTowards(value)) {
          this.__stopAnimScroll()
        }
      }, 5)
    },

    __scrollToStart () {
      this.__animScrollTo(0)
    },

    __scrollToEnd () {
      this.__animScrollTo(9999)
    },

    __stopAnimScroll () {
      clearInterval(this.scrollTimer)
    },

    __scrollTowards (value) {
      let
        content = this.$refs.content,
        left = this.vertical === true ? content.scrollTop : content.scrollLeft,
        direction = value < left ? -1 : 1,
        done = false

      left += direction * 5
      if (left < 0) {
        done = true
        left = 0
      }
      else if (
        (direction === -1 && left <= value) ||
        (direction === 1 && left >= value)
      ) {
        done = true
        left = value
      }

      content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] = left
      this.__updateArrows()
      return done
    }
  },

  created () {
    this.buffer = []
  },

  // TODO remove in v1 final
  mounted () {
    if (this.topIndicator === true) {
      const p = process.env
      if (p.PROD !== true) {
        console.info('\n\n[Quasar] QTabs info: please rename top-indicator to switch-indicator prop')
      }
    }
  },

  beforeDestroy () {
    clearTimeout(this.bufferTimer)
    clearTimeout(this.animateTimer)
  },

  render (h) {
    return h('div', {
      staticClass: 'q-tabs row no-wrap items-center',
      class: this.classes,
      on: this.$listeners,
      attrs: { role: 'tablist' }
    }, [
      h(QResizeObserver, {
        on: { resize: this.__updateContainer }
      }),

      h(QIcon, {
        staticClass: 'q-tabs__arrow q-tabs__arrow--left q-tab__icon',
        class: this.leftArrow === true ? '' : 'q-tabs__arrow--faded',
        props: { name: this.leftIcon || (this.vertical === true ? this.$q.iconSet.tabs.up : this.$q.iconSet.tabs.left) },
        nativeOn: {
          mousedown: this.__scrollToStart,
          touchstart: this.__scrollToStart,
          mouseup: this.__stopAnimScroll,
          mouseleave: this.__stopAnimScroll,
          touchend: this.__stopAnimScroll
        }
      }),

      h('div', {
        ref: 'content',
        staticClass: 'q-tabs__content row no-wrap items-center',
        class: this.alignClass
      }, slot(this, 'default')),

      h(QIcon, {
        staticClass: 'q-tabs__arrow q-tabs__arrow--right q-tab__icon',
        class: this.rightArrow === true ? '' : 'q-tabs__arrow--faded',
        props: { name: this.rightIcon || (this.vertical === true ? this.$q.iconSet.tabs.down : this.$q.iconSet.tabs.right) },
        nativeOn: {
          mousedown: this.__scrollToEnd,
          touchstart: this.__scrollToEnd,
          mouseup: this.__stopAnimScroll,
          mouseleave: this.__stopAnimScroll,
          touchend: this.__stopAnimScroll
        }
      })
    ])
  }
})
