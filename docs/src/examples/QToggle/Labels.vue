<template>
  <div class="q-pa-md q-gutter-lg">
    <div>
      <q-toggle
        v-model="value"
        label="On Right"
      />

      <q-toggle
        v-model="value"
        color="green"
        label="On Right"
      />

      <q-toggle
        v-model="value"
        color="yellow"
        label="On Right"
      />

      <q-toggle
        v-model="value"
        color="red"
        label="On Right"
      />
    </div>

    <div>
      <q-toggle
        v-model="value"
        label="On Left"
        left-label
      />

      <q-toggle
        v-model="value"
        color="green"
        label="On Left"
        left-label
      />

      <q-toggle
        v-model="value"
        color="yellow"
        label="On Left"
        left-label
      />

      <q-toggle
        v-model="value"
        color="red"
        label="On Left"
        left-label
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      value: ref(true)
    }
  }
}
</script>
