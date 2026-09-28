<template>
  <div class="q-pa-md q-gutter-y-md">
    <div>
      Pick a theme, then reload the page or open it in another tab: the choice
      is remembered and every tab follows it.
    </div>

    <q-btn-toggle
      v-model="theme"
      push
      glossy
      toggle-color="primary"
      no-caps
      :options="[
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' }
      ]"
    />

    <div>
      The storage item holds
      <q-badge :label="theme" />
    </div>

    <div class="q-gutter-sm">
      <q-btn
        no-caps
        outline
        color="primary"
        label="Store 'dark' through setItem()"
        @click="$q.localStorage.setItem('myTheme', 'dark')"
      />
      <q-btn
        no-caps
        outline
        color="primary"
        label="Remove the item (back to the default)"
        @click="$q.localStorage.removeItem('myTheme')"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const theme = $q.localStorage.useItem('myTheme', { default: 'system' })
</script>
