import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import debounce from '../../utils/debounce.js'
import { height } from '../../utils/dom.js'
import { getScrollTarget, getScrollHeight, getScrollPosition, setScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import { slot, uniqueSlot } from '../../utils/slot.js'

export default Vue.extend({
  name: 'QInfiniteScroll',

  mixins: [ ListenersMixin ],

  props: {
    offset: {
      type: Number,
      default: 500
    },

    debounce: {
      type: [ String, Number ],
      default: 100
    },

    scrollTarget: {
      default: void 0
    },

    initialIndex: Number,

    disable: Boolean,
    reverse: Boolean
  },

  data () {
    return {
      index: this.initialIndex || 0,
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
        scrollHeight = getScrollHeight(this.__scrollTarget),
        scrollPosition = getScrollPosition(this.__scrollTarget),
        containerHeight = height(this.__scrollTarget)

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

      const heightBefore = getScrollHeight(this.__scrollTarget)

      this.$emit('load', this.index, stop => {
        if (this.working === true) {
          this.fetching = false
          this.$nextTick(() => {
            if (this.reverse === true) {
              const
                heightAfter = getScrollHeight(this.__scrollTarget),
                scrollPosition = getScrollPosition(this.__scrollTarget),
                heightDifference = heightAfter - heightBefore

              setScrollPosition(this.__scrollTarget, scrollPosition + heightDifference)
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
        this.__scrollTarget.addEventListener('scroll', this.poll, listenOpts.passive)
      }
      this.immediatePoll()
    },

    stop () {
      if (this.working === true) {
        this.working = false
        this.fetching = false
        this.__scrollTarget.removeEventListener('scroll', this.poll, listenOpts.passive)
      }
    },

    updateScrollTarget () {
      if (this.__scrollTarget && this.working === true) {
        this.__scrollTarget.removeEventListener('scroll', this.poll, listenOpts.passive)
      }

      this.__scrollTarget = getScrollTarget(this.$el, this.scrollTarget)

      if (this.working === true) {
        this.__scrollTarget.addEventListener('scroll', this.poll, listenOpts.passive)
      }
    },

    setIndex (index) {
      this.index = index
    },

    __setDebounce (val) {
      val = parseInt(val, 10)

      const oldPoll = this.poll

      this.poll = val <= 0
        ? this.immediatePoll
        : debounce(this.immediatePoll, isNaN(val) === true ? 100 : val)

      if (this.__scrollTarget && this.working === true) {
        if (oldPoll !== void 0) {
          this.__scrollTarget.removeEventListener('scroll', oldPoll, listenOpts.passive)
        }

        this.__scrollTarget.addEventListener('scroll', this.poll, listenOpts.passive)
      }
    }
  },

  mounted () {
    this.immediatePoll = this.poll
    this.__setDebounce(this.debounce)

    this.updateScrollTarget()

    if (this.reverse === true) {
      const
        scrollHeight = getScrollHeight(this.__scrollTarget),
        containerHeight = height(this.__scrollTarget)

      setScrollPosition(this.__scrollTarget, scrollHeight - containerHeight)
    }

    this.immediatePoll()
  },

  beforeDestroy () {
    if (this.working === true) {
      this.__scrollTarget.removeEventListener('scroll', this.poll, listenOpts.passive)
    }
  },

  render (h) {
    const child = uniqueSlot(this, 'default', [])

    if (this.disable !== true && this.working === true) {
      child[this.reverse === false ? 'push' : 'unshift'](
        h('div', {
          staticClass: 'q-infinite-scroll__loading',
          class: this.fetching === true ? '' : 'invisible'
        }, slot(this, 'loading'))
      )
    }

    return h('div', {
      staticClass: 'q-infinite-scroll',
      on: { ...this.qListeners }
    }, child)
  }
})
