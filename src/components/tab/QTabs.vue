<template>
  <div
    class="q-tabs column"
    :class="[
      `q-tabs-position-${position}`,
      `q-tabs-${inverted ? 'inverted' : 'normal'}`,
      noPaneBorder ? 'q-tabs-no-pane-border' : '',
      twoLines ? 'q-tabs-two-lines' : ''
    ]"
  >
    <div
      class="q-tabs-head row"
      ref="tabs"
      :class="{
        [`q-tabs-align-${align}`]: true,
        [`bg-${color}`]: !inverted && color
      }"
    >
      <div ref="scroller" class="q-tabs-scroller row no-wrap">
        <slot name="title"></slot>
        <div
          v-if="$q.theme !== 'ios'"
          class="relative-position self-stretch"
        >
          <div
            ref="posbar"
            class="q-tabs-position-bar"
            :class="{[`text-${color}`]: inverted && color}"
            @transitionend="__updatePosbarTransition"
          ></div>
        </div>
      </div>
      <div
        ref="leftScroll"
        class="row items-center justify-center q-tabs-left-scroll"
        @mousedown="__animScrollTo(0)"
        @touchstart="__animScrollTo(0)"
        @mouseup="__stopAnimScroll"
        @touchend="__stopAnimScroll"
      >
        <q-icon name="chevron_left"></q-icon>
      </div>
      <div
        ref="rightScroll"
        class="row items-center justify-center q-tabs-right-scroll"
        @mousedown="__animScrollTo(9999)"
        @touchstart="__animScrollTo(9999)"
        @mouseup="__stopAnimScroll"
        @touchend="__stopAnimScroll"
      >
        <q-icon name="chevron_right"></q-icon>
      </div>
    </div>

    <div class="q-tabs-panes">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { width, css, cssTransform } from '../../utils/dom'
import { debounce } from '../../utils/debounce'
import { QIcon } from '../icon'

const
  scrollNavigationSpeed = 5, // in pixels
  debounceDelay = 50 // in ms

