<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ lazy }}
    </q-chip>
    <q-slider :value="lazy"
              @change="val => { lazy = val }"
              :min="0"
              :max="45"
              :step="5"
              color="purple"
              label/>
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
