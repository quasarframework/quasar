<template>
  <div class="q-pa-md">
    <q-toggle
      v-model="value"
      color="primary"
      keep-color
    />

    <q-toggle
      v-model="value"
      color="green"
      keep-color
    />

    <q-toggle
      v-model="value"
      color="orange"
      keep-color
    />

    <q-toggle
      v-model="value"
      color="red"
      keep-color
      readonly
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: false
    }
  }
}
</script>
