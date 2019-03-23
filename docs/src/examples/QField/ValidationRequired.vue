<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      ref="input"
      filled
      v-model="model"
      label="Required Field"
      :rules="[val => !!val || 'Field is required']"
    />

    <q-btn class="q-mt-sm" label="Reset Validation" @click="reset" color="primary"/>
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
