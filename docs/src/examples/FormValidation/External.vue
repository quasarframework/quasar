<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input
      ref="input"
      filled
      v-model="model"
      label="Type here"
      bottom-slots
      error-message="Please use maximum 3 characters"
      :error="!isValid"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: ''
    }
  },
  computed: {
    isValid () {
      return this.model.length <= 3
    }
  }
}
</script>
