<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      filled
      v-model="model"
      label="Type here"
      bottom-slots
      :error="!isValid"
      hint="Max 3 characters"
    >
      <template v-slot:error>
        Please use maximum 3 characters.
      </template>
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
