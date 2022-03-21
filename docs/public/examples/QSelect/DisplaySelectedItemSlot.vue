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
        stack-label
        label="Standard"
      >
        <template v-slot:selected>
          Company:
          <q-chip
            v-if="model"
            dense
            square
            color="white"
            text-color="primary"
            class="q-my-none q-ml-xs q-mr-none"
          >
            <q-avatar color="primary" text-color="white" :icon="model.icon" />
            {{ model.label }}
          </q-chip>
          <q-badge v-else>*none*</q-badge>
        </template>
      </q-select>

      <q-select
        filled
        v-model="model"
        :options="options"
        stack-label
        label="Standard"
        color="secondary"
      >
        <template v-slot:selected-item="scope">
          <q-chip
            removable
            dense
            @remove="scope.removeAtIndex(scope.index)"
            :tabindex="scope.tabindex"
            color="white"
            text-color="secondary"
            class="q-ma-none"
          >
            <q-avatar color="secondary" text-color="white" :icon="scope.opt.icon" />
            {{ scope.opt.label }}
          </q-chip>
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
      model: ref({
        label: 'Google',
        value: 'goog',
        icon: 'mail'
      }),

      options: [
        {
          label: 'Google',
          value: 'goog',
          icon: 'mail'
        },
        {
          label: 'Facebook',
          value: 'fb',
          icon: 'bluetooth'
        },
        {
          label: 'Twitter',
          value: 'twt',
          icon: 'map'
        },
        {
          label: 'Apple',
          value: 'app',
          icon: 'golf_course'
        },
        {
          label: 'Oracle',
          value: 'ora',
          disable: true,
          icon: 'casino'
        }
      ]
    }
  }
}
</script>
