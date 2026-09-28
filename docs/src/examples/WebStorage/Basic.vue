<template>
  <div class="q-pa-md q-gutter-y-md">
    <div>
      Pick a theme, then reload the page or open it in another tab: the choice
      is remembered and every tab follows it.
    </div>

    <q-btn-toggle
      v-model="myTheme"
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
      <q-badge :label="myTheme" />
    </div>

    <div class="q-gutter-sm">
      <q-btn
        no-caps
        outline
        color="primary"
        label="Assign 'dark'"
        @click="myTheme = 'dark'"
      />
      <q-btn
        no-caps
        outline
        color="primary"
        label="Assign null (back to the default)"
        :disable="myTheme === 'system'"
        @click="myTheme = null"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

const myTheme = $q.localStorage.useStorage('myTheme', {
  default: () => 'system'
})
</script>
