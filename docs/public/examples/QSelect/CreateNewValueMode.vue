<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <q-select
        label="Mode: 'add'"
        filled
        v-model="modelAdd"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add"
        style="width: 250px"
      />

      <q-select
        label="Mode: 'add-unique'"
        filled
        v-model="modelAddUnique"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        new-value-mode="add-unique"
        style="width: 250px"
      />

      <q-select
        label="Mode: 'toggle'"
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
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      modelAdd: ref(null),
      modelAddUnique: ref(null),
      modelToggle: ref(null)
    }
  }
}
</script>
