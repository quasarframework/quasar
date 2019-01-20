<template>
  <div class="q-pa-md">
    <q-range
      v-model="standard"
      color="secondary"
      :min="0"
      :max="50"
      disable
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      standard: {
        min: 10,
        max: 35
      }
    }
  }
}
</script>
