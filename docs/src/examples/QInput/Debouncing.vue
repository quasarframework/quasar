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
        <q-icon slot="append" name="search" />
      </q-input>

      <q-input
        v-model="search"
        debounce="1000"
        filled
        placeholder="Search"
        hint="Debouncing 1000ms"
      >
        <q-icon slot="append" name="search" />
      </q-input>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  }
}
</script>
