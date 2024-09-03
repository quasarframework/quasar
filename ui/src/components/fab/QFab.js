import { h, ref, computed, provide, getCurrentInstance } from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import useFab, { useFabProps } from './use-fab.js'
import useId from '../../composables/use-id/use-id.js'
import useModelToggle, { useModelToggleProps, useModelToggleEmits } from '../../composables/private.use-model-toggle/use-model-toggle.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hSlot, hMergeSlot } from '../../utils/private.render/render.js'
import { fabKey } from '../../utils/private.symbols/symbols.js'

const directions = [ 'up', 'right', 'down', 'left' ]
const alignValues = [ 'left', 'center', 'right' ]

export default createComponent({
  name: 'QFab',

  props: {
    ...useFabProps,
    ...useModelToggleProps,

    icon: String,
    activeIcon: String,

    hideIcon: Boolean,
    hideLabel: {
      ...useFabProps.hideLabel,
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
    const targetUid = useId()

    const { proxy: { $q } } = getCurrentInstance()
    const { formClass, labelProps } = useFab(props, showing)

    const hideOnRouteChange = computed(() => props.persistent !== true)

    const { hide, toggle } = useModelToggle({
      showing,
      hideOnRouteChange
    })

    const slotScope = computed(() => ({ opened: showing.value }))

    const classes = computed(() =>
      'q-fab z-fab row inline justify-center'
      + ` q-fab--align-${ props.verticalActionsAlign } ${ formClass.value }`
      + (showing.value === true ? ' q-fab--opened' : ' q-fab--closed')
    )

    const actionClass = computed(() =>
      'q-fab__actions flex no-wrap inline'
      + ` q-fab__actions--${ props.direction }`
      + ` q-fab__actions--${ showing.value === true ? 'opened' : 'closed' }`
    )

    const actionAttrs = computed(() => {
      const attrs = {
        id: targetUid.value,
        role: 'menu'
      }

      if (showing.value !== true) {
        attrs[ 'aria-hidden' ] = 'true'
      }

      return attrs
    })

    const iconHolderClass = computed(() =>
      'q-fab__icon-holder '
      + ` q-fab__icon-holder--${ showing.value === true ? 'opened' : 'closed' }`
    )

    function getIcon (kebab, camel) {
      const slotFn = slots[ kebab ]
      const classes = `q-fab__${ kebab } absolute-full`

      return slotFn === void 0
        ? h(QIcon, { class: classes, name: props[ camel ] || $q.iconSet.fab[ camel ] })
        : h('div', { class: classes }, slotFn(slotScope.value))
    }

    function getTriggerContent () {
      const child = []

      props.hideIcon !== true && child.push(
        h('div', { class: iconHolderClass.value }, [
          getIcon('icon', 'icon'),
          getIcon('active-icon', 'activeIcon')
        ])
      )

      if (props.label !== '' || slots.label !== void 0) {
        child[ labelProps.value.action ](
          h('div', labelProps.value.data, slots.label !== void 0 ? slots.label(slotScope.value) : [ props.label ])
        )
      }

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
        'aria-controls': targetUid.value,
        onClick: toggle
      }, getTriggerContent),

      h('div', { class: actionClass.value, ...actionAttrs.value }, hSlot(slots.default))
    ])
  }
})
