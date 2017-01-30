<template>
  <q-picker-textfield
    :disable="disable"
    :readonly="readonly"
    :label="label"
    :placeholder="placeholder"
    :static-label="staticLabel"
    :value="actualValue"
    @click.native="pick"
    @keydown.native.enter="pick"
  ></q-picker-textfield>
</template>

<script>
import Dialog from '../../components/dialog/dialog'

export default {
  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator (options) {
        return !options.some(option =>
          typeof option.label === 'undefined' || typeof option.value === 'undefined'
        )
      }
    },
    type: {
      type: String,
      required: true,
      validator (value) {
        return ['radio', 'checkbox', 'toggle'].includes(value)
      }
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
    label: String,
    placeholder: String,
    staticLabel: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    actualValue () {
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

      Dialog.create({
        title: this.title,
        message: this.message,
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
    }
  }
}
</script>
