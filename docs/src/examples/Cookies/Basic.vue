<template>
  <div class="q-pa-md q-gutter-y-md">
    <div>
      Pick a theme, then reload the page: the cookie remembers the choice for a
      month. In a browser with the Cookie Store API, another tab of the site
      follows it too.
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
      The cookie holds
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

const myTheme = $q.cookies.useCookie('myTheme', {
  default: () => 'system',
  expires: '30d'
})
</script>
