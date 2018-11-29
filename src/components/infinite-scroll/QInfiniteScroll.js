import Vue from 'vue'

import debounce from '../../utils/debounce.js'
import { height } from '../../utils/dom.js'
import { getScrollTarget, getScrollHeight, getScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'

export default Vue.extend({
  name: 'QInfiniteScroll',

  props: {
    offset: {
      type: Number,
      default: 500
    },
    disable: Boolean
  },

  data () {
    return {
      index: 0,
      fetching: false,
      working: true
    }
  },

  watch: {
    disable (val) {
      if (val === true) {
        this.stop()
      }
      else {
        this.resume()
      }
    }
  },

  methods: {
    poll () {
      if (this.disable === true || this.fetching === true || this.working === false) {
        return
      }

      const
        scrollHeight = getScrollHeight(this.scrollContainer),
        scrollPosition = getScrollPosition(this.scrollContainer),
        containerHeight = height(this.scrollContainer)

      if (scrollPosition + containerHeight + this.offset >= scrollHeight) {
        this.trigger()
      }
    },

    trigger () {
      if (this.disable === true || this.fetching === true || this.working === false) {
        return
      }

      this.index++
      this.fetching = true
      this.$emit('load', this.index, () => {
        if (this.working === true) {
          this.fetching = false
          this.$nextTick(() => {
            this.$el.closest('body') && this.poll()
          })
        }
      })
    },

    reset () {
      this.index = 0
    },

    resume () {
      if (this.working === false) {
        this.working = true
        this.scrollContainer.addEventListener('scroll', this.poll, listenOpts.passive)
      }
      this.immediatePoll()
    },

    stop () {
      if (this.working === true) {
        this.working = false
        this.fetching = false
        this.scrollContainer.removeEventListener('scroll', this.poll, listenOpts.passive)
      }
    },

    updateScrollTarget () {
      if (this.scrollContainer && this.working === true) {
        this.scrollContainer.removeEventListener('scroll', this.poll, listenOpts.passive)
      }

      this.scrollContainer = getScrollTarget(this.$el)

      if (this.working === true) {
        this.scrollContainer.addEventListener('scroll', this.poll, listenOpts.passive)
      }
    }
  },

  mounted () {
    this.immediatePoll = this.poll
    this.poll = debounce(this.poll, 100)

    this.updateScrollTarget()
    this.immediatePoll()
  },

  beforeDestroy () {
    if (this.working === true) {
      this.scrollContainer.removeEventListener('scroll', this.poll, listenOpts.passive)
    }
  },

  render (h) {
    return h('div', { staticClass: 'q-infinite-scroll' }, this.$slots.default.concat([
      this.fetching
        ? h('div', { staticClass: 'q-infinite-scroll__message' }, this.$slots.message)
        : null
    ]))
  }
})
