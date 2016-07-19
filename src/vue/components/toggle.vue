<template>
  <label class="quasar-toggle" v-touch:pan-x="toggle">
    <input type="checkbox" v-model="model">
    <div></div>
  </label>
</template>

<script>
import $ from 'jquery'

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
        $(this.$el).find('input').click()
      }
    }
  }
}
</script>
