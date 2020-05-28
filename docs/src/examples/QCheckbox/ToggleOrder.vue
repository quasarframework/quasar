<template>
  <div class="q-pa-md">
    <q-btn class="q-mb-md" color="primary" label="Reset models" @click="resetModels" />

    <div class="q-gutter-sm">
      <q-checkbox v-model="teal" label="'tf' order" color="teal" />
      <q-checkbox toggle-order="ft" v-model="orange" label="'ft' order" color="orange" />
      <q-checkbox toggle-indeterminate v-model="red" label="'tf' order + toggle-indeterminate" color="red" />
      <q-checkbox toggle-indeterminate toggle-order="ft" v-model="cyan" label="'ft' order + toggle-indeterminate" color="cyan" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      teal: null,
      orange: null,
      red: true,
      cyan: false
    }
  },

  methods: {
    resetModels () {
      this.teal = null
      this.orange = null
      this.red = true
      this.cyan = false
    }
  }
}
</script>
