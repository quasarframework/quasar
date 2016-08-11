<template>
  <div class="quasar-tabs row items-center">
    <div class="row items-center justify-center left-scroll">
      <i>chevron_left</i>
    </div>
    <div class="quasar-tabs-scroller row auto">
      <div class="spacer"></div>
      <slot></slot>
      <div class="spacer"></div>
    </div>
    <div class="row items-center justify-center right-scroll">
      <i>chevron_right</i>
    </div>
  </div>
</template>

<script>
import Platform from '../../platform'
import Utils from '../../utils'

const
  scrollNavigationSpeed = 5, // in pixels
  debounceDelay = 50 // in ms

export default {
  methods: {
    redraw () {
      if (!Platform.is.desktop) {
        return
      }
      if (Utils.dom.width(this.scroller) === 0 && this.scroller.scrollWidth === 0) {
        return
      }
      if (Utils.dom.width(this.scroller) < this.scroller.scrollWidth) {
        this.$el.classList.add('scrollable')
        this.scrollable = true
        this.updateScrollIndicator()
      }
      else {
        this.$el.classList.remove('scrollable')
        this.scrollable = false
      }
    },
    updateScrollIndicator () {
      if (!Platform.is.desktop || !this.scrollable) {
        return
      }

      let action = this.scroller.scrollLeft + Utils.dom.width(this.scroller) + 5 >= this.scroller.scrollWidth ? 'add' : 'remove'

      this.leftScroll.classList[this.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled')
      this.rightScroll.classList[action]('disabled')
    },
    scrollToSelectedIfNeeded (tab) {
      if (tab.length === 0 || !this.scrollable) {
        return
      }

      let
        contentRect = this.scroller.getBoundingClientRect(),
        tabRect = tab.getBoundingClientRect(),
        tabWidth = tabRect.width,
        offset = tabRect.left - contentRect.left

      if (offset < 0) {
        this.animScrollTo(this.scroller.scrollLeft + offset)
      }
      else {
        offset += tabWidth - this.scroller.offsetWidth
        /* istanbul ignore else */
        if (offset > 0) {
          this.animScrollTo(this.scroller.scrollLeft + offset)
        }
      }
    },
    animScrollTo (value) {
      if (this.scrollTimer) {
        clearInterval(this.scrollTimer)
      }

      this.scrollTowards(value)
      this.scrollTimer = setInterval(() => {
        if (this.scrollTowards(value)) {
          clearInterval(this.scrollTimer)
        }
      }, 5)
    },
    scrollTowards (value) {
      let
        scrollPosition = this.scroller.scrollLeft,
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

      this.scroller.scrollLeft = scrollPosition
      return done
    }
  },
  events: {
    selected (tab, tabNode) {
      if (this.content.length > 0) {
        [].forEach.call(this.content, el => {
          el.style.display = 'none'
        })
        document.querySelector(tab.target).style.display = ''
      }

      this.$broadcast('blur', tab)

      setTimeout(() => {
        this.scrollToSelectedIfNeeded(tabNode)
      }, debounceDelay * 4)
    },
    hidden () {
      this.redraw()
    }
  },
  ready () {
    this.scrollTimer = null
    this.scrollable = !Platform.is.desktop

    this.scroller = this.$el.getElementsByClassName('quasar-tabs-scroller')[0]
    this.leftScroll = this.$el.getElementsByClassName('left-scroll')[0]
    this.rightScroll = this.$el.getElementsByClassName('right-scroll')[0]

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.redraw = Utils.debounce(this.redraw, debounceDelay)
    this.updateScrollIndicator = Utils.debounce(this.updateScrollIndicator, debounceDelay)

    this.content = this.$children.filter(child => child.target)
    if (this.content.length > 0) {
      this.content = document.querySelectorAll(
        this.content.map(child => child.target).join(',')
      )
      ;[].forEach.call(this.content, el => {
        el.style.display = 'none'
      })
    }

    this.scroller.addEventListener('scroll', this.updateScrollIndicator)
    window.addEventListener('resize', this.redraw)

    // let browser drawing stabilize then
    setTimeout(() => { this.redraw() }, debounceDelay)

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
        this.leftScroll.addEventListener(evt, () => {
          this.animScrollTo(0)
        })
        this.rightScroll.addEventListener(evt, () => {
          this.animScrollTo(9999)
        })
      })
      scrollEvents.stop.forEach(evt => {
        this.leftScroll.addEventListener(evt, () => {
          clearInterval(this.scrollTimer)
        })
        this.rightScroll.addEventListener(evt, () => {
          clearInterval(this.scrollTimer)
        })
      })
    }
  },
  beforeDestroy () {
    if (this.scrollTimer) {
      clearInterval(this.scrollTimer)
    }
    this.scroller.removeEventListener('scroll', this.updateScrollIndicator)
    window.removeEventListener('resize', this.redraw)
  }
}
</script>
