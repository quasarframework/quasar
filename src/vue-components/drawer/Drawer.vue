<template>
  <div class="drawer" :class="{'left-side': !rightSide, 'right-side': rightSide}">
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
import Platform from '../../features/platform'

const backdropOpacity = {mat: 0.7, ios: 0.2}

export default {
  props: {
    'right-side': Boolean,
    'swipe-only': Boolean
  },
  data () {
    return {
      opened: false,
      nodePosition: 0,
      backPosition: 0.01,
      nodeAnimUid: Utils.uid(),
      backAnimUid: Utils.uid()
    }
  },
  computed: {
    nodeStyle () {
      let css = Utils.dom.cssTransform(`translateX(${this.nodePosition}px)`)
      if (this.$quasar.theme === 'ios') {
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
  methods: {
    __animate (done) {
      let finalPos
      const
        backdrop = this.$refs.backdrop,
        complete = () => {
          if (!this.opened) {
            backdrop.classList.remove('active')
          }
          else {
            window.addEventListener('resize', this.close)
          }
          if (typeof done === 'function') {
            done()
          }
        }

      if (this.$quasar.theme === 'ios') {
        finalPos = this.opened ? (this.rightSide ? -1 : 1) * this.width : 0
      }
      else {
        finalPos = this.opened ? 0 : (this.rightSide ? 1 : -1) * this.width
      }

      if (this.opened) {
        backdrop.classList.add('active')
        if (Platform.has.popstate) {
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
        window.removeEventListener('resize', this.close)
        if (Platform.has.popstate) {
          window.removeEventListener('popstate', this.__popState)
          if (window.history.state && !window.history.state.__quasar_drawer) {
            window.history.go(-1)
          }
        }
      }

      Utils.animate({
        name: this.backAnimUid,
        pos: this.backPosition,
        finalPos: this.opened ? backdropOpacity[this.$quasar.theme] : 0.01,
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
    __openByTouch (event) {
      // interferes with browser's back/forward swipe feature
      if (Platform.is.ios) {
        return
      }

      const
        content = this.$refs.content,
        backdrop = this.$refs.backdrop

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      let
        position = event.distance.x,
        percentage

      if (event.isFinal) {
        this.opened = position > 75
      }

      if (this.$quasar.theme === 'ios') {
        position = Math.min(position, this.width)
        percentage = 1.0 - (this.width - Math.abs(position)) / this.width
        position = (this.rightSide ? -1 : 1) * position
      }
      else { // mat
        position = this.rightSide ? Math.max(this.width - position, 0) : Math.min(0, position - this.width)
        percentage = (this.width - Math.abs(position)) / this.width
      }

      if (event.isFirst) {
        backdrop.classList.add('active')
      }
      this.nodePosition = position
      this.backPosition = percentage * backdropOpacity[this.$quasar.theme]

      if (event.isFinal) {
        this.__animate()
      }
    },
    __closeByTouch (event) {
      const content = this.$refs.content
      let percentage, position, initialPosition

      if (Utils.dom.style(content, 'position') !== 'fixed') {
        return
      }

      initialPosition = (this.rightSide ? -1 : 1) * this.width
      position = this.rightSide
        ? Utils.format.between((event.direction === 'left' ? -1 : 1) * event.distance.x, 0, this.width)
        : Utils.format.between((event.direction === 'left' ? -1 : 1) * event.distance.x, -this.width, 0)

      if (event.isFinal) {
        this.opened = Math.abs(position) <= 75
      }

      if (this.$quasar.theme === 'ios') {
        position = initialPosition + position
        percentage = (this.rightSide ? -1 : 1) * position / this.width
      }
      else { // mat
        percentage = 1 + (this.rightSide ? -1 : 1) * position / this.width
      }

      this.nodePosition = position
      this.backPosition = percentage * backdropOpacity[this.$quasar.theme]

      if (event.isFinal) {
        this.__animate()
      }
    },
    setState (state, done) {
      if (
        (!this.swipeOnly && Utils.dom.viewport().width > 920) ||
        (typeof state === 'boolean' && this.opened === state)
      ) {
        if (typeof done === 'function') {
          done()
        }
        return
      }

      this.opened = !this.opened
      this.__animate(done)
    },
    __popState () {
      if (Platform.has.popstate && window.history.state && window.history.state.__quasar_drawer) {
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

      if (this.$quasar.theme === 'ios') {
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

      if (this.swipeOnly) {
        this.$el.classList.add('swipe-only')
      }

      this.__eventHandler = handler => {
        this.close(handler)
      }
    })
  },
  beforeDestroy () {
    this.setState(false)
  }
}
</script>
