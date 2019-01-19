<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ rangeSnap.min }} to {{ rangeSnap.max }} (0 to 100, step 5)
    </q-chip>

    <q-range
      v-model="rangeSnap"
      :min="0"
      :max="100"
      :step="5"
      drag-range
      label
      markers
      snap
      color="lime"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      rangeSnap: {
        min: 35,
        max: 60
      }
    }
  }
}
</script>
