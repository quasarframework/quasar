<template>
  <button class="quasar-progress-button" :class="{active: active, indeterminate: indeterminate}">
    <span
      v-if="!indeterminate"
      class="quasar-progress-button-filler"
      :class="{'quasar-progress-button-dark-filler': darkFiller}"
      :style="{width: computedPercentage}"
    ></span>
    <div
      class="quasar-progress-button-content"
      :class="state"
    >
      <div class="quasar-progress-button-error">
        <i>{{ errorIcon }}</i>
      </div>
      <div class="quasar-progress-button-label">
        <slot></slot>
      </div>
      <div class="quasar-progress-button-success">
        <i>{{ successIcon }}</i>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    percentage: {
      type: Number,
      required: true
    },
    errorIcon: {
      type: String,
      default: 'warning'
    },
    successIcon: {
      type: String,
      default: 'done'
    },
    darkFiller: {
      type: Boolean,
      default: false,
      coerce: Boolean
    },
    indeterminate: {
      type: Boolean,
      default: false,
      coerce: Boolean
    }
  },
  computed: {
    active () {
      return this.percentage > 0 && this.percentage < 100
    },
    state () {
      if (this.percentage >= 100) {
        return 'quasar-progress-button-complete'
      }
      if (this.percentage < 0) {
        return 'quasar-progress-button-incomplete'
      }
      return 'quasar-progress-button-default'
    },
    computedPercentage () {
      if (this.percentage >= 100) {
        return '0%'
      }

      return Math.max(0, this.percentage) + '%'
    }
  }
}
</script>
