<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ lazy }}
    </q-badge>

    <q-slider
      :value="lazy"
      @change="val => { lazy = val }"
      :min="0"
      :max="45"
      :step="5"
      color="purple"
      label
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      lazy: 6
    }
  }
}
</script>
