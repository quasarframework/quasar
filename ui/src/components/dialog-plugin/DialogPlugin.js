import Vue from 'vue'

import QDialog from '../dialog/QDialog.js'
import QBtn from '../btn/QBtn.js'

import clone from '../../utils/clone.js'

import QCard from '../card/QCard.js'
import QCardSection from '../card/QCardSection.js'
import QCardActions from '../card/QCardActions.js'

import QInput from '../input/QInput.js'
import QOptionGroup from '../option-group/QOptionGroup.js'

export default Vue.extend({
  name: 'DialogPlugin',

  inheritAttrs: false,

  props: {
    title: String,
    message: String,
    prompt: Object,
    options: Object,

    html: Boolean,

    ok: {
      type: [String, Object, Boolean],
      default: true
    },
    cancel: [String, Object, Boolean],

    stackButtons: Boolean,
    color: String,

    cardClass: [String, Array, Object],
    cardStyle: [String, Array, Object],

    dark: Boolean
  },

  computed: {
    hasForm () {
      return this.prompt || this.options
    },

    okLabel () {
      return this.ok === true
        ? this.$q.lang.label.ok
        : this.ok
    },

    cancelLabel () {
      return this.cancel === true
        ? this.$q.lang.label.cancel
        : this.cancel
    },

    vmColor () {
      return this.color || (this.dark === true ? 'amber' : 'primary')
    },

    okProps () {
      return Object(this.ok) === this.ok
        ? {
          color: this.vmColor,
          label: this.$q.lang.label.ok,
          ripple: false,
          ...this.ok
        }
        : {
          color: this.vmColor,
          flat: true,
          label: this.okLabel,
          ripple: false
        }
    },

    cancelProps () {
      return Object(this.cancel) === this.cancel
        ? {
          color: this.vmColor,
          label: this.$q.lang.label.cancel,
          ripple: false,
          ...this.cancel
        }
        : {
          color: this.vmColor,
          flat: true,
          label: this.cancelLabel,
          ripple: false
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

    getPrompt (h) {
      return [
        h(QInput, {
          props: {
            value: this.prompt.model,
            type: this.prompt.type || 'text',
            color: this.vmColor,
            dense: true,
            autofocus: true,
            dark: this.dark
          },
          on: {
            input: v => { this.prompt.model = v },
            keyup: evt => {
              // if ENTER key
              if (this.prompt.type !== 'textarea' && evt.keyCode === 13) {
                this.onOk()
              }
            }
          }
        })
      ]
    },

    getOptions (h) {
      return [
        h(QOptionGroup, {
          props: {
            value: this.options.model,
            type: this.options.type,
            color: this.vmColor,
            inline: this.options.inline,
            options: this.options.items,
            dark: this.dark
          },
          on: {
            input: v => { this.options.model = v }
          }
        })
      ]
    },

    getButtons (h) {
      const child = []

      if (this.cancel) {
        child.push(h(QBtn, {
          props: this.cancelProps,
          attrs: { autofocus: !this.prompt && !this.ok },
          on: { click: this.onCancel }
        }))
      }
      if (this.ok) {
        child.push(h(QBtn, {
          props: this.okProps,
          attrs: { autofocus: !this.prompt },
          on: { click: this.onOk }
        }))
      }

      if (child.length > 0) {
        return h(QCardActions, {
          staticClass: this.stackButtons === true ? 'items-end' : null,
          props: {
            vertical: this.stackButtons,
            align: 'right'
          }
        }, child)
      }
    },

    onOk () {
      this.$emit('ok', clone(this.getData()))
      this.hide()
    },

    onCancel () {
      this.hide()
    },

    getData () {
      if (this.prompt) {
        return this.prompt.model
      }
      if (this.options) {
        return this.options.model
      }
    },

    getSection (h, staticClass, text) {
      return this.html === true
        ? h(QCardSection, {
          staticClass,
          domProps: {
            innerHTML: text
          }
        })
        : h(QCardSection, { staticClass }, [ text ])
    }
  },

  render (h) {
    const child = []

    if (this.title) {
      child.push(
        this.getSection(h, 'q-dialog__title', this.title)
      )
    }

    if (this.message) {
      child.push(
        this.getSection(h, 'q-dialog__message scroll', this.message)
      )
    }

    if (this.hasForm) {
      child.push(
        h(
          QCardSection,
          { staticClass: 'scroll' },
          this.prompt ? this.getPrompt(h) : this.getOptions(h)
        )
      )
    }

    if (this.ok || this.cancel) {
      child.push(this.getButtons(h))
    }

    return h(QDialog, {
      ref: 'dialog',

      props: {
        ...this.$attrs,
        value: this.value
      },

      on: {
        hide: () => {
          this.$emit('hide')
        }
      }
    }, [
      h(QCard, {
        staticClass: 'q-dialog-plugin' +
          (this.dark === true ? ' q-dialog-plugin--dark' : ''),
        style: this.cardStyle,
        class: this.cardClass,
        props: {
          dark: this.dark
        }
      }, child)
    ])
  }
})
