import {
  computed,
  h,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch
} from 'vue'

import QList from '../item/QList.js'
import QMarkupTable from '../markup-table/QMarkupTable.js'
import getTableMiddle from '../table/get-table-middle.js'

import {
  useVirtualScroll,
  useVirtualScrollProps
} from './use-virtual-scroll.js'

import { createComponent } from '../../utils/private.create/create.js'
import { getScrollTarget, scrollTargetProp } from '../../utils/scroll/scroll.js'
import { listenOpts } from '../../utils/event/event.js'
import { hMergeSlot } from '../../utils/private.render/render.js'

const comps = {
  list: QList,
  table: QMarkupTable
}

const typeOptions = ['list', 'table', '__qtable']

export default createComponent({
  name: 'QVirtualScroll',

  props: {
    ...useVirtualScrollProps,

    type: {
      type: String,
      default: 'list',
      validator: v => typeOptions.includes(v)
    },

    items: {
      type: Array,
      default: () => []
    },

    itemsFn: Function,
    itemsSize: Number,

    scrollTarget: scrollTargetProp
  },

  setup(props, { slots, attrs }) {
    let localScrollTarget
    const rootRef = ref(null)

    const virtualScrollLength = computed(() =>
      props.itemsSize >= 0 && props.itemsFn !== void 0
        ? Number.parseInt(props.itemsSize, 10)
        : Array.isArray(props.items)
          ? props.items.length
          : 0
    )

    const {
      virtualScrollSliceRange,
      localResetVirtualScroll,
      padVirtualScroll,
      onVirtualScrollEvt
    } = useVirtualScroll({
      virtualScrollLength,
      getVirtualScrollTarget,
      getVirtualScrollEl
    })

    const virtualScrollScope = computed(() => {
      if (virtualScrollLength.value === 0) {
        return []
      }

      const mapFn = (item, i) => ({
        index: virtualScrollSliceRange.value.from + i,
        item
      })

      return props.itemsFn === void 0
        ? props.items
            .slice(
              virtualScrollSliceRange.value.from,
              virtualScrollSliceRange.value.to
            )
            .map(mapFn)
        : props
            .itemsFn(
              virtualScrollSliceRange.value.from,
              virtualScrollSliceRange.value.to -
                virtualScrollSliceRange.value.from
            )
            .map(mapFn)
    })

    const classes = computed(
      () =>
        'q-virtual-scroll q-virtual-scroll' +
        (props.virtualScrollHorizontal ? '--horizontal' : '--vertical') +
        (props.scrollTarget !== void 0 ? '' : ' scroll')
    )

    const attributes = computed(() =>
      props.scrollTarget !== void 0 ? {} : { tabindex: 0 }
    )

    watch(virtualScrollLength, () => {
      localResetVirtualScroll()
    })

    watch(
      () => props.scrollTarget,
      () => {
        unconfigureScrollTarget()
        configureScrollTarget()
      }
    )

    function getVirtualScrollEl() {
      // nothing gets rendered without the default scoped slot,
      // which leaves us without a root element
      const el = rootRef.value
      return el === null ? null : el.$el || el
    }

    function getVirtualScrollTarget() {
      return localScrollTarget
    }

    function configureScrollTarget() {
      const el = getVirtualScrollEl()
      if (el === null) return

      localScrollTarget = getScrollTarget(el, props.scrollTarget)
      localScrollTarget.addEventListener(
        'scroll',
        onVirtualScrollEvt,
        listenOpts.passive
      )
    }

    function unconfigureScrollTarget() {
      if (localScrollTarget !== void 0) {
        localScrollTarget.removeEventListener(
          'scroll',
          onVirtualScrollEvt,
          listenOpts.passive
        )
        localScrollTarget = void 0
      }
    }

    function __getVirtualChildren() {
      let child = padVirtualScroll(
        props.type === 'list' ? 'div' : 'tbody',
        virtualScrollScope.value.map(slots.default)
      )

      if (slots.before !== void 0) {
        // oxlint-disable-next-line unicorn/prefer-spread
        child = slots.before().concat(child)
      }

      return hMergeSlot(slots.after, child)
    }

    onBeforeMount(() => {
      localResetVirtualScroll()
    })

    onMounted(() => {
      configureScrollTarget()
    })

    onActivated(() => {
      configureScrollTarget()
    })

    onDeactivated(() => {
      unconfigureScrollTarget()
    })

    onBeforeUnmount(() => {
      unconfigureScrollTarget()
    })

    return () => {
      if (slots.default === void 0) {
        console.error(
          'QVirtualScroll: default scoped slot is required for rendering'
        )
        return
      }

      return props.type === '__qtable'
        ? getTableMiddle(
            { ref: rootRef, class: 'q-table__middle ' + classes.value },
            __getVirtualChildren()
          )
        : h(
            comps[props.type],
            {
              ...attrs,
              ref: rootRef,
              class: [attrs.class, classes.value],
              ...attributes.value
            },
            __getVirtualChildren
          )
    }
  }
})
