<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ standard.min }} to {{ standard.max }} (0 to 50)
    </q-chip>

    <q-range
      v-model="standard"
      :min="0"
      :max="50"
    />
    <q-range
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
        min: 10,
        max: 35
      }
    }
  }
}
</script>
