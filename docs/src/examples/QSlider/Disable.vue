<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
      disable
    />

    <q-slider
      v-model="greenModel"
      color="green"
      disable
      :min="0"
      :max="50"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      basicModel: 40,
      greenModel: 10
    }
  }
}
</script>
