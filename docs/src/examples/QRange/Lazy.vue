<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ lazy }}
    </q-chip>

    <q-range
      :value="lazy"
      :min="0"
      :max="50"
      label
      @change="val => { lazy = val }"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      lazy: {
        min: 10,
        max: 35
      }
    }
  }
}
</script>
