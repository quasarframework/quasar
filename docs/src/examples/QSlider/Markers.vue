<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
      markers
      :min="0"
      :max="10"
    />
    <q-slider
      v-model="greenModel"
      color="green"
      markers
      :min="0"
      :max="10"
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
