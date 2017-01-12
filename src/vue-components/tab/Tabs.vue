<template>
  <div class="q-tabs row">
    <div ref="leftScroll" class="row items-center justify-center left-scroll">
      <i>chevron_left</i>
    </div>
    <div ref="scroller" class="q-tabs-scroller row">
      <slot></slot>
    </div>
    <div ref="rightScroll" class="row items-center justify-center right-scroll">
      <i>chevron_right</i>
    </div>
  </div>
</template>

<script>
import Platform from '../../features/platform'
import Utils from '../../utils'

const
  scrollNavigationSpeed = 5, // in pixels
  debounceDelay = 50 // in ms

export default {
  props: {
    refs: {
      type: Object
    },
    value: [String, Object],
    defaultTab: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      innerValue: false
    }
  },
  computed: {
    activeTab: {
      get () {
        return this.usingModel ? this.value : this.innerValue
      },
      set (value) {
        if (this.usingModel) {
          this.$emit('input', value)
        }
        else {
          this.innerValue = value
        }
      }
    },
    usingModel () {
      return typeof this.value !== 'undefined'
    }
  },
  watch: {
    activeTab (value) {
      this.$emit('change', value)
      if (!value) {
        return
      }
      this.__findTabAndScroll(value)
    },
    '$children' () {
      this.redraw()
    }
  },
  created () {
    this.scrollTimer = null
    this.scrollable = !Platform.is.desktop

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.__redraw = Utils.debounce(this.__redraw, debounceDelay)
    this.__updateScrollIndicator = Utils.debounce(this.__updateScrollIndicator, debounceDelay)
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.scroller.addEventListener('scroll', this.__updateScrollIndicator)
      window.addEventListener('resize', this.__redraw)

      // let browser drawing stabilize then
      setTimeout(() => { this.__redraw() }, debounceDelay)

      if (Platform.is.desktop) {
        var scrollEvents = {
          start: [],
          stop: []
        }

        scrollEvents.start.push('mousedown')
        scrollEvents.stop.push('mouseup')

        if (Platform.has.touch) {
          scrollEvents.start.push('touchstart')
          scrollEvents.stop.push('touchend')
        }

        scrollEvents.start.forEach(evt => {
          this.$refs.leftScroll.addEventListener(evt, () => {
            this.__animScrollTo(0)
          })
          this.$refs.rightScroll.addEventListener(evt, () => {
            this.__animScrollTo(9999)
          })
        })
        scrollEvents.stop.forEach(evt => {
          this.$refs.leftScroll.addEventListener(evt, () => {
            clearInterval(this.scrollTimer)
          })
          this.$refs.rightScroll.addEventListener(evt, () => {
            clearInterval(this.scrollTimer)
          })
        })
      }

      if (this.usingModel && this.defaultTab) {
        console.warn('Tabs ignoring default-tab since using v-model.', this.$el)
      }
      if (this.usingModel) {
        this.__findTabAndScroll(this.activeTab)
      }
      else if (this.defaultTab) {
        this.setActiveTab(this.defaultTab)
        this.__findTabAndScroll(this.defaultTab)
      }
      else {
        this.__findTabAndScroll(this.activeTab)
      }
    })
  },
  beforeDestroy () {
    clearInterval(this.scrollTimer)
    this.$refs.scroller.removeEventListener('scroll', this.__updateScrollIndicator)
    window.removeEventListener('resize', this.__redraw)
  },
  methods: {
    setActiveTab (name) {
      this.activeTab = name
    },
    __redraw () {
      if (!Platform.is.desktop) {
        return
      }
      if (Utils.dom.width(this.$refs.scroller) === 0 && this.$refs.scroller.scrollWidth === 0) {
        return
      }
      if (Utils.dom.width(this.$refs.scroller) + 5 < this.$refs.scroller.scrollWidth) {
        this.$el.classList.add('scrollable')
        this.scrollable = true
        this.__updateScrollIndicator()
      }
      else {
        this.$el.classList.remove('scrollable')
        this.scrollable = false
      }
    },
    __updateScrollIndicator () {
      if (!Platform.is.desktop || !this.scrollable) {
        return
      }

      let action = this.$refs.scroller.scrollLeft + Utils.dom.width(this.$refs.scroller) + 5 >= this.$refs.scroller.scrollWidth ? 'add' : 'remove'

      this.$refs.leftScroll.classList[this.$refs.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled')
      this.$refs.rightScroll.classList[action]('disabled')
    },
    __findTabAndScroll (value) {
      setTimeout(() => {
        let tabElement = this.$children.find(child => child.uid === value)
        if (tabElement) {
          this.__scrollToSelectedIfNeeded(tabElement.$el)
        }
      }, debounceDelay * 4)
    },
    __scrollToSelectedIfNeeded (tab) {
      if (!tab || !this.scrollable) {
        return
      }

      let
        contentRect = this.$refs.scroller.getBoundingClientRect(),
        tabRect = tab.getBoundingClientRect(),
        tabWidth = tabRect.width,
        offset = tabRect.left - contentRect.left

      if (offset < 0) {
        this.__animScrollTo(this.$refs.scroller.scrollLeft + offset)
      }
      else {
        offset += tabWidth - this.$refs.scroller.offsetWidth
        if (offset > 0) {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset)
        }
      }
    },
    __animScrollTo (value) {
      clearInterval(this.scrollTimer)
      this.__scrollTowards(value)
      this.scrollTimer = setInterval(() => {
        if (this.__scrollTowards(value)) {
          clearInterval(this.scrollTimer)
        }
      }, 5)
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
      else if (direction === -1 && scrollPosition <= value || direction === 1 && scrollPosition >= value) {
        done = true
        scrollPosition = value
      }

      this.$refs.scroller.scrollLeft = scrollPosition
      return done
    }
  }
}
</script>
