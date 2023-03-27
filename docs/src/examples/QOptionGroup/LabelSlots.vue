<template>
  <div class="q-pa-lg">
    <q-option-group
      v-model="group"
      type="checkbox"
      :options="options"
    >
      <template v-slot:label="opt">
        <div class="row items-center">
          <span class="text-teal">{{ opt.label }}</span>
          <q-icon :name="opt.icon" color="teal" size="1.5em" class="q-ml-sm" />
        </div>
      </template>

      <template v-slot:label-0="opt">
        <!-- custom label for option at index 0 -->
        <span class="text-weight-bold">{{ opt.label }}</span>
        <span> (has QTooltip)</span>
        <q-tooltip class="bg-primary" :offset="[0,0]">Tooltip</q-tooltip>
      </template>
    </q-option-group>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      group: ref(['op1']),

      options: [
        {
          value: 'op1',
          label: 'Good food',
          icon: 'restaurant_menu'
        },
        {
          value: 'op2',
          label: 'Good service',
          icon: 'room_service',
          color: 'teal'
        },
        {
          value: 'op3',
          label: 'Pleasant surroundings',
          icon: 'photo',
          color: 'teal'
        }
      ]
    }
  }
}
</script>
