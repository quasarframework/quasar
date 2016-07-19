<template>
  <button class="primary clear" @click="pick">
    {{{fixedLabel || label}}} &#8675
  </button>
</template>

<script>
import Dialog from '../../feats/dialog'

export default {
  props: {
    model: {
      required: true
    },
    options: {
      type: Array,
      required: true,
      validator: (options) => {
        return !options.some((option) => {
          return typeof option.label === 'undefined' || typeof option.value === 'undefined'
        })
      }
    },
    multiple: {
      type: Boolean,
      coerce: (value) => value ? true : false // eslint-disable-line no-unneeded-ternary
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
    fixedLabel: String
  },
  computed: {
    label () {
      return this.multiple ? this.getMultipleLabel() : this.getSingleLabel()
    }
  },
  methods: {
    getSingleLabel () {
      let option = this.options.find((option) => option.value === this.model)
      return option ? option.label : 'Select'
    },
    getMultipleLabel () {
      let options = this.options
        .filter((option) => this.model.includes(option.value))
        .map((option) => option.label)

      if (options.length === 0) {
        return 'Select'
      }
      else if (options.length > 1) {
        return options[0] + ', ...'
      }
      return options[0]
    },
    mapSingle (option) {
      option.selected = option.value === this.model
      return option
    },
    mapMultiple (option) {
      option.checked = this.model.includes(option.value)
      return option
    },
    pick () {
      let
        self = this,
        mapHandler = this.multiple ? this.mapMultiple : this.mapSingle,
        options = this.options.map(mapHandler.bind(this)),
        config = {
          title: self.title,
          message: self.message,
          buttons: [
            self.cancelLabel,
            {
              label: self.okLabel,
              handler (data) {
                self.model = data
              }
            }
          ]
        }

      config[this.multiple ? 'checkboxes' : 'radios'] = options

      Dialog(config)
    }
  }
}
</script>
