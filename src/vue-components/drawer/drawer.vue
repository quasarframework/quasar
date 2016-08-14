<template>
  <div class="drawer" :class="{'left-side': !rightSide, 'right-side': rightSide}">
    <div
      class="drawer-opener touch-only mobile-only"
      v-touch:pan="openByTouch"
      v-touch-options:pan="{ direction: 'horizontal' }"
      :class="{'fixed-left': !rightSide, 'fixed-right': rightSide}"
    >&nbsp</div>
    <div
      v-el:backdrop
      class="drawer-backdrop fullscreen"
      style="background: rgba(0, 0, 0, 0.01)"
      @click="setState(false)"
      v-touch:pan="closeByTouch"
      v-touch-options:pan="{ direction: 'horizontal' }"
    ></div>
    <div
      v-el:content
      v-touch:pan="closeByTouch"
      v-touch-options:pan="{ direction: 'horizontal' }"
      class="drawer-content scroll"
      :class="{'left-side': !rightSide, 'right-side': rightSide}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import * as theme from '../../theme'

const
  drawerAnimationSpeed = 150,
  backdropOpacity = {
    mat: 0.7,
    ios: 0.2
  }

let
  leftDrawer,
  rightDrawer

function getCurrentPosition (node) {
  let transform = Utils.dom.style(node, 'transform')
  return transform !== 'none' ? parseInt(transform.split(/[()]/)[1].split(', ')[4], 10) : 0
}

function matToggleAnimate (onRightSide, opening, backdrop, percentage, drawerWidth, done, node) {
  const
    currentPosition = getCurrentPosition(node),
    closePosition = (onRightSide ? 1 : -1) * drawerWidth

  Velocity(node, 'stop')
  Velocity(
    node,
    {translateX: opening ? [0, currentPosition] : [closePosition, currentPosition]},
    {duration: !opening || currentPosition !== 0 ? drawerAnimationSpeed : 0}
  )

  if (opening) {
    backdrop.classList.add('active')
  }

  Velocity(backdrop, 'stop')
  Velocity(
    backdrop,
    {
      'backgroundColor': '#000',
      'backgroundColorAlpha': opening ? backdropOpacity.mat : 0.01
    },
    {
      duration: drawerAnimationSpeed,
      complete () {
        if (!opening) {
          backdrop.classList.remove('active')
          window.removeEventListener('resize', closeDrawers)
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
}

function iosToggleAnimate (onRightSide, opening, backdrop, percentage, drawerWidth, done) {
  if (opening) {
    backdrop.classList.add('active')
  }

  let
    currentPosition = getCurrentPosition(document.body),
    openPosition = (onRightSide ? -1 : 1) * drawerWidth

  Velocity(document.body, 'stop')
  Velocity(document.body,
    {translateX: opening ? [openPosition, currentPosition] : [0, currentPosition]},
    {duration: !opening || currentPosition !== openPosition ? drawerAnimationSpeed : 0}
  )

  Velocity(backdrop, 'stop')
  Velocity(
    backdrop,
    {
      'backgroundColor': '#000',
      'backgroundColorAlpha': opening ? backdropOpacity.ios : 0.01
    },
    {
      duration: drawerAnimationSpeed,
      complete () {
        if (!opening) {
          backdrop.classList.remove('active')
          window.removeEventListener('resize', closeDrawers)
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
}

function openByTouch (event) {
  const
    content = this.$els.content,
    backdrop = this.$els.backdrop

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
    fn = iosToggleAnimate
    target = document.body
    position = (this.rightSide ? -1 : 1) * position
  }
  else { // mat
    position = this.rightSide ? Math.max(this.width - position, 0) : Math.min(0, position - this.width)
    percentage = (this.width - Math.abs(position)) / this.width
    fn = matToggleAnimate
    target = content
  }

  if (event.isFinal) {
    fn(this.rightSide, this.opened, backdrop, percentage, this.width, null, content)
    return
  }

  target.style.transform = 'translateX(' + position + 'px)'
  backdrop.classList.add('active')
  backdrop.style.background = 'rgba(0,0,0,' + percentage * backdropOpacity[theme.current] + ')'
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

function closeByTouch (event) {
  const
    content = this.$els.content,
    backdrop = this.$els.backdrop

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
    fn = iosToggleAnimate
    target = document.body
  }
  else { // mat
    percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width
    fn = matToggleAnimate
    target = content
  }

  if (event.isFinal) {
    fn(this.rightSide, this.opened, backdrop, percentage, this.width, null, content)
    return
  }

  target.style.transform = 'translateX(' + position + 'px)'
  backdrop.style.background = 'rgba(0,0,0,' + percentage * backdropOpacity[theme.current] + ')'
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
    openByTouch (event) {
      openByTouch.call(this, event)
    },
    closeByTouch (event) {
      closeByTouch.call(this, event)
    },
    setState (state, done) {
      if (typeof state === 'boolean' && this.opened === state) {
        if (typeof done === 'function') {
          done()
        }
        return
      }

      this.opened = !this.opened
      let fn = theme.current === 'ios' ? iosToggleAnimate : matToggleAnimate

      fn(
        this.rightSide,
        this.opened,
        this.$els.backdrop,
        this.opened ? 0.01 : 1,
        this.width,
        done,
        this.$els.content
      )
    }
  },
  ready () {
    const
      content = this.$els.content,
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
  },
  destroy () {
    if (this.rightSide) {
      rightDrawer = null
    }
    else {
      leftDrawer = null
    }
  }
}
</script>
