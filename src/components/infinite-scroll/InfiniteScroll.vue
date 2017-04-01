<template>
  <div class="q-infinite-scroll">
    <div ref="content" class="q-infinite-scroll-content">
      <slot></slot>
    </div>
    <div class="q-infinite-scroll-message" v-show="fetching">
      <slot name="message"></slot>
    </div>
  </div>
</template>

<script>
import { height, offset } from '../../utils/dom'
import { debounce } from '../../utils/debounce'
import { getScrollTarget } from '../../utils/scroll'

export default {
  name: 'q-infinite-scroll',
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: Boolean,
    offset: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      index: 0,
      fetching: false,
      working: true
    }
  },
  methods: {
    poll () {
      if (this.fetching || !this.working) {
        return
      }

      let
        containerHeight = height(this.scrollContainer),
        containerBottom = offset(this.scrollContainer).top + containerHeight,
        triggerPosition = offset(this.element).top + height(this.element) - (this.offset || containerHeight)

      if (triggerPosition < containerBottom) {
        this.loadMore()
      }
    },
    loadMore () {
      if (this.fetching || !this.working) {
        return
      }

      this.index++
      this.fetching = true
      this.handler(this.index, stopLoading => {
        this.fetching = false
        if (stopLoading) {
          this.stop()
          return
        }
        if (this.element.closest('body')) {
          this.poll()
        }
      })
    },
    reset () {
      this.index = 0
    },
    resume () {
      this.working = true
      this.scrollContainer.addEventListener('scroll', this.poll)
      this.poll()
    },
    stop () {
      this.working = false
      this.scrollContainer.removeEventListener('scroll', this.poll)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.poll = debounce(this.poll, 50)
      this.element = this.$refs.content

      this.scrollContainer = this.inline ? this.$el : getScrollTarget(this.$el)
      if (this.working) {
        this.scrollContainer.addEventListener('scroll', this.poll)
      }

      this.poll()
    })
  },
  beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.poll)
  }
}
</script>
