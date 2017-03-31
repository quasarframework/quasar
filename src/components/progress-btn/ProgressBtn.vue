<template>
  <q-btn class="q-progress-btn" :class="{active: active, indeterminate: indeterminate}">
    <span
      v-if="!indeterminate"
      class="q-progress-btn-filler"
      :class="{'q-progress-btn-dark-filler': darkFiller}"
      :style="{width: computedPercentage}"
    ></span>
    <div
      class="q-progress-btn-content"
      :class="stateClass"
    >
      <div class="q-progress-btn-error">
        <q-icon :name="errorIcon"></q-icon>
      </div>
      <div class="q-progress-btn-label">
        <slot></slot>
      </div>
      <div class="q-progress-btn-success">
        <q-icon :name="successIcon"></q-icon>
      </div>
    </div>
  </q-btn>
</template>

<script>
export default {
  name: 'q-progress-btn',
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
        return 'q-progress-btn-complete'
      }
      if (this.percentage < 0) {
        return 'q-progress-btn-incomplete'
      }
      return 'q-progress-btn-default'
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
