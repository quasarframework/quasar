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

function iosFixNeeded (el) {
  if (Platform.is.mobile && Platform.is.ios) {
    const style = window.getComputedStyle(el)
    return ['fixed', 'absolute'].includes(style.position)
  }
}

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
      },
      mounted: false
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

      if (iosFixNeeded(this.$el)) {
        this.__repositionBackdrop()
      }

      if (!fromBackdrop && !this.opened) {
        this.$emit('click')
      }
    },
    __repositionBackdrop () {
      const {top, left} = Utils.dom.offset(this.$el)
      this.backdrop.top = top
      this.backdrop.left = left
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.mounted = true
    })
  },
  computed: {
    backdropPosition () {
      if (this.mounted && iosFixNeeded(this.$el)) {
        return Utils.dom.cssTransform(`translate3d(${-this.backdrop.left}px, ${-this.backdrop.top}px, 0)`)
      }
    }
  }
}
</script>
