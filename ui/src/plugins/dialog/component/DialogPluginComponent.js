import { computed, getCurrentInstance, h, ref, toRaw, watch } from 'vue'

import QDialog from '../../../components/dialog/QDialog.js'
import QBtn from '../../../components/btn/QBtn.js'

import QCard from '../../../components/card/QCard.js'
import QCardSection from '../../../components/card/QCardSection.js'
import QCardActions from '../../../components/card/QCardActions.js'
import QSeparator from '../../../components/separator/QSeparator.js'

import QInput from '../../../components/input/QInput.js'
import QOptionGroup from '../../../components/option-group/QOptionGroup.js'

import QSpinner from '../../../components/spinner/QSpinner.js'

import { createComponent } from '../../../utils/private.create/create.js'
import useQuasar from '../../../composables/use-quasar/use-quasar.js'
import useDark, {
  useDarkProps
} from '../../../composables/private.use-dark/use-dark.js'

import { isKeyCode } from '../../../utils/private.keyboard/key-composition.js'
import { isObject } from '../../../utils/is/is.js'

export default /*#__PURE__*/ createComponent({
  name: 'DialogPluginComponent',

  props: {
    ...useDarkProps,

    title: String,
    message: String,
    prompt: Object,
    options: Object,
    progress: [Boolean, Object],

    html: Boolean,

    ok: {
      type: [String, Object, Boolean],
      default: true
    },
    cancel: [String, Object, Boolean],
    focus: {
      type: String,
      default: 'ok',
      validator: v => ['ok', 'cancel', 'none'].includes(v)
    },

    stackButtons: Boolean,
    color: String,

    cardClass: [String, Array, Object],
    cardStyle: [String, Array, Object]
  },

  emits: ['ok', 'hide'],

  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const $q = useQuasar()

    const isDark = useDark(props, $q)

    const dialogRef = ref(null)

    const model = ref(
      props.prompt !== void 0
        ? props.prompt.model
        : props.options !== void 0
          ? props.options.model
          : void 0
    )

    const classes = computed(
      () =>
        'q-dialog-plugin' +
        (isDark.value ? ' q-dialog-plugin--dark q-dark' : '') +
        (props.progress !== false ? ' q-dialog-plugin--progress' : '')
    )

    const vmColor = computed(
      () => props.color || (isDark.value ? 'amber' : 'primary')
    )

    const spinner = computed(() =>
      props.progress === false
        ? null
        : isObject(props.progress)
          ? {
              component: props.progress.spinner || QSpinner,
              props: { color: props.progress.color || vmColor.value }
            }
          : {
              component: QSpinner,
              props: { color: vmColor.value }
            }
    )

    const hasForm = computed(
      () => props.prompt !== void 0 || props.options !== void 0
    )

    const formProps = computed(() => {
      if (!hasForm.value) return {}

      // oxlint-disable-next-line no-shadow
      const { model, isValid, items, ...acc } =
        props.prompt !== void 0 ? props.prompt : props.options

      return acc
    })

    const okLabel = computed(() =>
      isObject(props.ok)
        ? $q.lang.label.ok
        : props.ok === true
          ? $q.lang.label.ok
          : props.ok
    )

    const cancelLabel = computed(() =>
      isObject(props.cancel)
        ? $q.lang.label.cancel
        : props.cancel === true
          ? $q.lang.label.cancel
          : props.cancel
    )

    const okDisabled = computed(() => {
      if (props.prompt !== void 0) {
        return (
          props.prompt.isValid !== void 0 && !props.prompt.isValid(model.value)
        )
      }
      if (props.options !== void 0) {
        return (
          props.options.isValid !== void 0 &&
          !props.options.isValid(model.value)
        )
      }
      return false
    })

    const okProps = computed(() => ({
      color: vmColor.value,
      label: okLabel.value,
      ripple: false,
      disable: okDisabled.value,
      ...(isObject(props.ok) ? props.ok : { flat: true }),
      'data-autofocus': (props.focus === 'ok' && !hasForm.value) || void 0,
      onClick: onOk
    }))

    const cancelProps = computed(() => ({
      color: vmColor.value,
      label: cancelLabel.value,
      ripple: false,
      ...(isObject(props.cancel) ? props.cancel : { flat: true }),
      'data-autofocus': (props.focus === 'cancel' && !hasForm.value) || void 0,
      onClick: onCancel
    }))

    watch(() => props.prompt && props.prompt.model, onUpdateModel)
    watch(() => props.options && props.options.model, onUpdateModel)

    function show() {
      dialogRef.value.show()
    }

    function hide() {
      dialogRef.value.hide()
    }

    function onOk() {
      emit('ok', toRaw(model.value))
      hide()
    }

    function onCancel() {
      hide()
    }

    function onDialogHide() {
      emit('hide')
    }

    function onUpdateModel(val) {
      model.value = val
    }

    function onInputKeyup(evt) {
      // if ENTER key
      if (
        !okDisabled.value &&
        props.prompt.type !== 'textarea' &&
        isKeyCode(evt, 13)
      ) {
        onOk()
      }
    }

    function getSection(sectionClass, text) {
      return props.html
        ? h(QCardSection, {
            class: sectionClass,
            innerHTML: text
          })
        : h(QCardSection, { class: sectionClass }, () => text)
    }

    function getPrompt() {
      return [
        h(QInput, {
          color: vmColor.value,
          dense: true,
          autofocus: true,
          dark: isDark.value,
          ...formProps.value,
          modelValue: model.value,
          'onUpdate:modelValue': onUpdateModel,
          onKeyup: onInputKeyup
        })
      ]
    }

    function getOptions() {
      return [
        h(QOptionGroup, {
          color: vmColor.value,
          options: props.options.items,
          dark: isDark.value,
          ...formProps.value,
          modelValue: model.value,
          'onUpdate:modelValue': onUpdateModel
        })
      ]
    }

    function getButtons() {
      const child = []

      if (props.cancel) child.push(h(QBtn, cancelProps.value))
      if (props.ok) child.push(h(QBtn, okProps.value))

      return h(
        QCardActions,
        {
          class: props.stackButtons ? 'items-end' : '',
          vertical: props.stackButtons,
          align: 'right'
        },
        () => child
      )
    }

    function getCardContent() {
      const child = []

      if (props.title) child.push(getSection('q-dialog__title', props.title))

      if (props.progress !== false) {
        child.push(
          h(QCardSection, { class: 'q-dialog__progress' }, () =>
            h(spinner.value.component, spinner.value.props)
          )
        )
      }

      if (props.message) {
        child.push(getSection('q-dialog__message', props.message))
      }

      if (props.prompt !== void 0) {
        child.push(
          h(QCardSection, { class: 'scroll q-dialog-plugin__form' }, getPrompt)
        )
      } else if (props.options !== void 0) {
        child.push(
          h(QSeparator, { dark: isDark.value }),
          h(
            QCardSection,
            { class: 'scroll q-dialog-plugin__form' },
            getOptions
          ),
          h(QSeparator, { dark: isDark.value })
        )
      }

      if (props.ok || props.cancel) {
        child.push(getButtons())
      }

      return child
    }

    function getContent() {
      return [
        h(
          QCard,
          {
            class: [classes.value, props.cardClass],
            style: props.cardStyle,
            dark: isDark.value
          },
          getCardContent
        )
      ]
    }

    // expose public methods
    Object.assign(proxy, { show, hide })

    return () =>
      h(
        QDialog,
        {
          ref: dialogRef,
          onHide: onDialogHide
        },
        getContent
      )
  }
})
