<template>
  <div
    class="q-tabs flex no-wrap"
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
        glossy: glossy,
        [`bg-${color}`]: !inverted && color
      }"
    >
      <div ref="scroller" class="q-tabs-scroller row no-wrap">
        <slot name="title"></slot>
        <div
          v-if="$q.theme !== 'ios'"
          class="relative-position self-stretch q-tabs-global-bar-container"
          :class="[inverted && color ? `text-${color}` : '', data.highlight ? 'highlight' : '']"
        >
          <div
            ref="posbar"
            class="q-tabs-bar q-tabs-global-bar"
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
import { current as theme } from '../../features/theme'

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
      default: theme === 'ios' ? 'center' : 'left',
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
    noPaneBorder: Boolean,
    glossy: Boolean
  },
  data () {
    return {
      currentEl: null,
      posbar: {
        width: 0,
        left: 0
      },
      data: {
        highlight: true,
        tabName: this.value || '',
        color: this.color,
        inverted: this.inverted
      }
    }
  },
  watch: {
    value (name) {
      this.selectTab(name)
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
    selectTab (name) {
      if (this.data.tabName === name) {
        return
      }

      this.data.tabName = name
      this.$emit('select', name)

      if (this.value !== name) {
        this.$emit('input', name)
      }

      const el = this.__getTabElByName(name)

      if (el) {
        this.__scrollToTab(el)
      }

      if (this.$q.theme !== 'ios') {
        this.currentEl = el
        this.__repositionBar()
      }
    },
    __repositionBar () {
      clearTimeout(this.timer)

      let needsUpdate = false
      const
        ref = this.$refs.posbar,
        el = this.currentEl

      if (this.data.highlight !== false) {
        this.data.highlight = false
        needsUpdate = true
      }

      if (!el) {
        this.finalPosbar = {width: 0, left: 0}
        this.__setPositionBar(0, 0)
        return
      }

      const offsetReference = ref.parentNode.offsetLeft

      if (needsUpdate && this.oldEl) {
        this.__setPositionBar(
          this.oldEl.getBoundingClientRect().width,
          this.oldEl.offsetLeft - offsetReference
        )
      }

      this.timer = setTimeout(() => {
        const
          width = el.getBoundingClientRect().width,
          left = el.offsetLeft - offsetReference

        ref.classList.remove('contract')
        this.oldEl = el
        this.finalPosbar = {width, left}
        this.__setPositionBar(
          this.posbar.left < left
            ? left + width - this.posbar.left
            : this.posbar.left + this.posbar.width - left,
          this.posbar.left < left
            ? this.posbar.left
            : left
        )
      }, 20)
    },
    __setPositionBar (width = 0, left = 0) {
      if (this.posbar.width === width && this.posbar.left === left) {
        this.__updatePosbarTransition()
        return
      }
      this.posbar = {width, left}
      css(this.$refs.posbar, cssTransform(`translateX(${left}px) scaleX(${width})`))
    },
    __updatePosbarTransition () {
      if (
        this.finalPosbar.width === this.posbar.width &&
        this.finalPosbar.left === this.posbar.left
      ) {
        this.posbar = {}
        if (this.data.highlight !== true) {
          this.data.highlight = true
        }
        return
      }

      this.$refs.posbar.classList.add('contract')
      this.__setPositionBar(this.finalPosbar.width, this.finalPosbar.left)
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
      const tab = this.$children.find(child => child.name === value && child.$el && child.$el.nodeType === 1)
      if (tab) {
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
        this.selectTab(this.value)
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
