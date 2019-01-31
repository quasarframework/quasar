<template>
  <div class="q-pa-md">
    <q-badge color="secondary" class="q-mb-lg">
      Model: {{ lazy.min }} to {{ lazy.max }} (0 to 50, step 1)
    </q-badge>

    <q-range
      :value="lazy"
      @change="val => { lazy = val }"
      :min="0"
      :max="50"
      label
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
