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
    debounce: {
      type: [String, Number],
      default: 100
    },
    scrollTarget: {},
    disable: Boolean,
    reverse: Boolean
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
    },

    debounce (val) {
      this.__setDebounce(val)
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

      if (this.reverse === false) {
        if (scrollPosition + containerHeight + this.offset >= scrollHeight) {
          this.trigger()
        }
      }
      else {
        if (scrollPosition < this.offset) {
          this.trigger()
        }
      }
    },

    trigger () {
      if (this.disable === true || this.fetching === true || this.working === false) {
        return
      }

      this.index++
      this.fetching = true

      const heightBefore = getScrollHeight(this.scrollContainer)

      this.$emit('load', this.index, stop => {
        if (this.working === true) {
          this.fetching = false
          this.$nextTick(() => {
            if (this.reverse === true) {
              const
                heightAfter = getScrollHeight(this.scrollContainer),
                scrollPosition = getScrollPosition(this.scrollContainer),
                heightDifference = heightAfter - heightBefore

              this.scrollContainer.scrollTop = scrollPosition + heightDifference
            }

            if (stop === true) {
              this.stop()
            }
            else {
              this.$el.closest('body') && this.poll()
            }
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
        this.scrollContainer = this.scrollTarget === document.defaultView || this.scrollTarget instanceof Element
          ? this.scrollTarget
          : getScrollTarget(this.$el)
      }

      if (this.working === true) {
        this.scrollContainer.addEventListener('scroll', this.poll, listenOpts.passive)
      }
    },

    __setDebounce (val) {
      val = parseInt(val, 10)
      if (val <= 0) {
        this.poll = this.immediatePoll
      }
      else {
        this.poll = debounce(this.immediatePoll, isNaN(val) === true ? 100 : val)
      }
    }
  },

  mounted () {
    this.immediatePoll = this.poll
    this.__setDebounce(this.debounce)

    this.updateScrollTarget()
    this.immediatePoll()

    if (this.reverse === true) {
      const
        scrollHeight = getScrollHeight(this.scrollContainer),
        containerHeight = height(this.scrollContainer)

      this.scrollContainer.scrollTop = scrollHeight - containerHeight
    }
  },

  beforeDestroy () {
    if (this.working === true) {
      this.scrollContainer.removeEventListener('scroll', this.poll, listenOpts.passive)
    }
  },

  render (h) {
    const content = slot(this, 'default')
    const body = [
      h('div', {
        staticClass: 'q-infinite-scroll__loading',
        class: this.fetching === true ? '' : 'invisible'
      }, slot(this, 'loading'))
    ]

    return h(
      'div',
      { staticClass: 'q-infinite-scroll' },
      this.reverse === false
        ? content.concat(body)
        : body.concat(content)
    )
  }
})
