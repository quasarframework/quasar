<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ standard.min }} to {{ standard.max }} (slider from 0 to 50 but selection is available from 10 to 35 or from 15 to 40)
    </q-badge>

    <q-range v-model="standard" :min="0" :max="50" :min-value="10" :max-value="35" />
    <q-range v-model="standard" :min="0" :max="50" color="green" :min-value="15" :max-value="40" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      standard: {
        min: 20,
        max: 25
      }
    }
  }
}
</script>
