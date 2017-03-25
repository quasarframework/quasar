import { between } from '../../utils/format'

export default {
  props: {
    leftSide: Object,
    rightSide: Object
  },
  data () {
    return {
      leftState: {
        openedSmall: false,
        openedBig: true,

        inTransit: false,
        touchEvent: false,
        position: 0,
        percentage: 0
      }
    }
  },
  computed: {
    leftBreakpoint () {
      const breakpoint = this.leftSide ? this.leftSide.breakpoint : 996
      return !this.leftState.openedSmall && this.layout.w >= (breakpoint || 996)
    },
    leftOnLayout () {
      return this.leftBreakpoint && this.leftState.openedBig
    },
    leftBackdrop () {
      return this.leftState.inTransit || this.leftState.openedSmall
    }
  },
  methods: {
    toggleLeft () {
      if (this.leftState.openedSmall || (this.leftBreakpoint && this.leftState.openedBig)) {
        this.closeSide()
      }
      else {
        this.openLeft()
      }
    },
    __popState () {
      console.log('popstate')
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_layout_overlay) {
        window.removeEventListener('popstate', this.__popState)
        this.__closeSide()
      }
    },
    __closeSide () {
      this.leftState.openedSmall = false
      this.leftState.percentage = 0
    },
    closeSide () {
      if (this.leftState.touchEvent) {
        this.leftState.touchEvent = false
        return
      }
      console.log('closeSide')
      if (this.leftState.openedSmall) {
        if (this.$q.platform.has.popstate) {
          if (window.history.state && !window.history.state.__quasar_layout_overlay) {
            window.history.go(-1)
          }
        }
        else {
          this.__closeSide()
        }
      }
      else {
        this.leftState.openedBig = false
      }
    },
    openLeft () {
      if (this.leftBreakpoint) {
        this.leftState.openedBig = true
      }
      else {
        if (this.$q.platform.has.popstate) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_layout_overlay: true}, '')
          }
          else {
            window.history.state.__quasar_layout_overlay = true
          }
          let state = window.history.state || {}
          state.__quasar_layout_overlay = true
          window.history.replaceState(state, '')
          window.history.pushState({}, '')
          window.addEventListener('popstate', this.__popState)
        }
        this.leftState.openedSmall = true
        this.leftState.percentage = 1
      }
    },
    __openLeft (evt) {
      const position = between(evt.distance.x, 0, this.left.w)

      if (evt.isFinal) {
        const opened = position > 75
        this.leftState.inTransit = false
        if (opened) {
          this.openLeft()
        }
        else {
          this.leftState.percentage = 0
        }
        return
      }

      this.leftState.position = Math.min(0, position - this.left.w)
      this.leftState.percentage = between(position / this.left.w, 0, 1)

      if (evt.isFirst) {
        this.leftState.inTransit = true
      }
    },
    __closeLeft (evt) {
      if (this.leftOnLayout) {
        return
      }
      const position = evt.direction === 'left'
        ? between(evt.distance.x, 0, this.left.w)
        : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) <= 75
        this.leftState.inTransit = false
        if (!opened) {
          this.closeSide()
        }
        else {
          this.leftState.percentage = 1
        }
        return
      }

      this.leftState.position = -position
      this.leftState.percentage = between(1 + position / this.left.w, 0, 1)

      if (evt.isFirst) {
        this.leftState.inTransit = true
        this.leftState.touchEvent = true
      }
    }
  }
}
