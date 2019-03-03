<template>
  <div class="q-pa-md">
    <q-select
      filled
      v-model="model"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      @new-value="createValue"
      style="width: 250px"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      model: null
    }
  },

  methods: {
    createValue (val, done) {
      // Calling done(var) toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/void 0/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      if (val.length > 0) {
        done(val)
      }
    }
  }
}
</script>
