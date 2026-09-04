import { computed, getCurrentInstance, h, nextTick, ref, shallowRef } from 'vue'

import QMenu from '../menu/QMenu.js'
import QBtn from '../btn/QBtn.js'

import useQuasar from '../../composables/use-quasar/use-quasar.js'

import { createComponent } from '../../utils/private.create/create.js'
import clone from '../../utils/clone/clone.js'
import { isDeepEqual } from '../../utils/is/is.js'
import { injectProp } from '../../utils/private.inject-obj-prop/inject-obj-prop.js'

export default /*#__PURE__*/ createComponent({
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
    'update:modelValue',
    'save',
    'cancel',
    'beforeShow',
    'show',
    'beforeHide',
    'hide'
  ],

  setup(props, { slots, emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const menuRef = shallowRef(null)

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

    function set() {
      if (!props.validate(currentModel.value)) return

      if (hasModelChanged()) {
        emit('save', currentModel.value, initialValue.value)
        emit('update:modelValue', currentModel.value)
      }

      closeMenu()
    }

    function cancel() {
      if (hasModelChanged()) {
        emit('cancel', currentModel.value, initialValue.value)
      }

      closeMenu()
    }

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
      show(e) {
        menuRef.value?.show(e)
      },
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
