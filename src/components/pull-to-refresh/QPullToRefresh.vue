<template>
  <div class="pull-to-refresh">
    <div
      class="pull-to-refresh-container"
      :style="style"
      v-touch-pan.vertical.scroll="__pull"
    >
      <div class="pull-to-refresh-message row items-center justify-center">
        <q-icon v-show="state !== 'refreshing'" :class="{'rotate-180': state === 'pulled'}" name="arrow_downward"></q-icon>
        <q-icon v-show="state === 'refreshing'" class="animate-spin" :name="refreshIcon"></q-icon>

        &nbsp;&nbsp;
        <span v-html="message"></span>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import { getScrollTarget, getScrollPosition } from '../../utils/scroll'
import { cssTransform } from '../../utils/dom'
import { QIcon } from '../icon'

export default {
  name: 'q-pull-to-refresh',
  components: {
    QIcon
  },
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: {
      type: String,
      default: 'Pull down to refresh'
    },
    releaseMessage: {
      type: String,
      default: 'Release to refresh'
    },
    refreshMessage: {
      type: String,
      default: 'Refreshing...'
    },
    refreshIcon: {
      type: String,
      default: 'refresh'
    },
    inline: Boolean,
    disable: Boolean
  },
  data () {
    let height = 65

    return {
      state: 'pull',
      pullPosition: -height,
      height: height,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  computed: {
    message () {
      switch (this.state) {
        case 'pulled':
          return this.releaseMessage
        case 'refreshing':
          return this.refreshMessage
        case 'pull':
        default:
          return this.pullMessage
      }
    },
    style () {
      return cssTransform(`translateY(${this.pullPosition}px)`)
    }
  },
  methods: {
    __pull (event) {
      if (this.disable) {
        return
      }

      if (event.isFinal) {
        this.scrolling = false
        this.pulling = false
        if (this.scrolling) {
          return
        }
        if (this.state === 'pulled') {
          this.state = 'refreshing'
          this.__animateTo(0)
          this.trigger()
        }
        else if (this.state === 'pull') {
          this.__animateTo(-this.height)
        }
        return
      }
      if (this.animating || this.scrolling || this.state === 'refreshing') {
        return true
      }

      let top = getScrollPosition(this.scrollContainer)
      if (top !== 0 || (top === 0 && event.direction !== 'down')) {
        this.scrolling = true
        if (this.pulling) {
          this.pulling = false
          this.state = 'pull'
          this.__animateTo(-this.height)
        }
        return true
      }

      event.evt.preventDefault()
      this.pulling = true
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85))
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull'
    },
    __animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating)
      }

      this.pullPosition -= (this.pullPosition - target) / 7

      if (this.pullPosition - target > 1) {
        this.animating = window.requestAnimationFrame(() => {
          this.__animateTo(target, done, true)
        })
      }
      else {
        this.animating = window.requestAnimationFrame(() => {
          this.pullPosition = target
          this.animating = false
          done && done()
        })
      }
    },
    trigger () {
      this.handler(() => {
        this.__animateTo(-this.height, () => {
          this.state = 'pull'
        })
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.inline ? this.$el.parentNode : getScrollTarget(this.$el)
    })
  }
}
</script>
