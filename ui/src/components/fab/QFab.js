import { h, defineComponent, ref, computed, provide, getCurrentInstance } from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import useFab, { useFabProps } from './use-fab.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private/use-model-toggle.js'

import { hSlot, hMergeSlot } from '../../utils/private/render.js'
import { fabKey } from '../../utils/private/symbols.js'

const directions = [ 'up', 'right', 'down', 'left' ]
const alignValues = [ 'left', 'center', 'right' ]

export default defineComponent({
  name: 'QFab',

  props: {
    ...useFabProps,
    ...useModelToggleProps,

    icon: String,
    activeIcon: String,

    hideIcon: Boolean,
    hideLabel: {
      default: null
    },

    direction: {
      type: String,
      default: 'right',
      validator: v => directions.includes(v)
    },

    persistent: Boolean,

    verticalActionsAlign: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    }
  },

  emits: useModelToggleEmits,

  setup (props, { slots }) {
    const triggerRef = ref(null)
    const showing = ref(props.modelValue === true)

    const { proxy: { $q } } = getCurrentInstance()
    const { formClass, labelProps } = useFab(props, showing)

    const hideOnRouteChange = computed(() => props.persistent !== true)

    const { hide, toggle } = useModelToggle({
      showing,
      hideOnRouteChange
    })

    const classes = computed(() =>
      'q-fab z-fab row inline justify-center'
      + ` q-fab--align-${ props.verticalActionsAlign } ${ formClass.value }`
      + (showing.value === true ? ' q-fab--opened' : '')
    )

    const actionClass = computed(() =>
      'q-fab__actions flex no-wrap inline'
      + ` q-fab__actions--${ props.direction }`
    )

    function getTriggerContent () {
      const child = []

      props.hideIcon !== true && child.push(
        h('div', { class: 'q-fab__icon-holder' }, [
          h(QIcon, {
            class: 'q-fab__icon absolute-full',
            name: props.icon || $q.iconSet.fab.icon
          }),

          h(QIcon, {
            class: 'q-fab__active-icon absolute-full',
            name: props.activeIcon || $q.iconSet.fab.activeIcon
          })
        ])
      )

      props.label !== '' && child[ labelProps.value.action ](
        h('div', labelProps.value.data, [ props.label ])
      )

      return hMergeSlot(slots.tooltip, child)
    }

    provide(fabKey, {
      showing,

      onChildClick (evt) {
        hide(evt)

        if (triggerRef.value !== null) {
          triggerRef.value.$el.focus()
        }
      }
    })

    return () => h('div', {
      class: classes.value
    }, [
      h(QBtn, {
        ref: triggerRef,
        class: formClass.value,
        ...props,
        noWrap: true,
        stack: props.stacked,
        align: void 0,
        icon: void 0,
        label: void 0,
        noCaps: true,
        fab: true,
        'aria-expanded': showing.value === true ? 'true' : 'false',
        'aria-haspopup': 'true',
        onClick: toggle
      }, getTriggerContent),

      h('div', { class: actionClass.value }, hSlot(slots.default))
    ])
  }
})
