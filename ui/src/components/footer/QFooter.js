import { h, ref, computed, watch, onBeforeUnmount, inject, getCurrentInstance } from 'vue'

import { isRuntimeSsrPreHydration } from '../../plugins/Platform.js'

import QResizeObserver from '../resize-observer/QResizeObserver.js'

import { createComponent } from '../../utils/private/create.js'
import { hMergeSlot } from '../../utils/private/render.js'
import { layoutKey, emptyRenderFn } from '../../utils/private/symbols.js'

export default createComponent({
  name: 'QFooter',

  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    bordered: Boolean,
    elevated: Boolean,

    heightHint: {
      type: [ String, Number ],
      default: 50
    }
  },

  emits: [ 'reveal', 'focusin' ],

  setup (props, { slots, emit }) {
    const { proxy: { $q } } = getCurrentInstance()

    const $layout = inject(layoutKey, emptyRenderFn)
    if ($layout === emptyRenderFn) {
      console.error('QFooter needs to be child of QLayout')
      return emptyRenderFn
    }

    const size = ref(parseInt(props.heightHint, 10))
    const revealed = ref(true)
    const windowHeight = ref(
      isRuntimeSsrPreHydration.value === true || $layout.isContainer.value === true
        ? 0
        : window.innerHeight
    )

    const fixed = computed(() =>
      props.reveal === true
      || $layout.view.value.indexOf('F') > -1
      || ($q.platform.is.ios && $layout.isContainer.value === true)
    )

    const containerHeight = computed(() => (
      $layout.isContainer.value === true
        ? $layout.containerHeight.value
        : windowHeight.value
    ))

    const offset = computed(() => {
      if (props.modelValue !== true) {
        return 0
      }
      if (fixed.value === true) {
        return revealed.value === true ? size.value : 0
      }
      const offset = $layout.scroll.value.position + containerHeight.value + size.value - $layout.height.value
      return offset > 0 ? offset : 0
    })

    const hidden = computed(() =>
      props.modelValue !== true || (fixed.value === true && revealed.value !== true)
    )

    const revealOnFocus = computed(() =>
      props.modelValue === true && hidden.value === true && props.reveal === true
    )

    const classes = computed(() =>
      'q-footer q-layout__section--marginal '
      + (fixed.value === true ? 'fixed' : 'absolute') + '-bottom'
      + (props.bordered === true ? ' q-footer--bordered' : '')
      + (hidden.value === true ? ' q-footer--hidden' : '')
      + (
        props.modelValue !== true
          ? ' q-layout--prevent-focus' + (fixed.value !== true ? ' hidden' : '')
          : ''
      )
    )

    const style = computed(() => {
      const
        view = $layout.rows.value.bottom,
        css = {}

      if (view[ 0 ] === 'l' && $layout.left.space === true) {
        css[ $q.lang.rtl === true ? 'right' : 'left' ] = `${ $layout.left.size }px`
      }
      if (view[ 2 ] === 'r' && $layout.right.space === true) {
        css[ $q.lang.rtl === true ? 'left' : 'right' ] = `${ $layout.right.size }px`
      }

      return css
    })

    function updateLayout (prop, val) {
      $layout.update('footer', prop, val)
    }

    function updateLocal (prop, val) {
      if (prop.value !== val) {
        prop.value = val
      }
    }

    function onResize ({ height }) {
      updateLocal(size, height)
      updateLayout('size', height)
    }

    function updateRevealed () {
      if (props.reveal !== true) { return }

      const { direction, position, inflectionPoint } = $layout.scroll.value

      updateLocal(revealed, (
        direction === 'up'
        || position - inflectionPoint < 100
        || $layout.height.value - containerHeight.value - position - size.value < 300
      ))
    }

    function onFocusin (evt) {
      if (revealOnFocus.value === true) {
        updateLocal(revealed, true)
      }

      emit('focusin', evt)
    }

    watch(() => props.modelValue, val => {
      updateLayout('space', val)
      updateLocal(revealed, true)
      $layout.animate()
    })

    watch(offset, val => {
      updateLayout('offset', val)
    })

    watch(() => props.reveal, val => {
      val === false && updateLocal(revealed, props.modelValue)
    })

    watch(revealed, val => {
      $layout.animate()
      emit('reveal', val)
    })

    watch([ size, $layout.scroll, $layout.height ], updateRevealed)

    watch(() => $q.screen.height, val => {
      $layout.isContainer.value !== true && updateLocal(windowHeight, val)
    })

    const instance = {}

    $layout.instances.footer = instance
    props.modelValue === true && updateLayout('size', size.value)
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

      props.elevated === true && child.push(
        h('div', {
          class: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
      )

      return h('footer', {
        class: classes.value,
        style: style.value,
        onFocusin
      }, child)
    }
  }
})
