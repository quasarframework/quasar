<template>
  <div>
    <div class="q-pa-md">
      <q-select
        label="Add value - @new-value"
        filled
        v-model="modelAdd"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        @new-value="createValue"
        style="width: 250px"
      />
    </div>

    <div class="q-pa-md">
      <q-select
        label="Add value - 'add' mode"
        filled
        v-model="modelToggle"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add"
        style="width: 250px"
      />
    <div>

    <div class="q-pa-md">
      <q-select
        label="Add value - 'add-unique' mode"
        filled
        v-model="modelToggle"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add-unique"
        style="width: 250px"
      />
    <div>

    <div class="q-pa-md">
      <q-select
        label="Add value - 'toggle' mode"
        filled
        v-model="modelToggle"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="toggle"
        style="width: 250px"
      />
    <div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modelAdd: null,
      modelToggle: null
    }
  },

  methods: {
    createValue (val, done) {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      done(val)
    }
  }
}
</script>
