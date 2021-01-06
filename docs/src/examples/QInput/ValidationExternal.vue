<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      filled
      v-model="model"
      label="Type here"
      bottom-slots
      hint="Max 3 characters"
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
