<template>
  <div class="drawer" :class="{'left-side': !rightSide, 'right-side': rightSide, active: active, 'swipe-only': swipeOnly}">
    <div
      class="drawer-opener touch-only mobile-only"
      v-touch-pan.horizontal="__openByTouch"
      :class="{'fixed-left': !rightSide, 'fixed-right': rightSide}"
    >&nbsp</div>
    <div
      ref="backdrop"
      class="drawer-backdrop fullscreen"
      :style="backdropStyle"
      @click="setState(false)"
      v-touch-pan.horizontal="__closeByTouch"
    ></div>
    <div
      ref="content"
      v-touch-pan.horizontal="__closeByTouch"
      class="drawer-content"
      :style="nodeStyle"
      :class="{'left-side': !rightSide, 'right-side': rightSide}"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import { current as theme } from '../../features/theme'

export default {
  props: {
    rightSide: Boolean,
    swipeOnly: Boolean,
    backdropOpacity: {
      type: Number,
      validator (v) {
        return v >= 0 && v <= 1
      },
      default: theme === 'ios' ? 0.2 : 0.7
    }
  },
  data () {
    return {
      active: false,
      opened: false,
      nodePosition: 0,
      backPosition: 0,
      nodeAnimUid: Utils.uid(),
      backAnimUid: Utils.uid()
    }
  },
  computed: {
    nodeStyle () {
      let css = Utils.dom.cssTransform(`translateX(${this.nodePosition}px)`)
      if (this.$q.theme === 'ios') {
        if (this.layoutContainer) {
          Utils.dom.css(this.layoutContainer, css)
        }
        return
      }
      return css
    },
    backdropStyle () {
      return {background: `rgba(0,0,0,${this.backPosition})`}
    }
  },
  watch: {
    active (val) {
      document.body.classList[val ? 'add' : 'remove']('with-drawer-opened')
    }
  },
  methods: {
    __animate (done) {
      let finalPos
      const complete = () => {
        if (!this.opened) {
          this.active = false
        }
        if (typeof done === 'function') {
          done()
        }
      }

      if (this.$q.theme === 'ios') {
        finalPos = this.opened ? (this.rightSide ? -1 : 1) * this.width : 0
      }
      else {
        finalPos = this.opened ? 0 : (this.rightSide ? 1 : -1) * this.width
      }

      if (this.opened) {
        this.active = true
        if (this.$q.platform.has.popstate) {
          if (!window.history.state) {
            window.history.replaceState({__quasar_drawer: true}, '')
          }
          else {
            window.history.state.__quasar_drawer = true
          }
          let state = window.history.state || {}
          state.__quasar_drawer = true
          window.history.replaceState(state, '')
          window.history.pushState({}, '')
          window.addEventListener('popstate', this.__popState)
        }
      }
      else {
        if (this.$q.platform.has.popstate) {
          window.removeEventListener('popstate', this.__popState)
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1)
          }
        }
      }

      Utils.animate({
        name: this.backAnimUid,
        pos: this.backPosition,
        finalPos: this.opened ? this.backdropOpacity : 0,
        apply: (pos) => {
          this.backPosition = pos
        },
        threshold: 0.01
      })
      Utils.animate({
        name: this.nodeAnimUid,
        pos: this.nodePosition,
        finalPos,
        apply: (pos) => {
          this.nodePosition = pos
        },
        done: complete
      })
    },
    __openByTouch (evt) {
      const content = this.$refs.content

      // on iOS platform it interferes with browser's back/forward swipe feature
      if (this.$q.platform.is.ios || Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      let
        position = evt.distance.x,
        percentage

      if (evt.isFinal) {
        this.opened = position > 75
      }

      if (this.$q.theme === 'ios') {
        position = Math.min(position, this.width)
        percentage = 1.0 - (this.width - Math.abs(position)) / this.width
        position = (this.rightSide ? -1 : 1) * position
      }
      else { // mat
        position = this.rightSide ? Math.max(this.width - position, 0) : Math.min(0, position - this.width)
        percentage = (this.width - Math.abs(position)) / this.width
      }

      if (evt.isFirst) {
        this.active = true
      }
      this.nodePosition = position
      this.backPosition = percentage * this.backdropOpacity

      if (evt.isFinal) {
        this.__animate()
      }
    },
    __closeByTouch (evt) {
      const content = this.$refs.content
      let percentage, position, initialPosition

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      initialPosition = (this.rightSide ? -1 : 1) * this.width
      position = this.rightSide
        ? Utils.format.between((evt.direction === 'left' ? -1 : 1) * evt.distance.x, 0, this.width)
        : Utils.format.between((evt.direction === 'left' ? -1 : 1) * evt.distance.x, -this.width, 0)

      if (evt.isFinal) {
        this.opened = Math.abs(position) <= 75
      }

      if (this.$q.theme === 'ios') {
        position = initialPosition + position
        percentage = (this.rightSide ? -1 : 1) * position / this.width
      }
      else { // mat
        percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width
      }

      this.nodePosition = position
      this.backPosition = percentage * this.backdropOpacity

      if (evt.isFinal) {
        this.__animate()
      }
    },
    setState (state, done) {
      if (this.active === state || this.active !== this.opened) {
        return
      }

      this.opened = !this.opened
      this.active = true
      this.__animate(done)
    },
    __popState () {
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_drawer) {
        this.setState(false)
      }
    },
    open (done) {
      this.setState(true, done)
    },
    close (done) {
      this.setState(false, done)
    },
    toggle (done) {
      this.setState(!this.opened, done)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const content = this.$refs.content
      this.width = Utils.dom.width(content)

      if (this.$q.theme === 'ios') {
        this.layoutContainer = this.$el.closest('.layout') || document.getElementById('q-app')
      }
      else {
        this.nodePosition = this.width * (this.rightSide ? 1 : -1)
      }

      ;[].slice.call(content.getElementsByClassName('drawer-closer')).forEach(el => {
        el.addEventListener('click', (event) => {
          event.stopPropagation()
          this.setState(false)
        })
      })
    })
  },
  beforeDestroy () {
    this.setState(false)
  }
}
</script>
