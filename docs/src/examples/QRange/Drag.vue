<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ range.min }} to {{ range.max }} (0 to 100, step 1)
    </q-chip>

    <q-range
      v-model="range"
      :min="0"
      :max="100"
      label
      drag-range
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      range: {
        min: 20,
        max: 65
      }
    }
  }
}
</script>
