<template>
  <div class="q-pa-md">
    <q-select
      label="Allows duplicates"
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
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref(null),
      createValue (val, done) {
        // specific logic to eventually call done(...) -- or not
        done(val)

        // done callback has two optional parameters:
        //  - the value to be added
        //  - the behavior (same values of new-value-mode prop,
        //    and when it is specified it overrides that prop –
        //    if it is used); default behavior (if not using
        //    new-value-mode) is to add the value even if it would
        //    be a duplicate
      }
    }
  }
}
</script>
