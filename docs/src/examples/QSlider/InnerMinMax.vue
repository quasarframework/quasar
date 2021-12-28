<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ value }} (0 to 50 w/ selection 10 to 35 or 15 to 40)
    </q-badge>

    <q-slider v-model="value" :min="0" :max="50" :inner-min="10" :inner-max="35" />
    <q-slider v-model="value" :min="0" :max="50" color="green" :inner-min="15" :inner-max="40" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 25
    }
  }
}
</script>
