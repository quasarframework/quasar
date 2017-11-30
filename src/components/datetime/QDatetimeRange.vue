<template>
  <div class="q-datetime-range no-wrap" :class="classes">
    <q-datetime
      v-model="value.from"
      :default-selection="defaultFrom"
      :type="type"
      :min="min"
      :max="value.to || max"
      :format="format"
      :no-clear="noClear"
      :clear-label="clearLabel"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :float-label="floatLabel"
      :stack-label="stackLabel"
      :placeholder="placeholder"
      :disable="disable"
      :error="error"
      :inverted="inverted"
      :dark="dark"
      :before="before"
      :after="after"
      :color="color"
      :align="align"
      :format24h="format24h"
      :first-day-of-week="firstDayOfWeek"
      class="col q-datetime-range-left"
      :class="className"
      :style="css"
      @change="__onChange"
    ></q-datetime>

    <q-datetime
      v-model="value.to"
      :default-selection="defaultTo"
      :type="type"
      :min="value.from || min"
      :max="max"
      :format="format"
      :no-clear="noClear"
      :clear-label="clearLabel"
      :ok-label="okLabel"
      :cancel-label="cancelLabel"
      :float-label="floatLabelTo"
      :stack-label="stackLabelTo"
      :placeholder="placeholderTo"
      :disable="disable"
      :error="error"
      :inverted="inverted"
      :dark="dark"
      :before="before"
      :after="after"
      :color="color"
      :align="align"
      :format24h="format24h"
      :first-day-of-week="firstDayOfWeek"
      class="col q-datetime-range-right"
      :class="className"
      :style="css"
      @change="__onChange"
    ></q-datetime>
  </div>
</template>

<script>
import FrameMixin from '../../mixins/input-frame'
import extend from '../../utils/extend'
import { input, inline } from './datetime-props'
import QDatetime from './QDatetime'

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
      vertical: Boolean,
      floatLabelTo: String,
      stackLabelTo: String,
      placeholderTo: String
    }
  ),
  computed: {
    classes () {
      return this.vertical ? null : 'row'
    }
  },
  methods: {
    __onChange () {
      this.$nextTick(() => {
        this.$emit('input', this.value)
        this.$emit('change', this.value)
      })
    }
  }
}
</script>
