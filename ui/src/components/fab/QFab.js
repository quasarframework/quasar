import { computed, h, provide, ref, shallowRef, watch } from 'vue'

import QBtn from '../btn/QBtn.js'
import QIcon from '../icon/QIcon.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'
import useFab, { getFabBtnProps, useFabProps } from './use-fab.js'
import useId from '../../composables/use-id/use-id.js'
import useHover, {
  useHoverProps
} from '../../composables/private.use-hover/use-hover.js'
import useModelToggle, {
  useModelToggleEmits,
  useModelToggleProps
} from '../../composables/private.use-model-toggle/use-model-toggle.js'

import { createComponent } from '../../utils/private.create/create.js'
import { hMergeSlot, hSlot } from '../../utils/private.render/render.js'
import { fabKey } from '../../utils/private.symbols/symbols.js'

const directions = ['up', 'right', 'down', 'left']
const alignValues = ['left', 'center', 'right']

// must track the .18s show transition of the .q-fab__actions children
// (QFab.sass); deliberately ignores the stagger, which only delays the
// actions further out and not the ones the pointer is already over
const hoverShowDuration = 180

export default /*#__PURE__*/ createComponent({
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

    ...useHoverProps,

    persistent: Boolean,

    stagger: {
      type: Number,
      default: 40
    },

    verticalActionsAlign: {
      type: String,
      default: 'center',
      validator: v => alignValues.includes(v)
    }
  },

  emits: useModelToggleEmits,

  setup(props, { slots }) {
    const triggerRef = shallowRef(null)
    const showing = ref(props.modelValue === true)
    const targetUid = useId()

    const $q = useQuasar()
    const { formClass, stacked, labelProps } = useFab(props, showing)

    const hideOnRouteChange = computed(() => !props.persistent)

    const { show, hide, toggle } = useModelToggle({
      showing,
      hideOnRouteChange
    })

    // when the current "show" was hover-triggered, the moment it happened
    let hoverShownAt = 0

    const { clearHoverTimer, hoverShow, hoverHide } = useHover({
      props,
      canShow: () => !showing.value,
      show: evt => {
        hoverShownAt = Date.now()
        show(evt)
      },
      canHide: () => showing.value,
      hide
    })

    // opened or closed by any means: a pending hover show/hide is now moot
    watch(showing, clearHoverTimer)

    function onTriggerClick(evt) {
      // on real hardware the pointer reaches the trigger before any click
      // can, so with "hover" on the actions are still animating in when a
      // move-and-click gesture's click lands; that click must not dismiss
      // what the very same gesture just opened
      if (showing.value && Date.now() - hoverShownAt < hoverShowDuration) {
        return
      }

      toggle(evt)
    }

    const slotScope = computed(() => ({ opened: showing.value }))

    const classes = computed(
      () =>
        'q-fab z-fab row inline justify-center' +
        ` q-fab--align-${props.verticalActionsAlign} ${formClass.value}` +
        (showing.value ? ' q-fab--opened' : ' q-fab--closed')
    )

    const actionClass = computed(
      () =>
        'q-fab__actions flex no-wrap inline' +
        ` q-fab__actions--${props.direction}` +
        ` q-fab__actions--${showing.value ? 'opened' : 'closed'}`
    )

    const onEvents = computed(() =>
      props.hover
        ? { onPointerenter: hoverShow, onPointerleave: hoverHide }
        : {}
    )

    // deliberately no role on the actions container: its children are
    // plain buttons/links, which the "menu" role would render invalid
    // (menus permit nothing but menuitem* children)
    const actionAttrs = computed(() => {
      const attrs = {
        id: targetUid.value,
        style: `--q-fab-stagger: ${props.stagger}ms`
      }

      if (!showing.value) {
        attrs['aria-hidden'] = 'true'
      }

      return attrs
    })

    const iconHolderClass = computed(
      () =>
        'q-fab__icon-holder ' +
        ` q-fab__icon-holder--${showing.value ? 'opened' : 'closed'}`
    )

    function getIcon(kebab, camel) {
      const slotFn = slots[kebab]
      const localClass = `q-fab__${kebab} absolute-full`

      return slotFn === void 0
        ? h(QIcon, {
            class: localClass,
            name: props[camel] || $q.iconSet.fab[camel]
          })
        : h('div', { class: localClass }, slotFn(slotScope.value))
    }

    function getTriggerContent() {
      const child = []

      if (!props.hideIcon) {
        child.push(
          h('div', { class: iconHolderClass.value }, [
            getIcon('icon', 'icon'),
            getIcon('active-icon', 'activeIcon')
          ])
        )
      }

      if (props.label !== '' || slots.label !== void 0) {
        child[labelProps.value.action](
          h(
            'div',
            labelProps.value.data,
            slots.label !== void 0
              ? slots.label(slotScope.value)
              : [props.label]
          )
        )
      }

      return hMergeSlot(slots.tooltip, child)
    }

    provide(fabKey, {
      showing,

      onChildClick(evt) {
        hide(evt)

        if (evt?.qAvoidFocus !== true) {
          triggerRef.value?.$el.focus()
        }
      }
    })

    return () =>
      h(
        'div',
        {
          class: classes.value,
          ...onEvents.value
        },
        [
          h(
            QBtn,
            {
              ref: triggerRef,
              class: formClass.value,
              ...getFabBtnProps(props),
              noWrap: true,
              stack: stacked.value,
              noCaps: true,
              fab: true,
              // no aria-haspopup: its value must reflect the popup's
              // ARIA role and the actions container claims none
              'aria-expanded': showing.value ? 'true' : 'false',
              'aria-controls': targetUid.value,
              onClick: onTriggerClick
            },
            getTriggerContent
          ),

          h(
            'div',
            { class: actionClass.value, ...actionAttrs.value },
            hSlot(slots.default)
          )
        ]
      )
  }
})
