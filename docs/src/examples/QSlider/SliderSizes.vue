<template>
  <div class="q-px-lg q-py-md">
    <q-slider
      v-model="model"
      :min="0"
      :max="10"
      color="green"
      track-size="10px"
      thumb-color="black"
      markers
    />

    <q-slider
      v-model="model"
      :min="0"
      :max="10"
      color="green"
      thumb-size="35px"
      markers
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: 2
    }
  }
}
</script>
