<template>
  <div class="quasar-infinite-scroll">
    <div ref="content" class="quasar-infinite-scroll-content">
      <slot></slot>
    </div>
    <br>
    <div class="quasar-infinite-scroll-message" v-show="fetching">
      <slot name="message"></slot>
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
    inline: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    offset: {
      type: Number,
      default: 0
    },
    working: {
      type: Boolean,
      default: true,
      coerce: Boolean
      // twoWay: true // emit event instead
    }
  },
  data () {
    return {
      index: 0,
      fetching: false
    }
  },
  watch: {
    working (value) {
      this.scrollContainer[value ? 'addEventListener' : 'removeEventListener']('scroll', this.scroll)
      if (value) {
        this.scroll()
      }
    }
  },
  methods: {
    scroll () {
      if (this.fetching || !this.working) {
        return
      }

      let
        containerHeight = Utils.dom.height(this.scrollContainer),
        containerBottom = Utils.dom.offset(this.scrollContainer).top + containerHeight,
        triggerPosition = Utils.dom.offset(this.element).top + Utils.dom.height(this.element) - (this.offset || containerHeight)

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
          this.scroll()
        }
      })
    },
    reset () {
      this.index = 0
    },
    resume () {
      this.working = true
    },
    stop () {
      this.working = false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = Utils.debounce(this.scroll, 50)
      this.element = this.$refs.content

      this.scrollContainer = this.inline ? this.$el : this.element.closest('.layout-view')
      if (!this.scrollContainer) {
        this.scrollContainer = window
      }
      if (this.working) {
        this.scrollContainer.addEventListener('scroll', this.scroll)
      }

      this.scroll()
    })
  },
  beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.scroll)
  }
}
</script>
