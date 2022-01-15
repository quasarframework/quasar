import { h, ref, computed, watch, toRaw, getCurrentInstance } from 'vue'

import QDialog from '../dialog/QDialog.js'
import QBtn from '../btn/QBtn.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'
import QCardActions from '../card/QCardActions.js'
import QSeparator from '../separator/QSeparator.js'

import QInput from '../input/QInput.js'
import QOptionGroup from '../option-group/QOptionGroup.js'

import QSpinner from '../spinner/QSpinner.js'

import { createComponent } from '../../utils/private/create.js'
import useDark, { useDarkProps } from '../../composables/private/use-dark.js'

import { isKeyCode } from '../../utils/private/key-composition.js'

export default createComponent({
  name: 'DialogPlugin',

  props: {
    ...useDarkProps,

    title: String,
    message: String,
    prompt: Object,
    options: Object,
    progress: [ Boolean, Object ],

    html: Boolean,

    ok: {
      type: [ String, Object, Boolean ],
      default: true
    },
    cancel: [ String, Object, Boolean ],
    focus: {
      type: String,
      default: 'ok',
      validator: v => [ 'ok', 'cancel', 'none' ].includes(v)
    },

    stackButtons: Boolean,
    color: String,

    cardClass: [ String, Array, Object ],
    cardStyle: [ String, Array, Object ]
  },

  emits: [ 'ok', 'hide' ],

  setup (props, { emit }) {
    const { proxy } = getCurrentInstance()
    const { $q } = proxy

    const isDark = useDark(props, $q)

    const dialogRef = ref(null)

    const model = ref(
      props.prompt !== void 0
        ? props.prompt.model
        : (props.options !== void 0 ? props.options.model : void 0)
    )

    const classes = computed(() =>
      'q-dialog-plugin'
      + (isDark.value === true ? ' q-dialog-plugin--dark q-dark' : '')
      + (props.progress !== false ? ' q-dialog-plugin--progress' : '')
    )

    const vmColor = computed(() =>
      props.color || (isDark.value === true ? 'amber' : 'primary')
    )

    const spinner = computed(() => (
      props.progress === false
        ? null
        : (
            Object(props.progress) === props.progress
              ? {
                  component: props.progress.spinner || QSpinner,
                  props: { color: props.progress.color || vmColor.value }
                }
              : {
                  component: QSpinner,
                  props: { color: vmColor.value }
                }
          )
    ))

    const hasForm = computed(() =>
      props.prompt !== void 0 || props.options !== void 0
    )

    const formProps = computed(() => {
      if (hasForm.value !== true) {
        return {}
      }

      const { model, isValid, items, ...formProps } = props.prompt !== void 0
        ? props.prompt
        : props.options

      return formProps
    })

    const okLabel = computed(() => (
      Object(props.ok) === props.ok
        ? $q.lang.label.ok
        : (
            props.ok === true
              ? $q.lang.label.ok
              : props.ok
          )
    ))

    const cancelLabel = computed(() => (
      Object(props.cancel) === props.cancel
        ? $q.lang.label.cancel
        : (
            props.cancel === true
              ? $q.lang.label.cancel
              : props.cancel
          )
    ))

    const okDisabled = computed(() => {
      if (props.prompt !== void 0) {
        return props.prompt.isValid !== void 0
          && props.prompt.isValid(model.value) !== true
      }
      if (props.options !== void 0) {
        return props.options.isValid !== void 0
          && props.options.isValid(model.value) !== true
      }
      return false
    })

    const okProps = computed(() => ({
      color: vmColor.value,
      label: okLabel.value,
      ripple: false,
      disable: okDisabled.value,
      ...(Object(props.ok) === props.ok ? props.ok : { flat: true }),
      'data-autofocus': (props.focus === 'ok' && hasForm.value !== true) || void 0,
      onClick: onOk
    }))

    const cancelProps = computed(() => ({
      color: vmColor.value,
      label: cancelLabel.value,
      ripple: false,
      ...(Object(props.cancel) === props.cancel ? props.cancel : { flat: true }),
      'data-autofocus': (props.focus === 'cancel' && hasForm.value !== true) || void 0,
      onClick: onCancel
    }))

    watch(() => props.prompt && props.prompt.model, onUpdateModel)
    watch(() => props.options && props.options.model, onUpdateModel)

    function show () {
      dialogRef.value.show()
    }

    function hide () {
      dialogRef.value.hide()
    }

    function onOk () {
      emit('ok', toRaw(model.value))
      hide()
    }

    function onCancel () {
      hide()
    }

    function onDialogHide () {
      emit('hide')
    }

    function onUpdateModel (val) {
      model.value = val
    }

    function onInputKeyup (evt) {
      // if ENTER key
      if (
        okDisabled.value !== true
        && props.prompt.type !== 'textarea'
        && isKeyCode(evt, 13) === true
      ) {
        onOk()
      }
    }

    function getSection (classes, text) {
      return props.html === true
        ? h(QCardSection, {
            class: classes,
            innerHTML: text
          })
        : h(QCardSection, { class: classes }, () => text)
    }

    function getPrompt () {
      return [
        h(QInput, {
          modelValue: model.value,
          ...formProps.value,
          color: vmColor.value,
          dense: true,
          autofocus: true,
          dark: isDark.value,
          'onUpdate:modelValue': onUpdateModel,
          onKeyup: onInputKeyup
        })
      ]
    }

    function getOptions () {
      return [
        h(QOptionGroup, {
          modelValue: model.value,
          ...formProps.value,
          color: vmColor.value,
          options: props.options.items,
          dark: isDark.value,
          'onUpdate:modelValue': onUpdateModel
        })
      ]
    }

    function getButtons () {
      const child = []

      props.cancel && child.push(
        h(QBtn, cancelProps.value)
      )

      props.ok && child.push(
        h(QBtn, okProps.value)
      )

      return h(QCardActions, {
        class: props.stackButtons === true ? 'items-end' : '',
        vertical: props.stackButtons,
        align: 'right'
      }, () => child)
    }

    function getCardContent () {
      const child = []

      props.title && child.push(
        getSection('q-dialog__title', props.title)
      )

      props.progress !== false && child.push(
        h(
          QCardSection,
          { class: 'q-dialog__progress' },
          () => h(spinner.value.component, spinner.value.props)
        )
      )

      props.message && child.push(
        getSection('q-dialog__message', props.message)
      )

      if (props.prompt !== void 0) {
        child.push(
          h(
            QCardSection,
            { class: 'scroll q-dialog-plugin__form' },
            getPrompt
          )
        )
      }
      else if (props.options !== void 0) {
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

    function getContent () {
      return [
        h(QCard, {
          class: [
            classes.value,
            props.cardClass
          ],
          style: props.cardStyle,
          dark: isDark.value
        }, getCardContent)
      ]
    }

    // expose public methods
    Object.assign(proxy, { show, hide })

    return () => h(QDialog, {
      ref: dialogRef,
      onHide: onDialogHide
    }, getContent)
  }
})
