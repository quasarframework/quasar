import { h, defineComponent, toRaw } from 'vue'

import { isKeyCode } from '../../utils/key-composition.js'

import QDialog from '../dialog/QDialog.js'
import QBtn from '../btn/QBtn.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'
import QCardActions from '../card/QCardActions.js'
import QSeparator from '../separator/QSeparator.js'

import QInput from '../input/QInput.js'
import QOptionGroup from '../option-group/QOptionGroup.js'

import QSpinner from '../spinner/QSpinner.js'

import DarkMixin from '../../mixins/dark.js'

export default defineComponent({
  name: 'DialogPlugin',

  mixins: [ DarkMixin ],

  props: {
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

  data () {
    return {
      model: this.prompt !== void 0
        ? this.prompt.model
        : (this.options !== void 0 ? this.options.model : void 0)
    }
  },

  watch: {
    'prompt.model': 'onUpdateModel',
    'options.model': 'onUpdateModel'
  },

  computed: {
    classes () {
      return 'q-dialog-plugin' +
        (this.isDark === true ? ' q-dialog-plugin--dark q-dark' : '') +
        (this.progress !== false ? ' q-dialog-plugin--progress' : '')
    },

    spinner () {
      if (this.progress !== false) {
        return Object(this.progress) === this.progress
          ? {
              component: this.progress.spinner || QSpinner,
              props: { color: this.progress.color || this.vmColor }
            }
          : {
              component: QSpinner,
              props: { color: this.vmColor }
            }
      }
    },

    hasForm () {
      return this.prompt !== void 0 || this.options !== void 0
    },

    formProps () {
      if (this.hasForm === true) {
        const { model, isValid, items, ...props } = this.prompt !== void 0
          ? this.prompt
          : this.options

        return props
      }
    },

    okLabel () {
      return Object(this.ok) === this.ok
        ? this.$q.lang.label.ok
        : (
            this.ok === true
              ? this.$q.lang.label.ok
              : this.ok
          )
    },

    cancelLabel () {
      return Object(this.cancel) === this.cancel
        ? this.$q.lang.label.cancel
        : (
            this.cancel === true
              ? this.$q.lang.label.cancel
              : this.cancel
          )
    },

    vmColor () {
      return this.color || (this.isDark === true ? 'amber' : 'primary')
    },

    okDisabled () {
      if (this.prompt !== void 0) {
        return this.prompt.isValid !== void 0 &&
          this.prompt.isValid(this.model) !== true
      }
      if (this.options !== void 0) {
        return this.options.isValid !== void 0 &&
          this.options.isValid(this.model) !== true
      }
    },

    okProps () {
      return {
        color: this.vmColor,
        label: this.okLabel,
        ripple: false,
        ...(Object(this.ok) === this.ok ? this.ok : { flat: true }),
        disable: this.okDisabled,
        'data-autofocus': this.focus === 'ok' && this.hasForm !== true,
        onClick: this.onOk
      }
    },

    cancelProps () {
      return {
        color: this.vmColor,
        label: this.cancelLabel,
        ripple: false,
        ...(Object(this.cancel) === this.cancel ? this.cancel : { flat: true }),
        'data-autofocus': this.focus === 'cancel' && this.hasForm !== true,
        onClick: this.onCancel
      }
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onOk () {
      this.$emit('ok', toRaw(this.model))
      this.hide()
    },

    onCancel () {
      this.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onUpdateModel (val) {
      this.model = val
    },

    onInputKeyup (evt) {
      // if ENTER key
      if (
        this.okDisabled !== true &&
        this.prompt.type !== 'textarea' &&
        isKeyCode(evt, 13) === true
      ) {
        this.onOk()
      }
    },

    getSection (classes, text) {
      return this.html === true
        ? h(QCardSection, {
            class: classes,
            innerHTML: text
          })
        : h(QCardSection, { class: classes }, () => text)
    },

    getPrompt () {
      return [
        h(QInput, {
          modelValue: this.model,
          ...this.formProps,
          color: this.vmColor,
          dense: true,
          autofocus: true,
          dark: this.isDark,
          'onUpdate:modelValue': this.onUpdateModel,
          onKeyup: this.onInputKeyup
        })
      ]
    },

    getOptions () {
      return [
        h(QOptionGroup, {
          modelValue: this.model,
          ...this.formProps,
          color: this.vmColor,
          options: this.options.items,
          dark: this.isDark,
          'onUpdate:modelValue': this.onUpdateModel
        })
      ]
    },

    getButtons () {
      const child = []

      this.cancel && child.push(
        h(QBtn, this.cancelProps)
      )

      this.ok && child.push(
        h(QBtn, this.okProps)
      )

      return h(QCardActions, {
        class: this.stackButtons === true ? 'items-end' : '',
        vertical: this.stackButtons,
        align: 'right'
      }, () => child)
    },

    getCardContent () {
      const child = []

      this.title && child.push(
        this.getSection('q-dialog__title', this.title)
      )

      this.progress !== false && child.push(
        h(
          QCardSection,
          { class: 'q-dialog__progress' },
          () => h(this.spinner.component, this.spinner.props)
        )
      )

      this.message && child.push(
        this.getSection('q-dialog__message', this.message)
      )

      if (this.prompt !== void 0) {
        child.push(
          h(
            QCardSection,
            { class: 'scroll q-dialog-plugin__form' },
            this.getPrompt
          )
        )
      }
      else if (this.options !== void 0) {
        child.push(
          h(QSeparator, { dark: this.isDark }),
          h(
            QCardSection,
            { class: 'scroll q-dialog-plugin__form' },
            this.getOptions
          ),
          h(QSeparator, { dark: this.isDark })
        )
      }

      if (this.ok || this.cancel) {
        child.push(this.getButtons())
      }

      return child
    },

    getContent () {
      return [
        h(QCard, {
          class: [
            this.classes,
            this.cardClass
          ],
          style: this.cardStyle,
          dark: this.isDark
        }, this.getCardContent)
      ]
    }
  },

  render () {
    return h(QDialog, {
      ref: 'dialog',
      onHide: this.onDialogHide
    }, this.getContent)
  }
})
