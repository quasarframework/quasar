<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor v-model="editor" min-height="5rem" />

    <q-card flat bordered>
      <q-card-section>
        <pre style="white-space: pre-line">{{ editor }}</pre>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section v-html="editor" />
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const editor = ref('What you see is <b>what</b> you get.')
</script>
