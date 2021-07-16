import { h, defineComponent, ref, computed, watch, onBeforeUnmount, inject, getCurrentInstance } from 'vue'

import QResizeObserver from '../resize-observer/QResizeObserver.js'

import { hUniqueSlot } from '../../utils/private/render.js'
import { layoutKey } from '../../utils/private/symbols.js'

export default defineComponent({
  name: 'QHeader',

  props: {
    modelValue: {
      type: Boolean,
      default: true
    },
    reveal: Boolean,
    revealOffset: {
      type: Number,
      default: 250
    },
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

    const $layout = inject(layoutKey, () => {
      console.error('QHeader needs to be child of QLayout')
    })

    const size = ref(parseInt(props.heightHint, 10))
    const revealed = ref(true)

    const fixed = computed(() =>
      props.reveal === true
      || $layout.view.value.indexOf('H') > -1
      || $layout.isContainer.value === true
    )

    const offset = computed(() => {
      if (props.modelValue !== true) {
        return 0
      }
      if (fixed.value === true) {
        return revealed.value === true ? size.value : 0
      }
      const offset = size.value - $layout.scroll.value.position
      return offset > 0 ? offset : 0
    })

    const hidden = computed(() => props.modelValue !== true
      || (fixed.value === true && revealed.value !== true)
    )

    const revealOnFocus = computed(() =>
      props.modelValue === true && hidden.value === true && props.reveal === true
    )

    const classes = computed(() =>
      'q-header q-layout__section--marginal '
      + (fixed.value === true ? 'fixed' : 'absolute') + '-top'
      + (props.bordered === true ? ' q-header--bordered' : '')
      + (hidden.value === true ? ' q-header--hidden' : '')
      + (props.modelValue !== true ? ' q-layout--prevent-focus' : '')
    )

    const style = computed(() => {
      const
        view = $layout.rows.value.top,
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
      $layout.update('header', prop, val)
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

    watch($layout.scroll, scroll => {
      props.reveal === true && updateLocal(revealed,
        scroll.direction === 'up'
        || scroll.position <= props.revealOffset
        || scroll.position - scroll.inflectionPoint < 100
      )
    })

    const instance = {}

    $layout.instances.header = instance
    props.modelValue === true && updateLayout('size', size.value)
    updateLayout('space', props.modelValue)
    updateLayout('offset', offset.value)

    onBeforeUnmount(() => {
      if ($layout.instances.header === instance) {
        $layout.instances.header = void 0
        updateLayout('size', 0)
        updateLayout('offset', 0)
        updateLayout('space', false)
      }
    })

    return () => {
      const child = hUniqueSlot(slots.default, [])

      props.elevated === true && child.push(
        h('div', {
          class: 'q-layout__shadow absolute-full overflow-hidden no-pointer-events'
        })
      )

      child.push(
        h(QResizeObserver, {
          debounce: 0,
          onResize
        })
      )

      return h('header', {
        class: classes.value,
        style: style.value,
        onFocusin
      }, child)
    }
  }
})
