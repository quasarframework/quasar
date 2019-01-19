<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ marker.min }} to {{ marker.max }} (-6 to 10, step 2)
    </q-chip>

    <q-range
      v-model="marker"
      :min="-6"
      :max="10"
      :step="2"
      label
      snap
      markers
      color="orange"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      marker: {
        min: 6,
        max: 8
      }
    }
  }
}
</script>
