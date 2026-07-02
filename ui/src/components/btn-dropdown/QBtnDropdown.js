import { computed, getCurrentInstance, h, onMounted, ref, watch } from 'vue'

import QIcon from '../icon/QIcon.js'
import QBtn from '../btn/QBtn.js'
import QBtnGroup from '../btn-group/QBtnGroup.js'
import QMenu from '../menu/QMenu.js'

import { getBtnDesignAttr, nonRoundBtnProps } from '../btn/use-btn.js'
import useId from '../../composables/use-id/use-id.js'
import { useTransitionProps } from '../../composables/private.use-transition/use-transition.js'

import { createComponent } from '../../utils/private.create/create.js'
import { stop } from '../../utils/event/event.js'
import { hSlot } from '../../utils/private.render/render.js'

const btnPropsList = Object.keys(nonRoundBtnProps)

export function passBtnProps(props) {
  return btnPropsList.reduce((acc, key) => {
    const val = props[key]
    if (val !== void 0) {
      acc[key] = val
    }
    return acc
  }, {})
}

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/button-dropdown
 */
/**
 * Default slot in the devland unslotted content of the component
 *
 * @api slot default
 */

/**
 * Customize main button's content through this slot, unless you're using the 'icon' and 'label' props
 *
 * @api slot label
 */

/**
 * Override the default QSpinner when in 'loading' state
 *
 * @api slot loading
 */
