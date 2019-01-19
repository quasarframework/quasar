<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ snap.min }} to {{ snap.max }} (0 to 10, step 2)
    </q-chip>

    <q-range
      v-model="snap"
      :min="0"
      :max="10"
      :step="2"
      label
      snap
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      snap: {
        min: 2,
        max: 6
      }
    }
  }
}
</script>
