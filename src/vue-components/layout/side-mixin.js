import { between } from '../../utils/format'

export default {
  props: {
    leftSide: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      backdrop: {
        inTransit: false,
        touchEvent: false,
        percentage: 0
      },

      leftState: {
        position: 0,
        openedSmall: false,
        openedBig: 'showDefault' in this.leftSide
          ? this.leftSide.hideOnStart
          : true
      }
    }
  },
  computed: {
    leftBreakpoint () {
      const breakpoint = this.leftSide.breakpoint || 996
      return !this.leftState.openedSmall && this.layout.w >= breakpoint
    },
    leftOnLayout () {
      return this.leftBreakpoint && this.leftState.openedBig
    },
    hideBackdrop () {
      return !this.backdrop.inTransit && !this.leftState.openedSmall
    }
  },
  methods: {
    toggleLeft () {
      if (this.leftState.openedSmall || (this.leftBreakpoint && this.leftState.openedBig)) {
        this.hideLeft()
      }
      else {
        this.showLeft()
      }
    },
    __popState () {
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_layout_overlay) {
        window.removeEventListener('popstate', this.__popState)
        this.__hideLeft()
      }
    },
    __hideLeft () {
      this.leftState.openedSmall = false
      this.backdrop.percentage = 0
    },
    hideLeft () {
      if (this.backdrop.touchEvent) {
        this.backdrop.touchEvent = false
        return
      }

      if (this.leftState.openedSmall) {
        document.body.classList.remove('with-layout-side-opened')
        if (this.$q.platform.has.popstate) {
          if (window.history.state && !window.history.state.__quasar_layout_overlay) {
            window.history.go(-1)
          }
        }
        else {
          this.__hideLeft()
        }
      }
      else {
        this.leftState.openedBig = false
      }
    },
    showLeft () {
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
        document.body.classList.add('with-layout-side-opened')
        this.leftState.openedSmall = true
        this.backdrop.percentage = 1
      }
    },
    __openLeftByTouch (evt) {
      const position = between(evt.distance.x, 0, this.left.w)

      if (evt.isFinal) {
        const opened = position > 75
        this.backdrop.inTransit = false
        if (opened) {
          this.showLeft()
        }
        else {
          this.backdrop.percentage = 0
        }
        return
      }

      this.leftState.position = Math.min(0, position - this.left.w)
      this.backdrop.percentage = between(position / this.left.w, 0, 1)

      if (evt.isFirst) {
        document.body.classList.add('with-layout-side-opened')
        this.backdrop.inTransit = true
      }
    },
    __closeLeftByTouch (evt) {
      if (this.leftOnLayout) {
        return
      }
      const position = evt.direction === 'left'
        ? between(evt.distance.x, 0, this.left.w)
        : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) <= 75
        this.backdrop.inTransit = false
        if (!opened) {
          this.hideLeft()
        }
        else {
          this.backdrop.percentage = 1
        }
        return
      }

      this.leftState.position = -position
      this.backdrop.percentage = between(1 + position / this.left.w, 0, 1)

      if (evt.isFirst) {
        this.backdrop.inTransit = true
        this.backdrop.touchEvent = true
      }
    }
  }
}
