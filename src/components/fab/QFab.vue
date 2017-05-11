<template>
  <div
    class="q-fab flex inline justify-center"
    :class="{opened: opened}"
  >
    <div class="backdrop animate-fade" @click="toggle(true)" :style="backdropPosition"></div>
    <q-btn
      @click="toggle()"
      round
      :class="classNames"
      :outline="outline"
      :push="push"
      :flat="flat"
      :color="color"
    >
      <q-icon :name="icon" class="q-fab-icon"></q-icon>
      <q-icon :name="activeIcon" class="q-fab-active-icon"></q-icon>
    </q-btn>
    <div class="q-fab-actions flex inline items-center" :class="[direction]">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { offset, cssTransform } from '../../utils/dom'
import Platform from '../../features/platform'
import { QBtn } from '../btn'
import { QIcon } from '../icon'
import FabMixin from './fab-mixin'

function iosFixNeeded (el) {
  if (Platform.is.mobile && Platform.is.ios) {
    const style = window.getComputedStyle(el)
    return ['fixed', 'absolute'].includes(style.position)
  }
}

export default {
  name: 'q-fab',
  mixins: [FabMixin],
  components: {
    QBtn,
    QIcon
  },
  props: {
    classNames: String,
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
      const {top, left} = offset(this.$el)
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
        return cssTransform(`translate3d(${-this.backdrop.left}px, ${-this.backdrop.top}px, 0)`)
      }
    }
  }
}
</script>
