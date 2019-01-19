<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ label.min }} to {{ label.max }} (-20 to 20, step 4)
    </q-chip>
    <q-range
      v-model="label"
      :min="-20"
      :max="20"
      :step="4"
      label
      color="purple"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      label: {
        min: -12,
        max: 8
      }
    }
  }
}
</script>
