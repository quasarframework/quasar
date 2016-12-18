<template>
  <div
    class="q-fab flex inline justify-center"
    :class="{opened: opened}"
  >
    <div class="backdrop animate-fade" @click="toggle(true)" :style="backdropPosition"></div>
    <button class="circular raised" @click="toggle()" :class="classNames">
      <i class="q-fab-icon">{{icon}}</i>
      <i class="q-fab-active-icon">{{activeIcon}}</i>
    </button>
    <div class="q-fab-actions flex inline items-center" :class="[direction]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'
import Platform from '../../features/platform'

export default {
  props: {
    classNames: {
      default: 'primary'
    },
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      opened: false,
      backdrop: {
        top: 0,
        left: 0
      }
    }
  },
  methods: {
    open () {
      this.opened = true
      this.__repositionBackdrop()
    },
    close (fn) {
      this.opened = false
      if (typeof fn === 'function') {
        fn()
      }
    },
    toggle (fromBackdrop) {
      this.opened = !this.opened
      if (this.opened) {
        this.__repositionBackdrop()
      }

      if (!fromBackdrop && !this.opened) {
        this.$emit('click')
      }
    },
    __repositionBackdrop () {
      if (Platform.is.mobile && Platform.is.ios) {
        const {top, left} = Utils.dom.offset(this.$el)
        this.backdrop.top = top
        this.backdrop.left = left
      }
    }
  },
  computed: {
    backdropPosition () {
      if (Platform.is.mobile && Platform.is.ios) {
        return Utils.dom.cssTransform(`translate3d(${-this.backdrop.left}px, ${-this.backdrop.top}px, 0)`)
      }
    }
  }
}
</script>
