<template>
  <button class="q-progress-button" :class="{active: active, indeterminate: indeterminate}">
    <span
      v-if="!indeterminate"
      class="q-progress-button-filler"
      :class="{'q-progress-button-dark-filler': darkFiller}"
      :style="{width: computedPercentage}"
    ></span>
    <div
      class="q-progress-button-content"
      :class="stateClass"
    >
      <div class="q-progress-button-error">
        <i>{{ errorIcon }}</i>
      </div>
      <div class="q-progress-button-label">
        <slot></slot>
      </div>
      <div class="q-progress-button-success">
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
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    active () {
      return this.percentage > 0 && this.percentage < 100
    },
    stateClass () {
      if (this.percentage >= 100) {
        return 'q-progress-button-complete'
      }
      if (this.percentage < 0) {
        return 'q-progress-button-incomplete'
      }
      return 'q-progress-button-default'
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
