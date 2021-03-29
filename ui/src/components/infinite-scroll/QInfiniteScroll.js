import { h, defineComponent, ref, computed, watch, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'

import debounce from '../../utils/debounce.js'
import { height } from '../../utils/dom.js'
import { getScrollTarget, getScrollHeight, getVerticalScrollPosition, setVerticalScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import { hSlot, hUniqueSlot } from '../../utils/private/render.js'

export default defineComponent({
  name: 'QInfiniteScroll',

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

  emits: [ 'load' ],

  setup (props, { slots, emit }) {
    const fetching = ref(false)
    const rootRef = ref(null)

    let index = props.initialIndex || 0
    let isWorking = true
    let localScrollTarget, poll

    const classes = computed(() =>
      'q-infinite-scroll__loading'
      + (fetching.value === true ? '' : ' invisible')
    )

    function immediatePoll () {
      if (props.disable === true || fetching.value === true || isWorking === false) {
        return
      }

      const
        scrollHeight = getScrollHeight(localScrollTarget),
        scrollPosition = getVerticalScrollPosition(localScrollTarget),
        containerHeight = height(localScrollTarget)

      if (props.reverse === false) {
        if (scrollPosition + containerHeight + props.offset >= scrollHeight) {
          trigger()
        }
      }
      else {
        if (scrollPosition < props.offset) {
          trigger()
        }
      }
    }

    function trigger () {
      if (props.disable === true || fetching.value === true || isWorking === false) {
        return
      }

      index++
      fetching.value = true

      const heightBefore = getScrollHeight(localScrollTarget)

      emit('load', index, isDone => {
        if (isWorking === true) {
          fetching.value = false
          nextTick(() => {
            if (props.reverse === true) {
              const
                heightAfter = getScrollHeight(localScrollTarget),
                scrollPosition = getVerticalScrollPosition(localScrollTarget),
                heightDifference = heightAfter - heightBefore

              setVerticalScrollPosition(localScrollTarget, scrollPosition + heightDifference)
            }

            if (isDone === true) {
              stop()
            }
            else if (rootRef.value) {
              rootRef.value.closest('body') && poll()
            }
          })
        }
      })
    }

    function reset () {
      index = 0
    }

    function resume () {
      if (isWorking === false) {
        isWorking = true
        localScrollTarget.addEventListener('scroll', poll, listenOpts.passive)
      }

      immediatePoll()
    }

    function stop () {
      if (isWorking === true) {
        isWorking = false
        fetching.value = false
        localScrollTarget.removeEventListener('scroll', poll, listenOpts.passive)
      }
    }

    function updateScrollTarget () {
      if (localScrollTarget && isWorking === true) {
        localScrollTarget.removeEventListener('scroll', poll, listenOpts.passive)
      }

      localScrollTarget = getScrollTarget(rootRef.value, props.scrollTarget)

      if (isWorking === true) {
        localScrollTarget.addEventListener('scroll', poll, listenOpts.passive)
      }
    }

    function setIndex (newIndex) {
      index = newIndex
    }

    // expose public methods
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, {
      poll: () => poll.apply(null, arguments),
      trigger, stop, reset, resume, setIndex
    })

    function setDebounce (val) {
      val = parseInt(val, 10)

      const oldPoll = poll

      poll = val <= 0
        ? immediatePoll
        : debounce(immediatePoll, isNaN(val) === true ? 100 : val)

      if (localScrollTarget && isWorking === true) {
        if (oldPoll !== void 0) {
          localScrollTarget.removeEventListener('scroll', oldPoll, listenOpts.passive)
        }

        localScrollTarget.addEventListener('scroll', poll, listenOpts.passive)
      }
    }

    watch(() => props.disable, val => {
      if (val === true) {
        stop()
      }
      else {
        resume()
      }
    })

    watch(() => props.scrollTarget, updateScrollTarget)
    watch(() => props.debounce, setDebounce)

    onBeforeUnmount(() => {
      if (isWorking === true) {
        localScrollTarget.removeEventListener('scroll', poll, listenOpts.passive)
      }
    })

    onMounted(() => {
      setDebounce(props.debounce)

      updateScrollTarget()

      if (props.reverse === true) {
        const
          scrollHeight = getScrollHeight(localScrollTarget),
          containerHeight = height(localScrollTarget)

        setVerticalScrollPosition(localScrollTarget, scrollHeight - containerHeight)
      }

      immediatePoll()
    })

    return () => {
      const child = hUniqueSlot(slots.default, [])

      if (props.disable !== true && isWorking === true) {
        child[ props.reverse === false ? 'push' : 'unshift' ](
          h('div', { class: classes.value }, hSlot(slots.loading))
        )
      }

      return h('div', {
        class: 'q-infinite-scroll',
        ref: rootRef
      }, child)
    }
  }
})
