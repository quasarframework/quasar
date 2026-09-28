<template>
  <div class="q-pa-md q-gutter-y-md">
    <div>
      Type a name, then reload the page: it survives only while the toggle is
      on, as the ref is bound to the storage on your say-so.
    </div>

    <q-input v-model="name" label="Your name" outlined />

    <q-toggle v-model="remember" label="Remember my name" />

    <div>
      The storage item holds
      <q-badge :label="$q.localStorage.getItem('myName') ?? 'nothing'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const remember = ref(false)

const name = $q.localStorage.useStorage('myName', {
  default: '',
  disabled: () => remember.value !== true
})
</script>
