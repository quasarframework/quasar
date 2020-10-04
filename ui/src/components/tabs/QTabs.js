import { h, defineComponent } from 'vue'

import QIcon from '../icon/QIcon.js'
import QResizeObserver from '../resize-observer/QResizeObserver.js'

import TimeoutMixin from '../../mixins/timeout.js'

import { noop } from '../../utils/event.js'
import { hSlot } from '../../utils/render.js'

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
    t => t.selected === true && t.exact === true && t.redirected !== true,
    t => t.selected === true && t.exact === true,
    t => t.selected === true && t.redirected !== true,
    t => t.selected === true,
    t => t.exact === true && t.redirected !== true,
    t => t.redirected !== true,
    t => t.exact === true,
    t => true
  ],
  bufferFiltersLen = bufferFilters.length

const alignValues = [ 'left', 'center', 'right', 'justify' ]

export default defineComponent({
  name: 'QTabs',

  mixins: [ TimeoutMixin ],

  provide () {
    return {
      __qTabs: this
    }
  },

  props: {
    modelValue: [ Number, String ],

    align: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    },
    breakpoint: {
      type: [ String, Number ],
      default: 600
    },

    vertical: Boolean,
    shrink: Boolean,
    stretch: Boolean,

    activeColor: String,
    activeBgColor: String,
    indicatorColor: String,
    leftIcon: String,
    rightIcon: String,

    outsideArrows: Boolean,
    mobileArrows: Boolean,

    switchIndicator: Boolean,

    narrowIndicator: Boolean,
    inlineLabel: Boolean,
    noCaps: Boolean,

    dense: Boolean,

    contentClass: String
  },

  emits: [ 'update:modelValue' ],

  data () {
    return {
      currentModel: this.modelValue,
      scrollable: false,
      leftArrow: true,
      rightArrow: false,
      justify: false
    }
  },

  watch: {
    modelValue (name) {
      this.__activateTab({ name, setCurrent: true, skipEmit: true })
    },

    outsideArrows () {
      this.$nextTick(this.__recalculateScroll())
    },

    arrowsEnabled (v) {
      this.__updateArrows = v === true
        ? this.__updateArrowsFn
        : noop

      this.$nextTick(this.__recalculateScroll())
    }
  },

  computed: {
    tabProps () {
      return {
        activeColor: this.activeColor,
        activeBgColor: this.activeBgColor,
        indicatorClass: getIndicatorClass(
          this.indicatorColor,
          this.switchIndicator,
          this.vertical
        ),
        narrowIndicator: this.narrowIndicator,
        inlineLabel: this.inlineLabel,
        noCaps: this.noCaps
      }
    },

    arrowsEnabled () {
      return this.$q.platform.is.desktop === true || this.mobileArrows === true
    },

    alignClass () {
      const align = this.scrollable === true
        ? 'left'
        : (this.justify === true ? 'justify' : this.align)

      return `q-tabs__content--align-${align}`
    },

    classes () {
      return 'q-tabs row no-wrap items-center' +
        ` q-tabs--${this.scrollable === true ? '' : 'not-'}scrollable` +
        ` q-tabs--${this.vertical === true ? 'vertical' : 'horizontal'}` +
        ` q-tabs__arrows--${this.arrowsEnabled === true && this.outsideArrows === true ? 'outside' : 'inside'}` +
        (this.dense === true ? ' q-tabs--dense' : '') +
        (this.shrink === true ? ' col-shrink' : '') +
        (this.stretch === true ? ' self-stretch' : '')
    },

    innerClass () {
      return 'q-tabs__content row no-wrap items-center self-stretch hide-scrollbar ' +
        this.alignClass +
        (this.contentClass !== void 0 ? ` ${this.contentClass}` : '')
    },

    domProps () {
      return this.vertical === true
        ? { container: 'height', content: 'scrollHeight', posLeft: 'top', posRight: 'bottom' }
        : { container: 'width', content: 'scrollWidth', posLeft: 'left', posRight: 'right' }
    }
  },

  methods: {
    __activateTab ({ name, setCurrent, skipEmit }) {
      if (this.currentModel !== name) {
        skipEmit !== true && this.$emit('update:modelValue', name)
        if (
          setCurrent === true ||
          this.$.vnode.props['onUpdate:modelValue'] === void 0
        ) {
          this.__animate(this.currentModel, name)
          this.currentModel = name
        }
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

          for (let i = 0; i < bufferFiltersLen && tabs.length === 0; i++) {
            tabs = this.buffer.filter(bufferFilters[i])
          }

          tabs.sort(bufferPrioritySort)
          this.__activateTab({
            name: tabs.length === 0 ? null : tabs[0].name,
            setCurrent: true
          })
          this.buffer = this.buffer.map(bufferCleanSelected)
          this.bufferTimer = void 0
        }, 1)
      }
    },

    __recalculateScroll () {
      this.__nextTick(() => {
        if (this.$.isDeactivated !== true && this.$.isUnmounted !== true) {
          this.__updateContainer({
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight
          })
        }
      })

      this.__prepareTick()
    },

    __updateContainer (domSize) {
      const
        size = domSize[this.domProps.container],
        scrollSize = this.$refs.content[this.domProps.content],
        scroll = size > 0 && scrollSize > size // when there is no tab, in Chrome, size === 0 and scrollSize === 1

      if (this.scrollable !== scroll) {
        this.scrollable = scroll
      }

      // Arrows need to be updated even if the scroll status was already true
      scroll === true && this.$nextTick(() => this.__updateArrows())

      const justify = size < parseInt(this.breakpoint, 10)

      if (this.justify !== justify) {
        this.justify = justify
      }
    },

    __animate (oldName, newName) {
      const
        oldTab = oldName !== void 0 && oldName !== null && oldName !== ''
          ? this.tabList.find(tab => tab.name === oldName)
          : null,
        newTab = newName !== void 0 && newName !== null && newName !== ''
          ? this.tabList.find(tab => tab.name === newName)
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
          ? `translate3d(0,${oldPos.top - newPos.top}px,0) scale3d(1,${newPos.height ? oldPos.height / newPos.height : 1},1)`
          : `translate3d(${oldPos.left - newPos.left}px,0,0) scale3d(${newPos.width ? oldPos.width / newPos.width : 1},1,1)`

        // allow scope updates to kick in (QRouteTab needs more time)
        this.$nextTick(() => {
          this.animateTimer = setTimeout(() => {
            newEl.style.transition = 'transform .25s cubic-bezier(.4, 0, .2, 1)'
            newEl.style.transform = 'none'
          }, 70)
        })
      }

      if (newTab && this.scrollable === true) {
        const
          { left, width, top, height } = this.$refs.content.getBoundingClientRect(),
          newPos = newTab.$el.getBoundingClientRect()

        let offset = this.vertical === true ? newPos.top - top : newPos.left - left

        if (offset < 0) {
          this.$refs.content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] += Math.floor(offset)
          this.__updateArrows()
          return
        }

        offset += this.vertical === true ? newPos.height - height : newPos.width - width
        if (offset > 0) {
          this.$refs.content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] += Math.ceil(offset)
          this.__updateArrows()
        }
      }
    },

    __updateArrowsFn () {
      const
        content = this.$refs.content,
        rect = content.getBoundingClientRect(),
        pos = this.vertical === true ? content.scrollTop : content.scrollLeft

      this.leftArrow = pos > 0
      this.rightArrow = this.vertical === true
        ? Math.ceil(pos + rect.height) < content.scrollHeight
        : Math.ceil(pos + rect.width) < content.scrollWidth
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
      const content = this.$refs.content
      let
        pos = this.vertical === true ? content.scrollTop : content.scrollLeft,
        done = false
      const direction = value < pos ? -1 : 1

      pos += direction * 5
      if (pos < 0) {
        done = true
        pos = 0
      }
      else if (
        (direction === -1 && pos <= value) ||
        (direction === 1 && pos >= value)
      ) {
        done = true
        pos = value
      }

      content[this.vertical === true ? 'scrollTop' : 'scrollLeft'] = pos
      this.__updateArrows()
      return done
    },

    __registerTab (tab) {
      this.tabList.push(tab)
    },

    __unregisterTab (tab) {
      const index = this.tabList.indexOf(tab)
      index !== -1 && this.tabList.splice(index, 1)
    }
  },

  created () {
    this.tabList = []
    this.buffer = []
    this.__updateArrows = this.arrowsEnabled === true
      ? this.__updateArrowsFn
      : noop
  },

  beforeUnmount () {
    clearTimeout(this.bufferTimer)
    clearTimeout(this.animateTimer)
  },

  render () {
    const child = [
      h(QResizeObserver, { onResize: this.__updateContainer }),

      h('div', {
        ref: 'content',
        class: this.innerClass
      }, hSlot(this, 'default'))
    ]

    this.arrowsEnabled === true && child.push(
      h(QIcon, {
        class: 'q-tabs__arrow q-tabs__arrow--left absolute q-tab__icon' +
          (this.leftArrow === true ? '' : ' q-tabs__arrow--faded'),
        name: this.leftIcon || (this.vertical === true ? this.$q.iconSet.tabs.up : this.$q.iconSet.tabs.left),
        onMousedown: this.__scrollToStart,
        onTouchstart: this.__scrollToStart,
        onMouseup: this.__stopAnimScroll,
        onMouseleave: this.__stopAnimScroll,
        onTouchend: this.__stopAnimScroll
      }),

      h(QIcon, {
        class: 'q-tabs__arrow q-tabs__arrow--right absolute q-tab__icon' +
          (this.rightArrow === true ? '' : ' q-tabs__arrow--faded'),
        name: this.rightIcon || (this.vertical === true ? this.$q.iconSet.tabs.down : this.$q.iconSet.tabs.right),
        onMousedown: this.__scrollToEnd,
        onTouchstart: this.__scrollToEnd,
        onMouseup: this.__stopAnimScroll,
        onMouseleave: this.__stopAnimScroll,
        onTouchend: this.__stopAnimScroll
      })
    )

    return h('div', {
      class: this.classes,
      role: 'tablist'
    }, child)
  }
})
