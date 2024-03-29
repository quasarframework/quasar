<template>
  <div>
    <div class="column items-center q-mt-lg q-gutter-y-md">
      <q-btn color="positive" label="Sync <script setup>" @click="openSync" />
      <q-btn color="negative" label="Async <script setup>" @click="openAsync" />
      <q-btn
        color="grey"
        label="Async <script setup> (workaround)"
        @click="openAsyncWorkaround"
      />
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { Dialog } from 'quasar'
import TestDialog from './dialog/TestDialog.vue'

function openSync () {
  Dialog.create({
    component: TestDialog
  })
}

function openAsync () {
  Dialog.create({
    component: defineAsyncComponent(() =>
      import('./dialog/TestDialog.vue')
    )
  })
}

async function openAsyncWorkaround () {
  Dialog.create({
    component: await defineAsyncComponent(() =>
      import('./dialog/TestDialog.vue')
    ).__asyncLoader()
  })
}
</script>
