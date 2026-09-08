<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      :vertical="$q.screen.lt.md"
      color="primary"
      animated
    >
      <q-step :name="1" title="Pick a plan" icon="settings" :done="step > 1">
        <q-option-group v-model="plan" :options="planOptions" color="primary" />

        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="2" title="Your details" icon="person" :done="step > 2">
        <q-input v-model="name" label="Name" filled style="max-width: 300px" />

        <q-stepper-navigation>
          <q-btn @click="step = 3" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Review" icon="check">
        Plan: {{ plan }}, name: {{ name || '(none)' }}

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
const plan = ref('basic')
const name = ref('')

const planOptions = [
  { label: 'Basic', value: 'basic' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' }
]
</script>
