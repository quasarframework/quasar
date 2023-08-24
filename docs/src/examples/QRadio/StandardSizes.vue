<template>
  <div class="q-pa-md">
    <div class="q-gutter-sm">
      <q-radio size="xs" v-model="shape" val="xs" label="Size 'xs'" />
      <q-radio size="sm" v-model="shape" val="sm" label="Size 'sm'" />
      <q-radio size="md" v-model="shape" val="md" label="Size 'md'" />
      <q-radio size="lg" v-model="shape" val="lg" label="Size 'lg'" />
      <q-radio size="xl" v-model="shape" val="xl" label="Size 'xl'" />

      <!-- custom size -->
      <q-radio size="150px" v-model="shape" val="150px" label="Size '150px'" />
    </div>

    <div class="q-px-sm">
      Your selection is: <strong>{{ shape }}</strong>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      shape: ref('line')
    }
  }
}
</script>
