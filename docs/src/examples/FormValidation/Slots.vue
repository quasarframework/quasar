<template>
  <div class="q-pa-lg">
    <q-input
      ref="input"
      filled
      v-model="model"
      label="Type here"
      bottom-slots
      :error="!isValid">
      <div slot="error">
        Please use maximum 3 characters.
      </div>
    </q-input>
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
