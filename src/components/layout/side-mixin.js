import { between } from '../../utils/format'

export default {
  methods: {
    toggleLeft (fn) {
      this.__toggle('left', fn)
    },
    toggleRight (fn) {
      this.__toggle('right', fn)
    },
    showLeft (fn) {
      this.__show('left', fn)
    },
    showRight (fn) {
      this.__show('right', fn)
    },
    hideLeft (fn) {
      this.__hide('left', fn)
    },
    hideRight (fn) {
      this.__hide('right', fn)
    },
    hideCurrentSide (fn) {
      if (this.leftState.openedSmall) {
        this.hideLeft(fn)
      }
      else if (this.rightState.openedSmall) {
        this.hideRight(fn)
      }
      else if (typeof fn === 'function') {
        fn()
      }
    },

    __toggle (side) {
      const state = this[side + 'State']
      if (state.openedSmall || (this[side + 'OverBreakpoint'] && state.openedBig)) {
        this.__hide(side)
      }
      else {
        this.__show(side)
      }
    },
    __popState () {
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_layout_overlay) {
        window.removeEventListener('popstate', this.__popState)
        this.__hideSmall(this.popStateCallback)
        this.popStateCallback = null
      }
    },
    __hideSmall (fn) {
      this.rightState.openedSmall = false
      this.leftState.openedSmall = false
      this.backdrop.percentage = 0
      if (typeof fn === 'function') {
        setTimeout(fn, 310)
      }
    },
    __hide (side, fn) {
      if (typeof side !== 'string') {
        if (this.backdrop.touchEvent) {
          this.backdrop.touchEvent = false
          return
        }
        side = this.leftState.openedSmall ? 'left' : 'right'
      }

      const state = this[side + 'State']

      if (!state.openedSmall) {
        state.openedBig = false
        return
      }

      document.body.classList.remove('with-layout-side-opened')
      if (this.$q.platform.has.popstate) {
        this.popStateCallback = fn
        if (window.history.state && !window.history.state.__quasar_layout_overlay) {
          window.history.go(-1)
        }
      }
      else {
        this.__hideSmall(fn)
      }
    },
    __show (side, fn) {
      const state = this[side + 'State']
      if (this[side + 'OverBreakpoint']) {
        state.openedBig = true
        if (typeof fn === 'function') {
          fn()
        }
        return
      }

      if (!this.$slots[side]) {
        return
      }

      if (this.$q.platform.has.popstate) {
        if (!window.history.state) {
          window.history.replaceState({__quasar_layout_overlay: true}, '')
        }
        else {
          window.history.state.__quasar_layout_overlay = true
        }
        let hist = window.history.state || {}
        hist.__quasar_layout_overlay = true
        window.history.replaceState(hist, '')
        window.history.pushState({}, '')
        window.addEventListener('popstate', this.__popState)
      }

      document.body.classList.add('with-layout-side-opened')
      state.openedSmall = true
      this.backdrop.percentage = 1
      if (typeof fn === 'function') {
        fn()
      }
    },
    __openLeftByTouch (evt) {
      this.__openByTouch(evt, 'left')
    },
    __openRightByTouch (evt) {
      this.__openByTouch(evt, 'right', true)
    },
    __openByTouch (evt, side, right) {
      const
        width = this[side].w,
        position = between(evt.distance.x, 0, width),
        state = this[side + 'State'],
        withBackdrop = !this[side + 'OverBreakpoint']

      if (evt.isFinal) {
        const opened = position >= Math.min(75, width)
        this.backdrop.inTransit = false
        state.inTransit = false
        if (opened) {
          this.__show(side)
        }
        else {
          this.backdrop.percentage = 0
        }
        return
      }

      state.position = right
        ? Math.max(width - position, 0)
        : Math.min(0, position - width)

      if (withBackdrop) {
        this.backdrop.percentage = between(position / width, 0, 1)
      }

      if (evt.isFirst) {
        if (withBackdrop) {
          document.body.classList.add('with-layout-side-opened')
          this.backdrop.inTransit = side
        }
        state.inTransit = true
      }
    },
    __closeLeftByTouch (evt) {
      this.__closeByTouch(evt, 'left')
    },
    __closeRightByTouch (evt) {
      this.__closeByTouch(evt, 'right', true)
    },
    __closeByTouch (evt, side, right) {
      if (side === void 0) {
        right = this.rightState.openedSmall
        side = right ? 'right' : 'left'
      }
      const
        width = this[side].w,
        state = this[side + 'State']

      if (this[side + 'OnLayout']) {
        return
      }

      const position = evt.direction === side
        ? between(evt.distance.x, 0, width)
        : 0

      if (evt.isFinal) {
        const opened = Math.abs(position) < Math.min(75, width)
        this.backdrop.inTransit = false
        state.inTransit = false
        if (!opened) {
          this.__hide(side)
        }
        else {
          this.backdrop.percentage = 1
        }
        return
      }

      state.position = (right ? 1 : -1) * position
      this.backdrop.percentage = between(1 + (right ? -1 : 1) * position / width, 0, 1)

      if (evt.isFirst) {
        this.backdrop.inTransit = true
        state.inTransit = true
        this.backdrop.touchEvent = true
      }
    }
  }
}
