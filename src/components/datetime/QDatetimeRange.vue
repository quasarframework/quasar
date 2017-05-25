<template>
  <div class="q-datetime-range">
    <q-datetime
      v-model="model.from"
      :default-selection="defaultFrom"
      :type="type"
      :min="min"
      :max="model.to || max"
      :format="format"
      :no-clear="noClear"
      :clear-label="clearLabel"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :float-label="floatLabel"
      :stack-label="stackLabel"
      :placeholder="placeholder"
      :disable="disable"
      :inverted="inverted"
      :dark="dark"
      :before="before"
      :after="after"
      :color="color"
      :align="align"
      :format24h="format24h"
      :monday-first="mondayFirst"
      class="inline"
      :class="className"
      :style="css"
    ></q-datetime>

    <q-datetime
      v-model="model.to"
      :default-selection="defaultTo"
      :type="type"
      :min="model.from || min"
      :max="max"
      :format="format"
      :no-clear="noClear"
      :clear-label="clearLabel"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :float-label="floatLabel"
      :stack-label="stackLabel"
      :placeholder="placeholder"
      :disable="disable"
      :inverted="inverted"
      :dark="dark"
      :before="before"
      :after="after"
      :color="color"
      :align="align"
      :format24h="format24h"
      :monday-first="mondayFirst"
      class="inline"
      :class="className"
      :style="css"
    ></q-datetime>
  </div>
</template>

<script>
import FrameMixin from '../input-frame/input-frame-mixin'
import extend from '../../utils/extend'
import { input, inline } from './datetime-props'
import QDatetime from './QDatetime.vue'

export default {
  name: 'q-datetime-range',
  mixins: [FrameMixin],
  components: {
    QDatetime
  },
  props: extend(
    input,
    inline,
    {
      value: {
        type: Object,
        validator: val => 'from' in val && 'to' in val,
        required: true
      },
      className: [String, Object],
      css: [String, Object],
      defaultFrom: [String, Number, Date],
      defaultTo: [String, Number, Date],
      color: String,
      disable: Boolean
    }
  ),
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
