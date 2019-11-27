<template>
  <div class="q-pa-md">
    <q-input
      v-model.number="model"
      type="number"
      filled
      style="max-width: 200px"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 10
    }
  }
}
</script>
