<template>
  <div class="quasar-datetime-desktop">
    <quasar-popover :disable="disable">
      <div slot="target" class="cursor-pointer textfield" :class="{disabled: disable}">
        <span v-html="label"></span>
        <div class="float-right quasar-select-arrow caret-down"></div>
      </div>

      <quasar-inline-datetime :model.sync="model" :type="type"></quasar-inline-datetime>
    </quasar-popover>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    type: {
      type: String,
      default: 'date',
      twoWay: true
    },
    model: {
      type: String,
      required: true
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
  }
}
</script>
