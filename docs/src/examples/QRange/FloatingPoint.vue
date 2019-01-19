<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ precision.min }} to {{ precision.max }} (0.1 to 1.5)
    </q-chip>
    <q-range
      v-model="precision"
      :min="0.1"
      :max="1.5"
      :step="0.1"
      :decimals="1"
      color="green"
    />

    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ zeroPrecision.min }} to {{ zeroPrecision.max }} (0.1 to 1.5)
    </q-chip>
    <q-range
      v-model="zeroPrecision"
      :min="0.1"
      :max="1.5"
      :step="0"
      :decimals="1"
      color="amber"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      precision: {
        min: 0.2,
        max: 0.7
      },
      zeroPrecision: {
        min: 0.2,
        max: 0.7
      }
    }
  }
}
</script>
