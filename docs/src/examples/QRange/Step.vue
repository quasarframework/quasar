<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ step.min }} to {{ step.max }} (0 to 45, step 5)
    </q-chip>

    <q-range
      v-model="step"
      :min="0"
      :max="45"
      :step="5"
      label
      color="deep-orange"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      step: {
        min: 10,
        max: 20
      }
    }
  }
}
</script>
