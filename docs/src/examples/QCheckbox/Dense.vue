<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox dense v-model="teal" label="Teal" color="teal" />
      <q-checkbox dense v-model="orange" label="Orange" color="orange" />
      <q-checkbox dense v-model="red" label="Red" color="red" />
      <q-checkbox dense v-model="cyan" label="Cyan" color="cyan" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teal: true,
      orange: false,
      red: true,
      cyan: false
    }
  }
}
</script>
