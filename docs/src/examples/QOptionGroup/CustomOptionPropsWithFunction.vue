<template>
  <div class="q-pa-lg">
    <q-option-group v-model="group" :options="options" color="primary"
      :option-value="item => (item === null ? null : item.key)"
      :option-label="item => (item === null ? null : item.title)"
      :option-disable="item => (item === null ? null : item.inactive)" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      group: ref('op1'),

      options: [
        {
          title: 'Option 1',
          key: 'op1',
          inactive: false
        },
        {
          title: 'Option 2 (disabled)',
          key: 'op2',
          inactive: true
        },
        {
          title: 'Option 3',
          key: 'op3',
          inactive: false
        }
      ]
    }
  }
}
</script>
