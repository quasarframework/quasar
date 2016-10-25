<template>
  <div class="quasar-datetime-desktop">
    <div ref="target" class="cursor-pointer textfield caret" :class="{disabled: disable, readonly: readonly}">
      <div v-html="label"></div>
    </div>
    <quasar-popover ref="popover" anchor-ref="target" :disable="disable || readonly">
      <quasar-inline-datetime v-model="model" :type="type"></quasar-inline-datetime>
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
      required: true
    },
    format: String,
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    readonly: Boolean,
    disable: Boolean
  },
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
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
  methods: {
    open () {
      if (!this.disabled && !this.readonly) {
        this.$refs.popover.open()
      }
    },
    close () {
      this.$refs.popover.close()
    }
  }
}
</script>
