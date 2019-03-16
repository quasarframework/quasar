import Vue from 'vue'

import debounce from '../../utils/debounce.js'
import { height } from '../../utils/dom.js'
import { getScrollTarget, getScrollHeight, getScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import slot from '../../utils/slot.js'

export default Vue.extend({
  name: 'QInfiniteScroll',

  props: {
    offset: {
      type: Number,
      default: 500
    },
    scrollTarget: {},
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
    },

    scrollTarget () {
      this.updateScrollTarget()
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

      if (typeof this.scrollTarget === 'string') {
        this.scrollContainer = document.querySelector(this.scrollTarget)
        if (this.scrollContainer === null) {
          console.error(`InfiniteScroll: scroll target container "${this.scrollTarget}" not found`, this)
          return
        }
      }
      else {
        this.scrollContainer = this.scrollTarget instanceof Element ? this.scrollTarget : getScrollTarget(this.$el)
      }

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
    const content = this.$scopedSlots.default !== void 0
      ? this.$scopedSlots.default()
      : []

    return h('div', { staticClass: 'q-infinite-scroll' }, content.concat([
      this.fetching
        ? h('div', { staticClass: 'q-infinite-scroll__loading' }, slot(this, 'loading'))
        : null
    ]))
  }
})
