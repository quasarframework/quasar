<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="input"
      filled
      v-model="model"
      label="Required Field"
      :rules="[val => !!val || 'Field is required']"
    />
    <q-btn label="Reset" @click="reset" color="primary"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ''
    }
  },
  methods: {
    reset () {
      this.$refs.input.resetValidation()
    }
  }
}
</script>
