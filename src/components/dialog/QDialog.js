import { QModal } from '../modal'
import { QInput } from '../input'
import { QProgress } from '../progress'
import { QBtn } from '../btn'
import { QOptionGroup } from '../option-group'
import ModelToggleMixin from '../../mixins/model-toggle'
import inputTypes from '../input/input-types'

export default {
  name: 'q-dialog',
  mixins: [ModelToggleMixin],
  props: {
    title: String,
    message: String,
    form: Array,
    stackButtons: Boolean,
    noButtons: Boolean,
    progress: Object,
    noBackdropDismiss: Boolean,
    noEscDismiss: Boolean,
    position: String
  },
  render (h) {
    const
      child = [],
      title = this.$slots.title || this.title,
      msg = this.$slots.message || this.message

    if (title) {
      child.push(
        h('div', {
          staticClass: 'modal-header'
        }, [ title ])
      )
    }
    if (msg) {
      child.push(
        h('div', {
          staticClass: 'modal-body modal-scroll'
        }, [ msg ])
      )
    }

    if (this.form) {
      child.push(
        h('div', {
          staticClass: 'modal-body modal-scroll'
        }, this.__getForm(h))
      )
    }
    else if (this.$slots.default) {
      child.push(
        h('div', {
          staticClass: 'modal-body modal-scroll'
        }, [ this.$slots.default ])
      )
    }

    if (this.progress) {
      child.push(h('div', {
        staticClass: 'modal-body'
      }, [
        h(QProgress, {
          props: {
            percentage: this.progress.model,
            color: this.progress.color || 'primary',
            animate: true,
            stripe: true,
            indeterminate: this.progress.indeterminate
          }
        }),
        this.progress.indeterminate
          ? null
          : h('span', [ `${this.progress.model}%` ])
      ]))
    }

    if (this.$scopedSlots.buttons) {
      child.push(
        h('div', {
          staticClass: 'modal-buttons',
          'class': {
            row: !this.stackButtons,
            column: this.stackButtons
          }
        }, [
          this.$scopedSlots.buttons({
            ok: this.__onOk,
            cancel: this.hide
          })
        ])
      )
    }
    else if (!this.noButtons) {
      child.push(h('div', {
        staticClass: 'modal-buttons row'
      }, [
        h(QBtn, {
          props: { flat: true, label: 'OK' },
          on: { click: this.hide }
        })
      ]))
    }

    return h(QModal, {
      ref: 'dialog',
      props: {
        minimized: true,
        noBackdropDismiss: this.noBackdropDismiss,
        noEscDismiss: this.noEscDismiss,
        position: this.position
      },
      on: {
        dismiss: () => {
          this.hide().then(() => this.$emit('dismiss'))
        },
        'escape-key': () => {
          this.hide().then(() => this.$emit('escape-key'))
        }
      }
    }, child)
  },
  methods: {
    show () {
      if (this.showing) {
        return Promise.resolve()
      }

      return this.$refs.dialog.show().then(() => {
        this.$emit('show')
        this.__updateModel(true)

        if (!this.$q.platform.is.desktop) {
          return
        }

        const node = this.$refs.dialog.$el.getElementsByTagName(this.form ? 'INPUT' : 'BUTTON')
        if (!node.length) {
          return
        }

        if (this.form) {
          node[0].focus()
        }
        else {
          node[node.length - 1].focus()
        }
      })
    },
    hide () {
      if (this.showing) {
        return this.$refs.dialog.hide().then(() => {
          const data = this.__getFormData()
          this.$emit('hide', data)
          this.__updateModel(false)
          return data
        })
      }
      return Promise.resolve()
    },
    __getForm (h) {
      return this.form.map(el => {
        if (el.type === 'heading') {
          return h('h6', [ el.label ])
        }
        if (inputTypes.includes(el.type)) {
          return h(QInput, {
            style: 'margin-bottom: 10px',
            props: {
              value: el.model,
              type: el.type,
              color: el.color,
              dark: el.dark,
              placeholder: el.placeholder,
              floatLabel: el.label,
              noPassToggle: el.noPassToggle
            },
            on: {
              change: v => { el.model = v }
            }
          })
        }
        if (['radio', 'checkbox', 'toggle'].includes(el.type)) {
          return h(QOptionGroup, {
            props: {
              value: el.model,
              type: el.type,
              color: el.color,
              dark: el.dark,
              options: el.items,
              inline: el.inline,
              keepColor: el.keepColor
            },
            on: {
              change: v => { el.model = v }
            }
          })
        }
      })
    },
    __onOk (handler, preventClose) {
      if (typeof handler !== 'function') {
        this.hide()
        return
      }

      const data = this.__getFormData()

      if (preventClose) {
        handler(data, this.hide)
      }
      else {
        this.hide().then(() => { handler(data) })
      }
    },
    __getFormData () {
      if (!this.form) {
        return
      }

      let data = {}

      this.form.forEach(el => {
        if (el.name && el.type !== 'heading') {
          data[el.name] = el.model
        }
      })

      return data
    }
  }
}
