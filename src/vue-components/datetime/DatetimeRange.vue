<template>
  <div class="q-datetime-range">
    <q-datetime
      v-model="model.from"
      :default-selection="defaultSelection"
      :type="type"
      :min="min"
      :max="model.to || max"
      :format="format"
      :no-clear="noClear"
      :clear-label="clearLabel"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :label="label"
      :placeholder="placeholder"
      :static-label="staticLabel"
      :readonly="readonly"
      :disable="disable"
      :class="className"
      :style="css"
    ></q-datetime>

    <q-datetime
      v-model="model.to"
      :default-selection="defaultSelection"
      :type="type"
      :min="model.from || min"
      :max="max"
      :format="format"
      :no-clear="noClear"
      :clear-label="clearLabel"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :label="label"
      :placeholder="placeholder"
      :static-label="staticLabel"
      :readonly="readonly"
      :disable="disable"
      :class="className"
      :style="css"
    ></q-datetime>
  </div>
</template>

<script>
import extend from '../../utils/extend'
import { input as props } from './datetime-props'

export default {
  props: extend({
    value: {
      type: Object,
      validator (val) {
        if (typeof val.from !== 'string' || typeof val.to !== 'string') {
          console.error('DatetimeRange requires a valid {from, to} model.')
          return false
        }
        return true
      },
      required: true
    },
    className: [String, Object],
    css: [String, Object]
  }, props),
  computed: {
    model: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
