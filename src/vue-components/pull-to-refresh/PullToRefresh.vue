<template>
  <div class="pull-to-refresh">
    <div
      class="pull-to-refresh-container"
      :style="{transform: 'translateY(' + pullPosition + 'px)'}"
      v-touch-pan.vertical="__pull"
    >
      <div class="pull-to-refresh-message row items-center justify-center">
        <i v-show="state !== 'refreshing'" :class="{'rotate-180': state === 'pulled'}">arrow_downward</i>
        <i v-show="state === 'refreshing'" class="animate-spin">{{refreshIcon}}</i>

        &nbsp;&nbsp;
        <span v-html="message"></span>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import Utils from '../../utils'

export default {
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
    }
  },
  methods: {
    __pull (event) {
      if (this.scrolling) {
        if (event.isFinal) {
          this.scrolling = false
        }
        return
      }
      if (this.animating) {
        return
      }
      if (this.disable) {
        this.scrolling = false
        this.pulling = false
        this.animating = false
        this.state = 'pull'
        return
      }

      if (!this.pulling) {
        if (this.state === 'refreshing') {
          return
        }
        if (this.pullPosition === -this.height && event.direction === 'up') {
          return
        }

        let
          containerTop = Utils.dom.offset(this.scrollContainer).top,
          thisContainerTop = Utils.dom.offset(this.$el).top

        if (containerTop > thisContainerTop) {
          this.scrolling = true
          return
        }

        this.originalScrollOverflow = this.scrollContainer.style.overflow
        this.scrollContainer.style.overflow = 'hidden'
      }

      this.pulling = true
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85))

      if (this.pullPosition > this.distance) {
        if (event.isFinal) {
          this.state = 'refreshing'
          this.pulling = false
          this.scrollContainer.style.overflow = this.originalScrollOverflow
          this.__animateTo(0)
          this.trigger()
        }
        else {
          this.state = 'pulled'
        }
      }
      else {
        this.state = 'pull'
        if (event.isFinal) {
          this.pulling = false
          this.scrollContainer.style.overflow = this.originalScrollOverflow
          this.__animateTo(-this.height)
        }
      }
    },
    __animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating)
      }

      this.pullPosition -= (this.pullPosition - target) / 7

      if (this.pullPosition - target > 1) {
        this.animating = requestAnimationFrame(() => {
          this.__animateTo(target, done, true)
        })
      }
      else {
        this.animating = requestAnimationFrame(() => {
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
      this.scrollContainer = this.$el.parentNode
    })
  }
}
</script>
