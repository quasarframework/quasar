<template>
  <div class="tabs row items-center">
    <div class="row items-center justify-center left-scroll">
      <i>chevron_left</i>
    </div>
    <div class="tabs-scroller row auto">
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
import $ from 'jquery'
import Platform from '../../platform'
import debounce from '../../utils/debounce'

let
  scrollNavigationSpeed = 5, // in pixels
  debounceDelay = 50 // in ms

export default {
  methods: {
    redraw () {
      let
        scrollPosition = 0,
        scroller = this.scroller[0]

      if (this.scroller.width() === 0 && scroller.scrollWidth === 0) {
        return
      }
      if (this.scrollable) {
        scrollPosition = scroller.scrollLeft
        this.nav.removeClass('scrollable')
        this.scrollable = false
      }
      if (this.scroller.width() < scroller.scrollWidth) {
        this.nav.addClass('scrollable')
        scroller.scrollLeft = scrollPosition
        this.scrollable = true
        this.updateScrollIndicator()
      }
    },
    updateScrollIndicator: function() {
      if (!Platform.is.desktop || !this.scrollable) {
        return
      }

      let scroller = this.scroller[0]

      this.leftScroll[scroller.scrollLeft <= 0 ? 'addClass' : 'removeClass']('disabled')
      this.rightScroll[scroller.scrollLeft + this.scroller.innerWidth() + 5 >= scroller.scrollWidth ? 'addClass' : 'removeClass']('disabled')
    },
    scrollToSelectedIfNeeded: function(tab) {
      if (tab.length === 0 || !this.scrollable) {
        return
      }

      let
        scroller = this.scroller[0],
        contentRect = scroller.getBoundingClientRect(),
        tabRect = tab[0].getBoundingClientRect(),
        tabWidth = tabRect.width,
        offset = tabRect.left - contentRect.left

      if (offset < 0) {
        this.animScrollTo(scroller.scrollLeft + offset)
      }
      else {
        offset += tabWidth - scroller.offsetWidth
        /* istanbul ignore else */
        if (offset > 0) {
          this.animScrollTo(scroller.scrollLeft + offset)
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
        scroller = this.scroller[0],
        scrollPosition = scroller.scrollLeft,
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

      scroller.scrollLeft = scrollPosition
      return done
    }
  },
  events: {
    selected (tab, tabNode) {
      this.content.css('display', 'none')
      $(tab.target).css('display', '')

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
    let self = this

    this.scrollTimer = null
    this.scrollable = false

    this.nav = $(this.$el)
    this.scroller = this.nav.find('.tabs-scroller')
    this.leftScroll = this.nav.find('.left-scroll')
    this.rightScroll = this.nav.find('.right-scroll')
    this.tabs = this.scroller.find('.tab')

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.redraw = debounce(this.redraw, debounceDelay)
    this.updateScrollIndicator = debounce(this.updateScrollIndicator, debounceDelay)

    this.content = $(
      this.$children
        .filter(($child) => $child.target)
        .map(($child) => $child.target)
        .join(',')
    )
    this.content.css('display', 'none')

    this.scroller.scroll(this.updateScrollIndicator)
    $(window).resize(this.redraw)

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

      this.leftScroll.bind(scrollEvents.start.join(' '), function() {
        self.animScrollTo(0)
      })
      this.leftScroll.bind(scrollEvents.stop.join(' '), function() {
        clearInterval(self.scrollTimer)
      })
      this.rightScroll.bind(scrollEvents.start.join(' '), function() {
        self.animScrollTo(9999)
      })
      this.rightScroll.bind(scrollEvents.stop.join(' '), function() {
        clearInterval(self.scrollTimer)
      })
    }

    if (Platform.has.touch) {
      this.tabs.each(function() {
        let
          hammer = $(this).hammer().getHammer(),
          lastOffset = 0

        hammer.on('panmove', function(ev) {
          self.scroller[0].scrollLeft += lastOffset - ev.deltaX
          lastOffset = ev.deltaX
        })
        hammer.on('panend', function() {
          lastOffset = 0
        })
      })
    }
  },
  beforeDestroy () {
    if (this.scrollTimer) {
      clearInterval(this.scrollTimer)
    }
    this.scroller.off('scroll', this.updateScrollIndicator)
    $(window).off('resize', this.redraw)
    if (Platform.has.touch) {
      this.tabs.each(function() {
        $(this).getHammer().destroy()
      })
    }
    this.leftScroll.off()
    this.rightScroll.off()
  }
}
</script>
