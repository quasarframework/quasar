import Vue from 'vue'

import ListenersMixin from '../../mixins/listeners.js'

import debounce from '../../utils/debounce.js'
import { height } from '../../utils/dom.js'
import { getScrollTarget, getScrollHeight, getScrollPosition, setScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import { slot, uniqueSlot } from '../../utils/slot.js'

const { passive } = listenOpts

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
      isFetching: false,
      isWorking: true
    }
  },

  watch: {
    disable (val) {
      if (val === true) { this.stop() }
      else { this.resume() }
    },

    reverse () {
      if (this.isFetching === false && this.isWorking === true) {
        this.immediatePoll()
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
      if (this.disable === true || this.isFetching === true || this.isWorking === false) {
        return
      }

      const
        scrollHeight = getScrollHeight(this.__scrollTarget),
        scrollPosition = getScrollPosition(this.__scrollTarget),
        containerHeight = height(this.__scrollTarget)

      if (this.reverse === false) {
        if (Math.round(scrollPosition + containerHeight + this.offset) >= Math.round(scrollHeight)) {
          this.trigger()
        }
      }
      else if (Math.round(scrollPosition) < this.offset) {
        this.trigger()
      }
    },

    trigger () {
      if (this.disable === true || this.isFetching === true || this.isWorking === false) {
        return
      }

      this.index++
      this.isFetching = true

      const heightBefore = getScrollHeight(this.__scrollTarget)

      this.$emit('load', this.index, stop => {
        if (this.isWorking === true) {
          this.isFetching = false
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
      if (this.isWorking === false) {
        this.isWorking = true
        this.__scrollTarget.addEventListener('scroll', this.poll, passive)
      }
      this.immediatePoll()
    },

    stop () {
      if (this.isWorking === true) {
        this.isWorking = false
        this.isFetching = false
        this.__scrollTarget.removeEventListener('scroll', this.poll, passive)
        typeof this.poll.cancel === 'function' && this.poll.cancel()
      }
    },

    updateScrollTarget () {
      if (this.__scrollTarget && this.isWorking === true) {
        this.__scrollTarget.removeEventListener('scroll', this.poll, passive)
      }

      this.__scrollTarget = getScrollTarget(this.$el, this.scrollTarget)

      if (this.isWorking === true) {
        this.__scrollTarget.addEventListener('scroll', this.poll, passive)

        if (this.reverse === true) {
          const
            scrollHeight = getScrollHeight(this.__scrollTarget),
            containerHeight = height(this.__scrollTarget)

          setScrollPosition(this.__scrollTarget, scrollHeight - containerHeight)
        }

        this.immediatePoll()
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

      if (this.__scrollTarget && this.isWorking === true) {
        if (oldPoll !== void 0) {
          this.__scrollTarget.removeEventListener('scroll', oldPoll, passive)
        }

        this.__scrollTarget.addEventListener('scroll', this.poll, passive)
      }
    }
  },

  mounted () {
    this.immediatePoll = this.poll
    this.__setDebounce(this.debounce)

    this.updateScrollTarget()
  },

  activated () {
    if (this.__scrollPosition !== void 0 && this.__scrollTarget) {
      setScrollPosition(this.__scrollTarget, this.__scrollPosition)
    }
  },

  deactivated () {
    this.__scrollPosition = this.__scrollTarget
      ? getScrollPosition(this.__scrollTarget)
      : void 0
  },

  beforeDestroy () {
    this.stop()
  },

  render (h) {
    const child = uniqueSlot(this, 'default', [])

    if (this.disable !== true && this.isWorking === true) {
      child[this.reverse === false ? 'push' : 'unshift'](
        h('div', {
          staticClass: 'q-infinite-scroll__loading',
          class: this.isFetching === true ? '' : 'invisible'
        }, slot(this, 'loading'))
      )
    }

    return h('div', {
      staticClass: 'q-infinite-scroll',
      on: { ...this.qListeners }
    }, child)
  }
})
