<template>
  <label class="quasar-checkbox">
    <input type="checkbox" v-model="model">
    <div></div>
  </label>
</template>

<script>
  export default {
    props: {
      model: {
        type: Boolean,
        twoWay: true
      }
    }
  }
</script>
