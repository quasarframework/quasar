<template>
  <div class="drawer" :class="{'left-side': !rightSide, 'right-side': rightSide}">
    <div
      class="drawer-opener touch-only mobile-only"
      v-touch:pan="openByTouch"
      v-touch-options:pan="{ direction: 'horizontal' }"
      :class="{'fixed-left': !rightSide, 'fixed-right': rightSide}"
    >&nbsp</div>
    <div
      ref="backdrop"
      class="drawer-backdrop fullscreen"
      style="background: rgba(0, 0, 0, 0.01)"
      @click.native="setState(false)"
      v-touch:pan="closeByTouch"
      v-touch-options:pan="{ direction: 'horizontal' }"
    ></div>
    <div
      ref="content"
      v-touch:pan="closeByTouch"
      v-touch-options:pan="{ direction: 'horizontal' }"
      class="drawer-content"
      :class="{'left-side': !rightSide, 'right-side': rightSide}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import * as theme from '../../theme'
import Platform from '../../platform'

const
  drawerAnimationSpeed = 150,
  backdropOpacity = {
    mat: 0.7,
    ios: 0.2
  },
  appContainer = document.getElementById('quasar-app')

let
  leftDrawer,
  rightDrawer

function getCurrentPosition (node) {
  let transform = Utils.dom.style(node, 'transform')
  return transform !== 'none' ? parseInt(transform.split(/[()]/)[1].split(', ')[4], 10) : 0
}

function getBetween (value, min, max) {
  if (value < min) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}

function closeDrawers (done) {
  if (leftDrawer && leftDrawer.opened) {
    leftDrawer.setState(false, done)
    return
  }
  if (rightDrawer && rightDrawer.opened) {
    rightDrawer.setState(false, done)
    return
  }

  if (typeof done === 'function') {
    done()
  }
}

