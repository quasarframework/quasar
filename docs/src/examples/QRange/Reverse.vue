<template>
  <div class="q-pa-md">
    <q-badge color="secondary">
      Model: {{ standard.min }} to {{ standard.max }} (0 to 50)
    </q-badge>

    <q-range
      reverse
      v-model="standard"
      :min="0"
      :max="50"
    />
    <q-range
      reverse
      v-model="standard"
      :min="0"
      :max="50"
      color="green"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      standard: {
        min: 5,
        max: 15
      }
    }
  }
}
</script>
