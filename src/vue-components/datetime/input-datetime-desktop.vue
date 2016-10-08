<template>
  <div class="quasar-datetime-desktop">
    <quasar-popover :disable="disable">
      <div slot="target" class="cursor-pointer textfield" :class="{disabled: disable}">
        <span v-html="label"></span>
        <div class="float-right quasar-select-arrow caret-down"></div>
      </div>

      <quasar-inline-datetime :value="model" @input="__updateValue" :type="type"></quasar-inline-datetime>
    </quasar-popover>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    type: {
      type: String,
      default: 'date'
    },
    value: {
      type: String,
      required: true,
      default: moment().format()
    },
    format: {
      type: String
    },
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    disable: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  computed: {
    label () {
      let format

      if (this.format) {
        format = this.format
      }
      else if (this.type === 'date') {
        format = 'YYYY-MM-DD'
      }
      else if (this.type === 'time') {
        format = 'HH:mm'
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss'
      }

      return moment(this.model).format(format)
    }
  },
  method: {
    __updateValue (value) {
      this.$emit('input', value)
    }
  }
}
</script>
