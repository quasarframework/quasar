<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox disable v-model="teal" label="One" />
      <q-checkbox disable v-model="orange" label="Two" />
      <q-checkbox disable v-model="red" label="Three" />
      <q-checkbox disable v-model="cyan" label="Four" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teal: true,
      orange: false,
      red: false,
      cyan: true
    }
  }
}
</script>
