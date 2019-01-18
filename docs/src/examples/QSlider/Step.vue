<template>
  <div class="q-pa-md">
    <q-slider
      v-model="basicModel"
      :step="50"
    />
    <q-slider
      v-model="redModel"
      color="red"
      :step="50"
    />
    <q-slider
      v-model="greenModel"
      color="green"
      :min="0"
      :step="10"
      :max="50"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      basicModel: 50,
      redModel: 25,
      greenModel: 0
    }
  }
}
</script>