export default createComponent({
  name: 'QBtnDropdown',

  props: {
    ...nonRoundBtnProps,
    ...useTransitionProps,

    /**
     * @api prop model-value
     * @type {Boolean}
     */
    modelValue: Boolean,
    /**
     * Split dropdown icon into its own button
     *
     * @api prop split
     * @type {Boolean}
     * @category content|behavior
     */
    split: Boolean,
    /**
     * @api prop dropdown-icon
     * @extends icon
     */
    dropdownIcon: String,

    /**
     * Class definitions to be attributed to the menu
     *
     * @api prop content-class
     * @type {String|Array|Object}
     * @ts-type VueClassProp
     * @category style
     * @example 'my-special-class'
     * @example { 'my-special-class': true }
     */
    contentClass: [Array, String, Object],
    /**
     * Style definitions to be attributed to the menu
     *
     * @api prop content-style
     * @type {String|Array|Object}
     * @ts-type VueStyleProp
     * @category style
     * @example 'background-color: #ff0000'
     * @example { backgroundColor: '#ff0000' }
     */
    contentStyle: [Array, String, Object],

    /**
     * Allows the menu to cover the button. When used, the 'menu-self' prop is no longer effective
     *
     * @api prop cover
     * @type {Boolean}
     * @category position
     */
    cover: Boolean,
    /**
     * Allows the menu to not be dismissed by a click/tap outside of the menu or by hitting the ESC key; Also, an app route change won't dismiss it
     *
     * @api prop persistent
     * @type {Boolean}
     * @category behavior
     */
    persistent: Boolean,
    /**
     * User cannot dismiss the popup by hitting ESC key; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-esc-dismiss
     * @type {Boolean}
     * @category behavior
     * @added-in v2.18
     */
    noEscDismiss: Boolean,
    /**
     * Changing route app won't dismiss the popup; No need to set it if 'persistent' prop is also set
     *
     * @api prop no-route-dismiss
     * @type {Boolean}
     * @category behavior
     */
    noRouteDismiss: Boolean,
    /**
     * Allows any click/tap in the menu to close it; Useful instead of attaching events to each menu item that should close the menu on click/tap
     *
     * @api prop auto-close
     * @type {Boolean}
     * @category behavior
     */
    autoClose: Boolean,
    /**
     * (Accessibility) When the dropdown gets hidden, do not refocus on the DOM element that previously had focus
     *
     * @api prop no-refocus
     * @type {Boolean}
     * @category behavior
     * @added-in v2.18
     */
    noRefocus: Boolean,
    /**
     * (Accessibility) When the dropdown gets shown, do not switch focus on it
     *
     * @api prop no-focus
     * @type {Boolean}
     * @category behavior
     * @added-in v2.18
     */
    noFocus: Boolean,

    /**
     * Two values setting the starting position or anchor point of the menu relative to its target
     *
     * @api prop menu-anchor
     * @type {String}
     * @default 'bottom end'
     * @category position
     */
    menuAnchor: {
      type: String,
      default: 'bottom end'
    },
    /**
     * Two values setting the menu's own position relative to its target
     *
     * @api prop menu-self
     * @type {String}
     * @default 'top end'
     * @category position
     */
    menuSelf: {
      type: String,
      default: 'top end'
    },
    /**
     * An array of two numbers to offset the menu horizontally and vertically in pixels
     *
     * @api prop menu-offset
     * @type {Array}
     * @category position
     * @example [8, 8]
     * @example [5, 10]
     */
    menuOffset: Array,

    /**
     * Disable main button (useful along with 'split' prop)
     *
     * @api prop disable-main-btn
     * @type {Boolean}
     * @category behavior
     */
    disableMainBtn: Boolean,
    /**
     * Disables dropdown (dropdown button if using along 'split' prop)
     *
     * @api prop disable-dropdown
     * @type {Boolean}
     * @category behavior
     */
    disableDropdown: Boolean,

    /**
     * Disables the rotation of the dropdown icon when state is toggled
     *
     * @api prop no-icon-animation
     * @type {Boolean}
     * @category style
     */
    noIconAnimation: Boolean,

    /**
     * aria-label to be used on the dropdown toggle element
     *
     * @api prop toggle-aria-label
     * @type {String}
     * @category accessibility
     * @added-in v2.8.4
     * @example 'Open menu'
     */
    toggleAriaLabel: String
  },

  emits: [
    'update:modelValue',
    /**
     * Emitted when user clicks/taps on the main button (not the icon one, if using 'split')
     *
     * @api event click
     * @extends click
     */
    'click',
    'beforeShow',
    'show',
    'beforeHide',
    'hide'
  ],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()

    const showing = ref(props.modelValue)
    const menuRef = ref(null)
    const targetUid = useId()

    const ariaAttrs = computed(() => {
      const acc = {
        'aria-expanded': showing.value ? 'true' : 'false',
        'aria-haspopup': 'true',
        'aria-controls': targetUid.value,
        'aria-label':
          props.toggleAriaLabel ||
          proxy.$q.lang.label[showing.value ? 'collapse' : 'expand'](
            props.label
          )
      }

      if (
        props.disable ||
        (!props.split && props.disableMainBtn) ||
        props.disableDropdown
      ) {
        acc['aria-disabled'] = 'true'
      }

      return acc
    })

    const iconClass = computed(
      () =>
        'q-btn-dropdown__arrow' +
        (showing.value && !props.noIconAnimation ? ' rotate-180' : '') +
        (props.split ? '' : ' q-btn-dropdown__arrow-container')
    )

    const btnDesignAttr = computed(() => getBtnDesignAttr(props))
    const btnProps = computed(() => passBtnProps(props))

    watch(
      () => props.modelValue,
      val => {
        menuRef.value?.[val ? 'show' : 'hide']()
      }
    )

    watch(() => props.split, hide)

    function onBeforeShow(e) {
      showing.value = true
      emit('beforeShow', e)
    }

    function onShow(e) {
      emit('show', e)
      emit('update:modelValue', true)
    }

    function onBeforeHide(e) {
      showing.value = false
      emit('beforeHide', e)
    }

    function onHide(e) {
      emit('hide', e)
      emit('update:modelValue', false)
    }

    function onClick(e) {
      emit('click', e)
    }

    function onClickHide(e) {
      stop(e)
      hide()
      emit('click', e)
    }

    function toggle(evt) {
      menuRef.value?.toggle(evt)
    }

    function show(evt) {
      menuRef.value?.show(evt)
    }

    function hide(evt) {
      menuRef.value?.hide(evt)
    }

    // expose public methods
    Object.assign(proxy, {
      show,
      hide,
      toggle
    })

    onMounted(() => {
      if (props.modelValue) show()
    })

    return () => {
      const Arrow = [
        h(QIcon, {
          class: iconClass.value,
          name: props.dropdownIcon || proxy.$q.iconSet.arrow.dropdown
        })
      ]

      if (!props.disableDropdown) {
        Arrow.push(
          h(
            QMenu,
            {
              ref: menuRef,
              id: targetUid.value,
              class: props.contentClass,
              style: props.contentStyle,
              cover: props.cover,
              fit: true,
              persistent: props.persistent,
              noEscDismiss: props.noEscDismiss,
              noRouteDismiss: props.noRouteDismiss,
              autoClose: props.autoClose,
              noFocus: props.noFocus,
              noRefocus: props.noRefocus,
              anchor: props.menuAnchor,
              self: props.menuSelf,
              offset: props.menuOffset,
              separateClosePopup: true,
              transitionShow: props.transitionShow,
              transitionHide: props.transitionHide,
              transitionDuration: props.transitionDuration,
              onBeforeShow,
              onShow,
              onBeforeHide,
              onHide
            },
            slots.default
          )
        )
      }

      if (!props.split) {
        return h(
          QBtn,
          {
            class: 'q-btn-dropdown q-btn-dropdown--simple',
            ...btnProps.value,
            ...ariaAttrs.value,
            disable: props.disable || props.disableMainBtn,
            noWrap: true,
            round: false,
            onClick
          },
          {
            // oxlint-disable-next-line unicorn/prefer-spread
            default: () => hSlot(slots.label, []).concat(Arrow),
            loading: slots.loading
          }
        )
      }

      return h(
        QBtnGroup,
        {
          class: 'q-btn-dropdown q-btn-dropdown--split no-wrap q-btn-item',
          rounded: props.rounded,
          square: props.square,
          ...btnDesignAttr.value,
          glossy: props.glossy,
          stretch: props.stretch
        },
        () => [
          h(
            QBtn,
            {
              class: 'q-btn-dropdown--current',
              ...btnProps.value,
              disable: props.disable || props.disableMainBtn,
              noWrap: true,
              round: false,
              onClick: onClickHide
            },
            {
              default: slots.label,
              loading: slots.loading
            }
          ),

          h(
            QBtn,
            {
              class: 'q-btn-dropdown__arrow-container q-anchor--skip',
              ...ariaAttrs.value,
              ...btnDesignAttr.value,
              disable: props.disable || props.disableDropdown,
              rounded: props.rounded,
              color: props.color,
              textColor: props.textColor,
              dense: props.dense,
              size: props.size,
              padding: props.padding,
              ripple: props.ripple
            },
            () => Arrow
          )
        ]
      )
    }
  }
})
