<template>
  <div class="q-pa-md">
    <q-chip
      square
      color="secondary"
      text-color="white"
    >
      Model: {{ dark.min }} to {{ dark.max }} (0 to 50)
    </q-chip>

    <q-range
      v-model="dark"
      :min="0"
      :max="50"
    />
    <q-range
      v-model="dark"
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
      dark: {
        min: 10,
        max: 35
      }
    }
  }
}
</script>
