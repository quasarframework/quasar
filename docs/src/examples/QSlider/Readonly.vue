<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
      readonly
    />
    <q-slider
      v-model="greenModel"
      color="green"
      readonly
      :min="0"
      :max="50"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      basicModel: 2,
      greenModel: 0
    }
  }
}
</script>
