<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary" multi-line>
        Model: "{{ model }}"
      </q-badge>

      <q-select
          filled
          v-model="model"
          :options="options"
          label="Multi with toggle"
          multiple
          emit-value
          map-options
      >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
          <q-item v-bind="itemProps">
            <q-item-section>
              <q-item-label v-html="opt.label" ></q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      model: ref([]),

      options: [
        {
          label: 'Google',
          value: 1
        },
        {
          label: 'Facebook',
          value: 2
        },
        {
          label: 'Twitter',
          value: 3
        },
        {
          label: 'Apple',
          value: 4
        },
        {
          label: 'Oracle',
          value: 5
        }
      ]
    }
  }
}
</script>
