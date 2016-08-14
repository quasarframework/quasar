<template>
  <label
    class="quasar-toggle"
    v-touch:pan="toggle"
    v-touch-options:pan="{ direction: 'horizontal' }"
  >
    <input type="checkbox" v-model="model">
    <div></div>
  </label>
</template>

<script>
export default {
  props: {
    model: {
      type: Boolean,
      twoWay: true,
      required: true
    }
  },
  methods: {
    toggle (event) {
      if (
        event.isFinal &&
        (this.model && event.deltaX < 0 || !this.model && event.deltaX > 0)
      ) {
        this.model = !this.model
      }
    }
  }
}
</script>
