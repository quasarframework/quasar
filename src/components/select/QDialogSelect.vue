<template>
  <q-input
    ref="input"
    type="dropdown"
    :disabled="disable"
    :readonly="readonly"
    :placeholder="placeholder"
    :value="actualValue"
    :float-label="floatLabel"
    :stacked-label="stackedLabel"
    :simple="simple"
    :align="align"
    @click="pick"
    @focus="$emit('focus')"
    @blur="__blur"
  />
</template>

<script>
import Dialog from '../dialog'
import { QInput } from '../input'

export default {
  name: 'q-dialog-select',
  components: {
    QInput
  },
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: v => v.every(o => 'label' in o && 'value' in o)
    },
    type: {
      type: String,
      required: true,
      validator: v => ['radio', 'checkbox', 'toggle'].includes(v)
    },
    okLabel: {
      type: String,
      default: 'OK'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      default: 'Select'
    },
    message: String,
    placeholder: String,
    staticLabel: String,
    floatLabel: String,
    stackedLabel: String,
    simple: Boolean,
    align: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    actualValue () {
      if (this.staticLabel) {
        return this.staticLabel
      }
      if (this.type === 'radio') {
        let option = this.options.find(option => option.value === this.value)
        return option ? option.label : ''
      }

      let options = this.options
        .filter(option => this.value.includes(option.value))
        .map(option => option.label)

      return !options.length ? '' : options.join(', ')
    },
    multipleSelection () {
      return ['checkbox', 'toggle'].includes(this.type)
    }
  },
  methods: {
    pick () {
      if (this.disable || this.readonly) {
        return
      }

      let options = this.options.map(option => {
        return {
          value: option.value,
          label: option.label,
          model: this.multipleSelection ? this.value.includes(option.value) : this.value === option.value
        }
      })

      const vm = Dialog.create({
        title: this.title,
        message: this.message,
        onDismiss: () => {
          this.dialogElement = null
        },
        form: {
          select: {type: this.type, model: this.value, items: options}
        },
        buttons: [
          this.cancelLabel,
          {
            label: this.okLabel,
            handler: data => {
              this.$emit('input', data.select)
            }
          }
        ]
      })

      this.dialogElement = vm.$el
    },

    __blur (e) {
      this.$emit('blur')
      setTimeout(() => {
        if (this.dialogElement && document.activeElement !== document.body && !this.dialogElement.contains(document.activeElement)) {
          this.close()
        }
      }, 1)
    }
  }
}
</script>
