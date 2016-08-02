<template>
  <div class="pull-to-refresh">
    <div
      class="pull-to-refresh-container"
      :style="{transform: 'translateY(' + pullPosition + 'px)'}"
      v-touch:pan="pull"
      v-touch-options:pan="{ direction: 'vertical' }"
    >
      <div class="pull-to-refresh-message row items-center justify-center">
        <i v-show="state !== 'refreshing'" :class="{'rotate-180': state === 'pulled'}">arrow_downward</i>
        <i v-else class="spin">{{refreshIcon}}</i>

        &nbsp;&nbsp;
        <span v-show="state === 'pull'">
          {{pullMessage}}
        </span>
        <span v-show="state === 'pulled'">
          {{releaseMessage}}
        </span>
        <span v-show="state === 'refreshing'">
          {{refreshMessage}}
        </span>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data: function() {
    let height = 65

    return {
      state: 'pull',
      pullPosition: - height,
      height: height,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  methods: {
    pull (hammer) {
      if (this.scrolling) {
        if (hammer.isFinal) {
          this.scrolling = false
        }
        return
      }
      if (this.animating) {
        return
      }

      if (!this.pulling) {
        if (this.state === 'refreshing') {
          return
        }
        if (this.pullPosition === - this.height && hammer.direction === Hammer.DIRECTION_UP) {
          return
        }

        let
          containerTop = this.scrollContainer.offset().top,
          thisContainerTop = this.container.offset().top

        if (containerTop > thisContainerTop) {
          this.scrolling = true
          return
        }

        this.originalScrollOverflow = this.scrollContainer.css('overflow')
        this.scrollContainer.css('overflow', 'hidden')
      }

      this.pulling = true
      this.pullPosition = - this.height + Math.max(0, Math.pow(hammer.deltaY, 0.85))

      if (this.pullPosition > this.distance) {
        if (hammer.isFinal) {
          this.state = 'refreshing'
          this.pulling = false
          this.scrollContainer.css('overflow', this.originalScrollOverflow)
          this.animateTo(0)
          this.trigger()
        }
        else {
          this.state = 'pulled'
        }
      }
      else {
        this.state = 'pull'
        if (hammer.isFinal) {
          this.pulling = false
          this.scrollContainer.css('overflow', this.originalScrollOverflow)
          this.animateTo(- this.height)
        }
      }
    },
    animateTo (target, done, previousCall) {
      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating)
      }

      this.pullPosition -= (this.pullPosition - target) / 7

      if (this.pullPosition - target > 1) {
        this.animating = requestAnimationFrame(() => {
          this.animateTo(target, done, true)
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
        this.animateTo(-this.height, () => {
          this.state = 'pull'
        })
      })
    }
  },
  ready () {
    this.container = $(this.$el)
    this.scrollContainer = this.container.parent()
  }
}
</script>