export default {
  props: {
    'right-side': {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    'swipe-only': {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  data () {
    return {
      opened: false
    }
  },
  methods: {
    __matToggleAnimate (percentage, done) {
      const
        node = this.$refs.content,
        backdrop = this.$refs.backdrop,
        currentPosition = getCurrentPosition(node),
        closePosition = (this.rightSide ? 1 : -1) * this.width

      Velocity(node, 'stop')
      Velocity(
        node,
        {translateX: this.opened ? [0, currentPosition] : [closePosition, currentPosition]},
        {duration: !this.opened || currentPosition !== 0 ? drawerAnimationSpeed : 0}
      )

      if (this.opened) {
        backdrop.classList.add('active')
        if (!Platform.within.iframe) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_drawer: true}, '')
          }
          else {
            window.history.state.__quasar_drawer = true
          }
          window.history.pushState({}, '')
          window.addEventListener('popstate', this.__popState)
        }
      }
      else {
        window.removeEventListener('resize', closeDrawers)
        if (!Platform.within.iframe) {
          window.removeEventListener('popstate', this.__popState)
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1)
          }
        }
      }

      Velocity(backdrop, 'stop')
      Velocity(
        backdrop,
        {
          'backgroundColor': '#000',
          'backgroundColorAlpha': this.opened ? backdropOpacity.mat : 0.01
        },
        {
          duration: drawerAnimationSpeed,
          complete: () => {
            if (!this.opened) {
              backdrop.classList.remove('active')
            }
            else {
              window.addEventListener('resize', closeDrawers)
            }
            if (typeof done === 'function') {
              done()
            }
          }
        }
      )
    },
    __iosToggleAnimate (percentage, done) {
      const backdrop = this.$refs.backdrop

      if (this.opened) {
        backdrop.classList.add('active')
        document.body.classList.add('drawer-opened')
        if (!Platform.within.iframe) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_drawer: true}, '')
          }
          else {
            window.history.state.__quasar_drawer = true
          }
          window.history.pushState({}, '')
          window.addEventListener('popstate', this.__popState)
        }
      }
      else {
        window.removeEventListener('resize', closeDrawers)
        if (!Platform.within.iframe) {
          window.removeEventListener('popstate', this.__popState)
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1)
          }
        }
      }

      let
        currentPosition = getCurrentPosition(appContainer),
        openPosition = (this.rightSide ? -1 : 1) * this.width

      Velocity(appContainer, 'stop')
      Velocity(appContainer,
        {translateX: this.opened ? [openPosition, currentPosition] : [0, currentPosition]},
        {duration: !this.opened || currentPosition !== openPosition ? drawerAnimationSpeed : 0}
      )

      Velocity(backdrop, 'stop')
      Velocity(
        backdrop,
        {
          'backgroundColor': '#000',
          'backgroundColorAlpha': this.opened ? backdropOpacity.ios : 0.01
        },
        {
          duration: drawerAnimationSpeed,
          complete: () => {
            if (!this.opened) {
              backdrop.classList.remove('active')
              document.body.classList.remove('drawer-opened')
            }
            else {
              window.addEventListener('resize', closeDrawers)
            }
            if (typeof done === 'function') {
              done()
            }
          }
        }
      )
    },
    openByTouch (event) {
      const
        content = this.$refs.content,
        backdrop = this.$refs.backdrop

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      let
        position = Math.abs(event.deltaX),
        target,
        fn,
        percentage

      if (event.isFinal) {
        this.opened = position > 75
      }

      if (theme.current === 'ios') {
        position = Math.min(position, this.width)
        percentage = 1.0 - (this.width - Math.abs(position)) / this.width
        fn = this.__iosToggleAnimate
        target = appContainer
        position = (this.rightSide ? -1 : 1) * position
      }
      else { // mat
        position = this.rightSide ? Math.max(this.width - position, 0) : Math.min(0, position - this.width)
        percentage = (this.width - Math.abs(position)) / this.width
        fn = this.__matToggleAnimate
        target = content
      }

      if (event.isFinal) {
        fn(percentage, null)
        return
      }

      target.style.transform = 'translateX(' + position + 'px)'
      backdrop.classList.add('active')
      backdrop.style.background = 'rgba(0,0,0,' + percentage * backdropOpacity[theme.current] + ')'
    },
    closeByTouch (event) {
      const
        content = this.$refs.content,
        backdrop = this.$refs.backdrop

      let
        target, fn, percentage, position,
        initialPosition

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      position = this.rightSide ? getBetween(event.deltaX, 0, this.width) : getBetween(event.deltaX, -this.width, 0)
      initialPosition = (this.rightSide ? -1 : 1) * this.width

      if (event.isFinal) {
        this.opened = Math.abs(position) <= 75
      }

      if (theme.current === 'ios') {
        position = initialPosition + position
        percentage = (this.rightSide ? -1 : 1) * position / this.width
        fn = this.__iosToggleAnimate
        target = appContainer
      }
      else { // mat
        percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width
        fn = this.__matToggleAnimate
        target = content
      }

      if (event.isFinal) {
        fn(percentage, null)
        return
      }

      target.style.transform = 'translateX(' + position + 'px)'
      backdrop.style.background = 'rgba(0,0,0,' + percentage * backdropOpacity[theme.current] + ')'
    },
    setState (state, done) {
      if (
        (!this.swipeOnly && Utils.dom.viewport().width > 600) ||
        (typeof state === 'boolean' && this.opened === state)
      ) {
        if (typeof done === 'function') {
          done()
        }
        return
      }

      this.opened = !this.opened
      let fn = theme.current === 'ios' ? this.__iosToggleAnimate : this.__matToggleAnimate

      fn(this.opened ? 0.01 : 1, done)
    },
    __popState () {
      if (!Platform.within.iframe) {
        if (window.history.state && window.history.state.__quasar_drawer) {
          this.setState(false)
        }
      }
    },
    open (done) {
      this.setState(true, done)
    },
    close (done) {
      this.setState(false, done)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const
        content = this.$refs.content,
        toggles = this.$el.closest('.layout').getElementsByClassName((this.rightSide ? 'right' : 'left') + '-drawer-opener')

      this.width = Utils.dom.width(content)

      ;[].slice.call(toggles).forEach(el => {
        el.addEventListener('click', () => {
          this.setState(true)
        })
      })

      ;[].slice.call(content.getElementsByClassName('drawer-closer')).forEach(el => {
        el.addEventListener('click', () => {
          this.setState(false)
        })
      })

      if (this.swipeOnly) {
        [].slice.call(toggles).forEach(el => {
          el.classList.add('always-visible')
        })
        this.$el.classList.add('swipe-only')
      }

      if (this.rightSide) {
        rightDrawer = this
      }
      else {
        leftDrawer = this
      }
    })
  },
  beforeDestroy () {
    this.setState(false)

    if (this.rightSide) {
      rightDrawer = null
    }
    else {
      leftDrawer = null
    }
  }
}
</script>
