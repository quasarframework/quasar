<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
    />

    <q-slider
      v-model="greenModel"
      color="green"
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
