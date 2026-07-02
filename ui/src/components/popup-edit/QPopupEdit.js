import { computed, getCurrentInstance, h, nextTick, ref } from 'vue'

import QMenu from '../menu/QMenu.js'
import QBtn from '../btn/QBtn.js'

import { createComponent } from '../../utils/private.create/create.js'
import clone from '../../utils/clone/clone.js'
import { isDeepEqual } from '../../utils/is/is.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

/**
 * @api component
 * @docsUrl https://v2.quasar.dev/vue-components/popup-edit
 */
/**
 * Used for injecting the form component; Do NOT destructure it
 *
 * @api slot default
 * @scope initialValue {Any} Initial value
 * @scope value {Any} Current value
 * @scope validate {Function} Function that checks if the value is valid
 * @scope set {Function} Function that sets the value and closes the popup
 * @scope cancel {Function} Function that cancels the editing and reverts the value to the initialValue
 * @scope updatePosition {Function} There are some custom scenarios for which Quasar cannot automatically reposition the component without significant performance drawbacks so the optimal solution is for you to call this method when you need it
 */
export default createComponent({
  name: 'QPopupEdit',

  props: {
    /**
     * @api prop model-value
     * @extends model-value
     * @syncable
     * @example # v-model="myValue"
     */
    modelValue: {
      required: true
    },
    /**
     * Optional title (unless 'title' slot is used)
     *
     * @api prop title
     * @type {String}
     * @category content
     * @example 'Calories'
     */
    title: String,
    /**
     * Show Set and Cancel buttons
     *
     * @api prop buttons
     * @type {Boolean}
     * @category content
     */
    buttons: Boolean,
    /**
     * Override Set button label
     *
     * @api prop label-set
     * @type {String}
     * @category content
     * @example 'OK'
     */
    labelSet: String,
    /**
     * Override Cancel button label
     *
     * @api prop label-cancel
     * @type {String}
     * @category content
     * @example 'Cancel'
     */
    labelCancel: String,

    /**
     * @api prop color
     * @extends color
     * @default 'primary'
     */
    color: {
      type: String,
      default: 'primary'
    },
    /**
     * Validates model then triggers 'save' and closes Popup; Returns a Boolean ('true' means valid, 'false' means abort); Syntax: validate(value); For best performance, reference it from your scope and do not define it inline
     *
     * @api prop validate
     * @type {Function}
     * @default () => true
     * @category model
     * @example value => value !== 0
     */
    validate: {
      type: Function,
      default: () => true
    },

    /**
     * Automatically save the model (if changed) when user clicks/taps outside of the popup; It does not apply to ESC key
     *
     * @api prop auto-save
     * @type {Boolean}
     * @category behavior
     */
    autoSave: Boolean,

    /* menu props overrides */
    /**
     * Allows the menu to cover its target. When used, the 'self' and 'fit' props are no longer effective
     *
     * @api prop cover
     * @type {Boolean}
     * @default true
     * @category position
     */
    cover: {
      type: Boolean,
      default: true
    },
    /* end of menu props */

    /**
     * @api prop disable
     * @extends disable
     */
    disable: Boolean
  },

  emits: [
    /**
     * Emitted when Popup gets cancelled in order to reset model to its initial value; Is also used by v-model
     *
     * @api event update:model-value
     * @extends update:model-value
     */
    'update:modelValue',
    /**
     * Emitted when value has been successfully validated and it should be saved
     *
     * @api event save
     * @param {Any} value Validated value to be saved
     * @param {Any} initialValue Initial value, before changes
     */
    'save',
    /**
     * Emitted when user cancelled the change (hit ESC key or clicking outside of Popup or hit 'Cancel' button)
     *
     * @api event cancel
     * @param {Any} value Edited value
     * @param {Any} initialValue Initial value, before changes
     */
    'cancel',
    /**
     * Emitted right before Popup gets shown
     *
     * @api event before-show
     */
    'beforeShow',
    /**
     * Emitted right after Popup gets shown
     *
     * @api event show
     */
    'show',
    /**
     * Emitted right before Popup gets dismissed
     *
     * @api event before-hide
     */
    'beforeHide',
    /**
     * Emitted right after Popup gets dismissed
     *
     * @api event hide
     */
    'hide'
  ],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const menuRef = ref(null)

    const initialValue = ref('')
    const currentModel = ref('')

    let validated = false

    const scope = computed(() =>
      injectProp(
        {
          initialValue: initialValue.value,
          validate: props.validate,
          set,
          cancel,
          updatePosition
        },
        'value',
        () => currentModel.value,
        val => {
          currentModel.value = val
        }
      )
    )

    /**
     * Trigger a model update; Validates model (and emits 'save' event if it's the case) then closes Popup
     *
     * @api method set
     */
    function set() {
      if (!props.validate(currentModel.value)) return

      if (hasModelChanged()) {
        emit('save', currentModel.value, initialValue.value)
        emit('update:modelValue', currentModel.value)
      }

      closeMenu()
    }

    /**
     * Triggers a model reset to its initial value ('cancel' event is emitted) then closes Popup
     *
     * @api method cancel
     */
    function cancel() {
      if (hasModelChanged()) {
        emit('cancel', currentModel.value, initialValue.value)
      }

      closeMenu()
    }

    /**
     * There are some custom scenarios for which Quasar cannot automatically reposition the component without significant performance drawbacks so the optimal solution is for you to call this method when you need it
     *
     * @api method updatePosition
     */
    function updatePosition() {
      nextTick(() => {
        menuRef.value.updatePosition()
      })
    }

    function hasModelChanged() {
      return !isDeepEqual(currentModel.value, initialValue.value)
    }

    function closeMenu() {
      validated = true
      menuRef.value.hide()
    }

    function onBeforeShow() {
      validated = false
      initialValue.value = clone(props.modelValue)
      currentModel.value = clone(props.modelValue)
      emit('beforeShow')
    }

    function onShow() {
      emit('show')
    }

    function onBeforeHide() {
      if (!validated && hasModelChanged()) {
        if (props.autoSave && props.validate(currentModel.value)) {
          emit('save', currentModel.value, initialValue.value)
          emit('update:modelValue', currentModel.value)
        } else {
          emit('cancel', currentModel.value, initialValue.value)
        }
      }

      emit('beforeHide')
    }

    function onHide() {
      emit('hide')
    }

    function getContent() {
      const child =
        slots.default !== void 0 ? [slots.default(scope.value)].flat() : []

      if (props.title) {
        child.unshift(
          h('div', { class: 'q-dialog__title q-mt-sm q-mb-sm' }, props.title)
        )
      }

      if (props.buttons) {
        child.push(
          h(
            'div',
            { class: 'q-popup-edit__buttons row justify-center no-wrap' },
            [
              h(QBtn, {
                flat: true,
                color: props.color,
                label: props.labelCancel || $q.lang.label.cancel,
                onClick: cancel
              }),
              h(QBtn, {
                flat: true,
                color: props.color,
                label: props.labelSet || $q.lang.label.set,
                onClick: set
              })
            ]
          )
        )
      }

      return child
    }

    // expose public methods
    Object.assign(proxy, {
      set,
      cancel,
      /**
       * @api method show
       */
      show(e) {
        menuRef.value?.show(e)
      },
      /**
       * @api method hide
       */
      hide(e) {
        menuRef.value?.hide(e)
      },
      updatePosition
    })

    return () => {
      if (props.disable) return

      return h(
        QMenu,
        {
          ref: menuRef,
          class: 'q-popup-edit',
          cover: props.cover,
          onBeforeShow,
          onShow,
          onBeforeHide,
          onHide,
          onEscapeKey: cancel
        },
        getContent
      )
    }
  }
})
