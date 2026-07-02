import {
  computed,
  getCurrentInstance,
  h,
  inject,
  onBeforeUnmount,
  ref,
  watch
} from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/platform/Platform.js'

import QResizeObserver from '../resize-observer/QResizeObserver.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot } from '../../utils/private.render/render.js'
import {
  emptyRenderFn,
  layoutKey
} from '../../utils/private.symbols/symbols.js'

function updateLocal(prop, val) {
  if (prop.value !== val) {
    prop.value = val
  }
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/layout/header-and-footer
 */
/**
 * Default slot in the devland unslotted content of the component; Suggestion: QToolbar
 *
 * @api slot default
 */
export default createComponent({
  name: 'QFooter',

  props: {
    /**
     * Model of the component defining if it is shown or hidden to the user; Either use this property (along with a listener for 'update:modelValue' event) OR use v-model directive
     *
     * @api prop model-value
     * @extends model-value
     * @default true
     * @syncable
     * @example # v-model="footerState"
     */
    modelValue: {
      type: Boolean,
      default: true
    },
    /**
     * Enable 'reveal' mode; Takes into account user scroll to temporarily show/hide footer
     *
     * @api prop reveal
     * @type {Boolean}
     * @category behavior
     */
    reveal: Boolean,
    /**
     * @api prop bordered
     * @extends bordered
     */
    bordered: Boolean,
    /**
     * Adds a default shadow to the footer
     *
     * @api prop elevated
     * @type {Boolean}
     * @category style
     */
    elevated: Boolean,

    /**
     * When using SSR, you can optionally hint of the height (in pixels) of the QFooter
     *
     * @api prop height-hint
     * @type {Number|String}
     * @default 50
     * @category behavior
     */
    heightHint: {
      type: [String, Number],
      default: 50
    }
  },

  emits: ['reveal', 'focusin'],

  setup(props, { slots, emit }) {
    const {
      proxy: { $q }
    } = getCurrentInstance()

    const $layout = inject(layoutKey, emptyRenderFn)
    if ($layout === emptyRenderFn) {
      console.error('QFooter needs to be child of QLayout')
      return emptyRenderFn
    }

    const size = ref(Number.parseInt(props.heightHint, 10))
    const revealed = ref(true)
    const windowHeight = ref(
      isRuntimeSsrPreHydration.value || $layout.isContainer.value
        ? 0
        : window.innerHeight
    )

    const fixed = computed(
      () =>
        props.reveal ||
        $layout.view.value.includes('F') ||
        ($q.platform.is.ios && $layout.isContainer.value)
    )

    const containerHeight = computed(() =>
      $layout.isContainer.value
        ? $layout.containerHeight.value
        : windowHeight.value
    )

    const offset = computed(() => {
      if (!props.modelValue) return 0
      if (fixed.value) return revealed.value ? size.value : 0

      const localOffset =
        $layout.scroll.value.position +
        containerHeight.value +
        size.value -
        $layout.height.value

      return Math.max(localOffset, 0)
    })

    const hidden = computed(
      () => !props.modelValue || (fixed.value && !revealed.value)
    )

    const revealOnFocus = computed(
      () => props.modelValue && hidden.value && props.reveal
    )

    const classes = computed(
      () =>
        'q-footer q-layout__section--marginal ' +
        (fixed.value ? 'fixed' : 'absolute') +
        '-bottom' +
        (props.bordered ? ' q-footer--bordered' : '') +
        (hidden.value ? ' q-footer--hidden' : '') +
        (props.modelValue
          ? ''
          : ' q-layout--prevent-focus' + (fixed.value ? '' : ' hidden'))
    )

    const style = computed(() => {
      const view = $layout.rows.value.bottom,
        css = {}

      if (view[0] === 'l' && $layout.left.space) {
        css[$q.lang.rtl ? 'right' : 'left'] = `${$layout.left.size}px`
      }
      if (view[2] === 'r' && $layout.right.space) {
        css[$q.lang.rtl ? 'left' : 'right'] = `${$layout.right.size}px`
      }

      return css
    })

    function updateLayout(prop, val) {
      $layout.update('footer', prop, val)
    }

    function onResize({ height }) {
      updateLocal(size, height)
      updateLayout('size', height)
    }

    function updateRevealed() {
      if (!props.reveal) return

      const { direction, position, inflectionPoint } = $layout.scroll.value

      updateLocal(
        revealed,
        direction === 'up' ||
          position - inflectionPoint < 100 ||
          $layout.height.value - containerHeight.value - position - size.value <
            300
      )
    }

    function onFocusin(evt) {
      if (revealOnFocus.value) updateLocal(revealed, true)
      emit('focusin', evt)
    }

    watch(
      () => props.modelValue,
      val => {
        updateLayout('space', val)
        updateLocal(revealed, true)
        $layout.animate()
      }
    )

    watch(offset, val => {
      updateLayout('offset', val)
    })

    watch(
      () => props.reveal,
      val => {
        if (!val) updateLocal(revealed, props.modelValue)
      }
    )

    watch(revealed, val => {
      $layout.animate()
      emit('reveal', val)
    })

    watch([size, $layout.scroll, $layout.height], updateRevealed)

    watch(
      () => $q.screen.height,
      val => {
        if (!$layout.isContainer.value) updateLocal(windowHeight, val)
      }
    )

    const instance = {}

    $layout.instances.footer = instance
    if (props.modelValue) updateLayout('size', size.value)
    updateLayout('space', props.modelValue)
    updateLayout('offset', offset.value)

    onBeforeUnmount(() => {
      if ($layout.instances.footer === instance) {
        $layout.instances.footer = void 0
        updateLayout('size', 0)
        updateLayout('offset', 0)
        updateLayout('space', false)
      }
    })

    return () => {
      const child = hMergeSlot(slots.default, [
        h(QResizeObserver, {
          debounce: 0,
          onResize
        })
      ])

      if (props.elevated) {
        child.push(
          h('div', {
            class:
              'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
          })
        )
      }

      return h(
        'footer',
        {
          class: classes.value,
          style: style.value,
          onFocusin
        },
        child
      )
    }
  }
})
