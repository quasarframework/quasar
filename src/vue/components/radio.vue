<template>
  <label class="quasar-radio">
    <input type="radio" v-model="model" :value="value">
    <div></div>
  </label>
</template>

<script>
export default {
  props: {
    model: {
      twoWay: true,
      required: true
    },
    value: {
      required: true
    }
  }
}
</script>
