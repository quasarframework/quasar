<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-checkbox v-model="teal" label="Teal" />
    </div>
    <div class="q-gutter-sm">
      <q-checkbox left-label v-model="orange" label="Orange" />
    </div>

    <div class="q-px-sm">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teal: true,
      orange: false
    }
  }
}
</script>
