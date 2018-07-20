import { height, offset } from '../../utils/dom.js'
import debounce from '../../utils/debounce.js'
import { getScrollTarget } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'

export default {
  name: 'QInfiniteScroll',
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
      this.scrollContainer.addEventListener('scroll', this.poll, listenOpts.passive)
      this.immediatePoll()
    },
    stop () {
      this.working = false
      this.fetching = false
      this.scrollContainer.removeEventListener('scroll', this.poll, listenOpts.passive)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.element = this.$refs.content

      this.scrollContainer = this.inline ? this.$el : getScrollTarget(this.$el)
      if (this.working) {
        this.scrollContainer.addEventListener('scroll', this.poll, listenOpts.passive)
      }

      this.poll()
      this.immediatePoll = this.poll
      this.poll = debounce(this.poll, 50)
    })
  },
  beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.poll, listenOpts.passive)
  },
  render (h) {
    return h('div', { staticClass: 'q-infinite-scroll' }, [
      h('div', {
        ref: 'content',
        staticClass: 'q-infinite-scroll-content'
      }, this.$slots.default),

      this.fetching
        ? h('div', { staticClass: 'q-infinite-scroll-message' }, this.$slots.message)
        : null
    ])
  }
}
