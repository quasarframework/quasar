<template>
  <div class="q-pa-md" style="max-width: 350px">
    <div class="q-gutter-md">
      <div>
        <q-badge color="teal">Model: "{{ search }}"</q-badge>
      </div>

      <q-input
        v-model="search"
        debounce="500"
        filled
        placeholder="Search"
        hint="Debouncing 500ms"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-input
        v-model="search"
        debounce="1000"
        filled
        placeholder="Search"
        hint="Debouncing 1000ms"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      search: ref('')
    }
  }
}
</script>
