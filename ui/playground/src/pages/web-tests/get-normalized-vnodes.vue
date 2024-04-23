<template>
  <div class="q-layout-padding q-pa-md q-gutter-y-md">
    <q-stepper v-model="step1" header-nav>
      <template v-for="step in steps" :key="step.value">
        <q-step :name="step.value + '-1'" :title="step.label + ' - 1'">
          Step content 1 for {{ step }}.
        </q-step>
      </template>
    </q-stepper>

    <q-stepper v-model="step2" header-nav>
      <template v-for="step in steps" :key="step.value">
        <q-step :name="step.value + '-1'" :title="step.label + ' - 1'">
          Step content 1 for {{ step }}.
        </q-step>
        <q-step :name="step.value + '-2'" :title="step.label + ' - 2'">
          Step content 2 for {{ step }}.
        </q-step>
      </template>
    </q-stepper>

    <q-breadcrumbs class="text-teal">
      <template v-for="step in steps" :key="step.value">
        <q-breadcrumbs-el :label="step.label" />
      </template>
    </q-breadcrumbs>

    <q-breadcrumbs class="text-teal">
      <template v-for="step in steps" :key="step.value">
        <q-breadcrumbs-el :label="step.label + ' - 1'" />
        <q-breadcrumbs-el :label="step.label + ' - 2'" />
      </template>
    </q-breadcrumbs>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      step1: ref(null),
      step2: ref(null),
      steps: [
        { label: 'Step 1', value: 'STEP001' },
        { label: 'Step 2', value: 'STEP002' }
      ]
    }
  }
}
</script>
