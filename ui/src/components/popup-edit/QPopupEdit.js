import { h, ref, computed, nextTick, getCurrentInstance } from 'vue'

import QMenu from '../menu/QMenu.js'
import QBtn from '../btn/QBtn.js'

import { createComponent } from '../../utils/private/create.js'
import clone from '../../utils/clone.js'
import { isDeepEqual } from '../../utils/is.js'
import { injectProp } from '../../utils/private/inject-obj-prop.js'

export default createComponent({
  name: 'QPopupEdit',

  props: {
    modelValue: {
      required: true
    },
    title: String,
    buttons: Boolean,
    labelSet: String,
    labelCancel: String,

    color: {
      type: String,
      default: 'primary'
    },
    validate: {
      type: Function,
      default: () => true
    },

    autoSave: Boolean,

    /* menu props overrides */
    cover: {
      type: Boolean,
      default: true
    },
    /* end of menu props */

    disable: Boolean
  },

  emits: [
    'update:modelValue', 'save', 'cancel',
    'beforeShow', 'show', 'beforeHide', 'hide'
  ],

  setup (props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const menuRef = ref(null)

    const initialValue = ref('')
    const currentModel = ref('')

    let validated = false

    const scope = computed(() => {
      return injectProp({
        initialValue: initialValue.value,
        validate: props.validate,
        set,
        cancel,
        updatePosition
      }, 'value', () => currentModel.value, val => { currentModel.value = val })
    })

    function set () {
      if (props.validate(currentModel.value) === false) {
        return
      }

      if (hasModelChanged() === true) {
        emit('save', currentModel.value, initialValue.value)
        emit('update:modelValue', currentModel.value)
      }

      closeMenu()
    }

    function cancel () {
      if (hasModelChanged() === true) {
        emit('cancel', currentModel.value, initialValue.value)
      }

      closeMenu()
    }

    function updatePosition () {
      nextTick(() => {
        menuRef.value.updatePosition()
      })
    }

    function hasModelChanged () {
      return isDeepEqual(currentModel.value, initialValue.value) === false
    }

    function closeMenu () {
      validated = true
      menuRef.value.hide()
    }

    function onBeforeShow () {
      validated = false
      initialValue.value = clone(props.modelValue)
      currentModel.value = clone(props.modelValue)
      emit('beforeShow')
    }

    function onShow () {
      emit('show')
    }

    function onBeforeHide () {
      if (validated === false && hasModelChanged() === true) {
        if (props.autoSave === true && props.validate(currentModel.value) === true) {
          emit('save', currentModel.value, initialValue.value)
          emit('update:modelValue', currentModel.value)
        }
        else {
          emit('cancel', currentModel.value, initialValue.value)
        }
      }

      emit('beforeHide')
    }

    function onHide () {
      emit('hide')
    }

    function getContent () {
      const child = slots.default !== void 0
        ? [].concat(slots.default(scope.value))
        : []

      props.title && child.unshift(
        h('div', { class: 'q-dialog__title q-mt-sm q-mb-sm' }, props.title)
      )

      props.buttons === true && child.push(
        h('div', { class: 'q-popup-edit__buttons row justify-center no-wrap' }, [
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
        ])
      )

      return child
    }

    // expose public methods
    Object.assign(proxy, {
      set,
      cancel,
      show (e) { menuRef.value !== null && menuRef.value.show(e) },
      hide (e) { menuRef.value !== null && menuRef.value.hide(e) },
      updatePosition
    })

    return () => {
      if (props.disable === true) { return }

      return h(QMenu, {
        ref: menuRef,
        class: 'q-popup-edit',
        cover: props.cover,
        onBeforeShow,
        onShow,
        onBeforeHide,
        onHide,
        onEscapeKey: cancel
      }, getContent)
    }
  }
})
