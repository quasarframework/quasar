<template>
  <div
    class="quasar-select cursor-pointer textfield caret"
    @click="pick"
    :class="{disabled: disable, readonly: readonly}"
  >
    <div v-html="label"></div>
  </div>
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
    placeholder: String,
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    label () {
      return this.placeholder || (this.multiple ? this.__getMultipleLabel() : this.__getSingleLabel())
    },
    multiple () {
      return this.type !== 'radio'
    }
  },
  methods: {
    __getSingleLabel () {
      let option = this.options.find(option => option.value === this.value)
      return option ? option.label : 'Select'
    },
    __getMultipleLabel () {
      let options = this.options
        .filter(option => this.value.includes(option.value))
        .map(option => option.label)

      if (options.length === 0) {
        return 'Select'
      }
      else if (options.length > 1) {
        return options[0] + ' and ' + (options.length - 1) + ' more'
      }
      return options[0]
    },
    pick () {
      if (this.disable || this.readonly) {
        return
      }

      let
        self = this,
        options = this.options.map(option => {
          return {
            value: option.value,
            label: option.label,
            model: this.value.includes(option.value)
          }
        })

      Dialog.create({
        title: self.title,
        message: self.message,
        form: {
          select: {type: self.type, model: self.value, items: options}
        },
        buttons: [
          self.cancelLabel,
          {
            label: self.okLabel,
            handler (data) {
              self.$emit('input', data.select)
            }
          }
        ]
      })
    }
  }
}
</script>
