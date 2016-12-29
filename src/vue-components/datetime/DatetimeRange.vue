<template>
  <div>
    <q-datetime
      v-model="model.from"
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
    ></q-datetime>

    <q-datetime
      v-model="model.to"
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
    ></q-datetime>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      validator (val) {
        if (typeof val.from !== 'string' || typeof val.to !== 'string') {
          console.error('DatetimeRange requires a valid {min, max} model.')
          return false
        }
        return true
      },
      required: true
    },
    type: {
      type: String,
      default: 'date'
    },
    min: {
      type: String,
      default: ''
    },
    max: {
      type: String,
      default: ''
    },
    format: String,
    noClear: Boolean,
    clearLabel: {
      type: String,
      default: 'Clear'
    },
    okLabel: {
      type: String,
      default: 'Set'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    label: String,
    placeholder: String,
    staticLabel: String,
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
    }
  }
}
</script>
