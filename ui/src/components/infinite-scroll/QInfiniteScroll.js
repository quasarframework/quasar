import { h, ref, computed, watch, onMounted, onActivated, onDeactivated, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'

import { createComponent } from '../../utils/private/create.js'
import debounce from '../../utils/debounce.js'
import { height } from '../../utils/dom.js'
import { getScrollTarget, getScrollHeight, getVerticalScrollPosition, setVerticalScrollPosition } from '../../utils/scroll.js'
import { listenOpts } from '../../utils/event.js'
import { hSlot, hUniqueSlot } from '../../utils/private/render.js'

const { passive } = listenOpts

export default createComponent({
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
    const isFetching = ref(false)
    const isWorking = ref(true)
    const rootRef = ref(null)

    let index = props.initialIndex || 0
    let localScrollTarget, poll

    const classes = computed(() =>
      'q-infinite-scroll__loading'
      + (isFetching.value === true ? '' : ' invisible')
    )

    function immediatePoll () {
      if (props.disable === true || isFetching.value === true || isWorking.value === false) {
        return
      }

      const
        scrollHeight = getScrollHeight(localScrollTarget),
        scrollPosition = getVerticalScrollPosition(localScrollTarget),
        containerHeight = height(localScrollTarget)

      if (props.reverse === false) {
        if (Math.round(scrollPosition + containerHeight + props.offset) >= Math.round(scrollHeight)) {
          trigger()
        }
      }
      else if (Math.round(scrollPosition) <= props.offset) {
        trigger()
      }
    }

    function trigger () {
      if (props.disable === true || isFetching.value === true || isWorking.value === false) {
        return
      }

      index++
      isFetching.value = true

      const heightBefore = getScrollHeight(localScrollTarget)

      emit('load', index, isDone => {
        if (isWorking.value === true) {
          isFetching.value = false
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
      if (isWorking.value === false) {
        isWorking.value = true
        localScrollTarget.addEventListener('scroll', poll, passive)
      }

      immediatePoll()
    }

    function stop () {
      if (isWorking.value === true) {
        isWorking.value = false
        isFetching.value = false
        localScrollTarget.removeEventListener('scroll', poll, passive)
        poll !== void 0 && poll.cancel()
      }
    }

    function updateScrollTarget () {
      if (localScrollTarget && isWorking.value === true) {
        localScrollTarget.removeEventListener('scroll', poll, passive)
      }

      localScrollTarget = getScrollTarget(rootRef.value, props.scrollTarget)

      if (isWorking.value === true) {
        localScrollTarget.addEventListener('scroll', poll, passive)
      }
    }

    function setIndex (newIndex) {
      index = newIndex
    }

    // expose public methods
    const vm = getCurrentInstance()
    Object.assign(vm.proxy, {
      poll: () => { poll !== void 0 && poll() },
      trigger, stop, reset, resume, setIndex
    })

    function setDebounce (val) {
      val = parseInt(val, 10)

      const oldPoll = poll

      poll = val <= 0
        ? immediatePoll
        : debounce(immediatePoll, isNaN(val) === true ? 100 : val)

      if (localScrollTarget && isWorking.value === true) {
        if (oldPoll !== void 0) {
          localScrollTarget.removeEventListener('scroll', oldPoll, passive)
        }

        localScrollTarget.addEventListener('scroll', poll, passive)
      }
    }

    watch(() => props.disable, val => {
      if (val === true) { stop() }
      else { resume() }
    })

    watch(() => props.reverse, val => {
      if (isFetching.value === false && isWorking.value === true) {
        immediatePoll()
      }
    })

    watch(() => props.scrollTarget, updateScrollTarget)
    watch(() => props.debounce, setDebounce)

    let scrollPos = false

    onActivated(() => {
      if (scrollPos !== false && localScrollTarget) {
        setVerticalScrollPosition(localScrollTarget, scrollPos)
      }
    })

    onDeactivated(() => {
      scrollPos = localScrollTarget
        ? getVerticalScrollPosition(localScrollTarget)
        : false
    })

    onBeforeUnmount(() => {
      if (isWorking.value === true) {
        localScrollTarget.removeEventListener('scroll', poll, passive)
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

      if (props.disable !== true && isWorking.value === true) {
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
