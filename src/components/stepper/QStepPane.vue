<template>
  <div class="q-stepper-pane" :class="{hidden: hidden}">
    <div v-if="active" class="q-stepper-inner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'q-step-pane',
  props: {
    step: {
      type: [Number, String],
      required: true
    }
  },
  inject: ['data'],
  computed: {
    active () {
      return this.data.step === this.step
    },
    hidden () {
      return !this.data.vertical && !this.active
    }
  }
}
</script>
