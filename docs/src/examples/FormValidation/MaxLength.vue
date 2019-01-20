<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="input"
      filled
      v-model="model"
      label="Maximum 3 characters"
      :rules="[ val => val.length <= 3 || 'Please use maximum 3 characters']"
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
