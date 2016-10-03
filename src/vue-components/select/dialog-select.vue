<template>
  <div class="quasar-select cursor-pointer textfield" @click="pick" :class="{disabled: disable}">
    <span v-html="label"></span>
    <div class="float-right quasar-select-arrow caret-down"></div>
  </div>
</template>

<script>
import Dialog from '../../components/dialog/dialog'

let mapTypeConfig = {
  radio: 'radios',
  checkbox: 'checkboxes',
  toggle: 'toggles'
}

export default {
  props: {
    model: {
      required: true,
      twoWay: true
    },
    options: {
      type: Array,
      required: true,
      validator: options => {
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
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  computed: {
    label () {
      return this.placeholder || (this.type === 'radio' ? this.__getSingleLabel() : this.__getMultipleLabel())
    }
  },
  methods: {
    __getSingleLabel () {
      let option = this.options.find((option) => option.value === this.model)
      return option ? option.label : 'Select'
    },
    __getMultipleLabel () {
      let options = this.options
        .filter((option) => this.model.includes(option.value))
        .map((option) => option.label)

      if (options.length === 0) {
        return 'Select'
      }
      else if (options.length > 1) {
        return options[0] + ' and ' + (options.length - 1) + ' more'
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
      if (this.disable) {
        return
      }

      let
        self = this,
        mapHandler = this.type === 'radio' ? this.mapSingle : this.mapMultiple,
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

      config[mapTypeConfig[this.type]] = options

      Dialog.create(config).show()
    }
  }
}
</script>
