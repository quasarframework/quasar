<template>
  <div class="q-pa-md">
    Drag Only Range (Fixed Interval)
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ onlyRange.min }} to {{ onlyRange.max }} (0 to 100, step 5)
    </q-chip>

    <q-range
      v-model="onlyRange"
      :min="0"
      :max="100"
      :step="5"
      drag-only-range
      label
      color="info"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      onlyRange: {
        min: 10,
        max: 35
      }
    }
  }
}
</script>