export default {
  name: 'q-tabs',
  components: {
    QIcon
  },
  props: {
    value: String,
    align: {
      type: String,
      default: 'left',
      validator: v => ['left', 'center', 'right', 'justify'].includes(v)
    },
    position: {
      type: String,
      default: 'top',
      validator: v => ['top', 'bottom'].includes(v)
    },
    color: String,
    inverted: Boolean,
    twoLines: Boolean,
    noPaneBorder: Boolean
  },
  data () {
    return {
      tab: {},
      data: {
        tabName: this.value || '',
        color: this.color,
        inverted: this.inverted
      }
    }
  },
  watch: {
    value (name) {
      this.selectTab(name, true)
    },
    color (v) {
      this.data.color = v
    },
    inverted (v) {
      this.data.inverted = v
    }
  },
  provide () {
    return {
      data: this.data,
      selectTab: this.selectTab
    }
  },
  methods: {
    selectTab (name, instantSet) {
      if (this.data.tabName === name) {
        return
      }

      clearTimeout(this.timer)
      const el = this.__getTabElByName(name)

      if (this.$q.theme === 'ios') {
        this.__setTab({name, el})
        return
      }

      const posbarClass = this.$refs.posbar.classList
      posbarClass.remove('expand', 'contract')

      if (!el) {
        this.__setPositionBar(0, 0)
        this.__setTab({name})
        return
      }

      const
        offsetReference = this.$refs.posbar.parentNode.offsetLeft,
        width = el.getBoundingClientRect().width,
        offsetLeft = el.offsetLeft - offsetReference,
        index = this.$children.findIndex(child => child.name === name)

      this.timer = setTimeout(() => {
        if (!this.tab.el) {
          posbarClass.add('invisible')
          this.__setTab({name, el, width, offsetLeft, index})
          return
        }

        this.tab.width = this.tab.el.getBoundingClientRect().width
        this.tab.offsetLeft = this.tab.el.offsetLeft - offsetReference
        this.tab.index = this.$children.findIndex(child => child.name === this.tab.name)

        this.__setPositionBar(this.tab.width, this.tab.offsetLeft)
        posbarClass.remove('invisible')

        let calcWidth, calcOffsetLeft
        if (this.tab.index < index) {
          calcWidth = offsetLeft + width - this.tab.offsetLeft
          calcOffsetLeft = this.tab.offsetLeft
        }
        else {
          calcWidth = this.tab.offsetLeft + this.tab.width - offsetLeft
          calcOffsetLeft = offsetLeft
        }
        instantSet = instantSet || (calcWidth === this.tab.width && calcOffsetLeft === this.tab.offsetLeft)
        if (instantSet) {
          this.__setTab({name, el, width, offsetLeft, index})
        }
        this.timer = setTimeout(() => {
          posbarClass.add('expand')

          this.__setPositionBar(
            calcWidth,
            calcOffsetLeft
          )

          if (instantSet) {
            this.__beforePositionContract = () => {}
            return
          }
          this.__beforePositionContract = () => {
            this.__setTab({name, el, width, offsetLeft, index})
          }
        }, 30)
      }, 30)
    },
    __setTab (data) {
      this.data.tabName = data.name
      this.$emit('input', data.name)
      this.$emit('select', data.name)
      this.__scrollToTab(data.el)
      this.tab = data
    },
    __setPositionBar (width = 0, left = 0) {
      css(this.$refs.posbar, cssTransform(`translateX(${left}px) scaleX(${width})`))
    },
    __updatePosbarTransition () {
      const cls = this.$refs.posbar.classList

      if (cls.contains('expand')) {
        this.__beforePositionContract()
        cls.remove('expand')
        cls.add('contract')
        this.__setPositionBar(this.tab.width, this.tab.offsetLeft)
      }
      else if (cls.contains('contract')) {
        cls.remove('contract')
        cls.add('invisible')
        this.__setPositionBar(0, 0)
      }
    },
    __redraw () {
      if (!this.$q.platform.is.desktop) {
        return
      }
      if (width(this.$refs.scroller) === 0 && this.$refs.scroller.scrollWidth === 0) {
        return
      }
      if (width(this.$refs.scroller) + 5 < this.$refs.scroller.scrollWidth) {
        this.$refs.tabs.classList.add('scrollable')
        this.scrollable = true
        this.__updateScrollIndicator()
      }
      else {
        this.$refs.tabs.classList.remove('scrollable')
        this.scrollable = false
      }
    },
    __updateScrollIndicator () {
      if (!this.$q.platform.is.desktop || !this.scrollable) {
        return
      }
      let action = this.$refs.scroller.scrollLeft + width(this.$refs.scroller) + 5 >= this.$refs.scroller.scrollWidth ? 'add' : 'remove'
      this.$refs.leftScroll.classList[this.$refs.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled')
      this.$refs.rightScroll.classList[action]('disabled')
    },
    __getTabElByName (value) {
      const tab = this.$children.find(child => child.name === value)
      if (tab && tab.$el && tab.$el.nodeType === 1) {
        return tab.$el
      }
    },
    __findTabAndScroll (name, noAnimation) {
      setTimeout(() => {
        this.__scrollToTab(this.__getTabElByName(name), noAnimation)
      }, debounceDelay * 4)
    },
    __scrollToTab (tab, noAnimation) {
      if (!tab || !this.scrollable) {
        return
      }

      let
        contentRect = this.$refs.scroller.getBoundingClientRect(),
        rect = tab.getBoundingClientRect(),
        tabWidth = rect.width,
        offset = rect.left - contentRect.left

      if (offset < 0) {
        if (noAnimation) {
          this.$refs.scroller.scrollLeft += offset
        }
        else {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset)
        }
        return
      }

      offset += tabWidth - this.$refs.scroller.offsetWidth
      if (offset > 0) {
        if (noAnimation) {
          this.$refs.scroller.scrollLeft += offset
        }
        else {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset)
        }
      }
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
    __stopAnimScroll () {
      clearInterval(this.scrollTimer)
    },
    __scrollTowards (value) {
      let
        scrollPosition = this.$refs.scroller.scrollLeft,
        direction = value < scrollPosition ? -1 : 1,
        done = false

      scrollPosition += direction * scrollNavigationSpeed
      if (scrollPosition < 0) {
        done = true
        scrollPosition = 0
      }
      else if (
        (direction === -1 && scrollPosition <= value) ||
        (direction === 1 && scrollPosition >= value)
      ) {
        done = true
        scrollPosition = value
      }

      this.$refs.scroller.scrollLeft = scrollPosition
      return done
    }
  },
  created () {
    this.scrollTimer = null
    this.scrollable = !this.$q.platform.is.desktop

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.__redraw = debounce(this.__redraw, debounceDelay)
    this.__updateScrollIndicator = debounce(this.__updateScrollIndicator, debounceDelay)
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scroller.addEventListener('scroll', this.__updateScrollIndicator)
      window.addEventListener('resize', this.__redraw)

      if (this.data.tabName !== '' && this.value) {
        this.selectTab(this.value, true)
      }

      // let browser drawing stabilize then
      setTimeout(() => {
        this.__redraw()
        this.__findTabAndScroll(this.data.tabName, true)
      }, debounceDelay)
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    this.__stopAnimScroll()
    this.$refs.scroller.removeEventListener('scroll', this.__updateScrollIndicator)
    window.removeEventListener('resize', this.__redraw)
  }
}
</script>
