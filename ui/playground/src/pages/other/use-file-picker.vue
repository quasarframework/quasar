<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-toggle v-model="multiple" label="multiple" />
          <q-toggle v-model="images" label="accept image/*" />
          <q-toggle v-model="limit" label="maxFileSize 100KB" />
          <q-toggle v-model="capture" label="capture environment" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-sm">
        <q-btn color="primary" label="openFilePicker()" @click="pick" />
        <q-btn
          color="secondary"
          label="folder (override)"
          @click="openFilePicker({ directory: true, accept: void 0 })"
        />
        <q-btn
          color="accent"
          label="max 2 files (override)"
          @click="openFilePicker({ multiple: true, maxFiles: 2 })"
        />
        <q-btn flat label="resetFilePicker()" @click="resetFilePicker" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <q-badge :label="`picked: ${pickedFiles.length}`" />
          <q-badge
            color="negative"
            :label="`rejected: ${rejectedFiles.length}`"
          />
          <q-badge color="grey" :label="`last promise: ${lastResult}`" />
        </div>
        <q-list dense v-if="pickedFiles.length !== 0" class="q-mt-sm">
          <q-item
            v-for="file in pickedFiles"
            :key="file.webkitRelativePath || file.name"
          >
            <q-item-section>{{
              file.webkitRelativePath || file.name
            }}</q-item-section>
            <q-item-section side>{{ file.size }} B</q-item-section>
          </q-item>
        </q-list>
        <q-list
          dense
          v-if="rejectedFiles.length !== 0"
          class="q-mt-sm text-negative"
        >
          <q-item v-for="entry in rejectedFiles" :key="entry.file.name">
            <q-item-section>{{ entry.file.name }}</q-item-section>
            <q-item-section side>{{
              entry.failedPropValidation
            }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">hooks log</div>
        <pre class="q-ma-none">{{ log.join('\n') || '(nothing yet)' }}</pre>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFilePicker } from 'quasar'

const multiple = ref(true)
const images = ref(false)
const limit = ref(false)
const capture = ref(false)
const lastResult = ref('none')
const log = ref([])

const { pickedFiles, rejectedFiles, openFilePicker, resetFilePicker } =
  useFilePicker(() => ({
    multiple: multiple.value,
    accept: images.value ? 'image/*' : void 0,
    maxFileSize: limit.value ? 100 * 1024 : void 0,
    capture: capture.value ? 'environment' : void 0,
    onChange(files) {
      log.value.unshift(`onChange: ${files.length} file(s)`)
    },
    onRejected(rejected) {
      log.value.unshift(`onRejected: ${rejected.length} file(s)`)
    },
    onCancel() {
      log.value.unshift('onCancel')
    }
  }))

async function pick() {
  const result = await openFilePicker()
  lastResult.value = result === null ? 'null' : `${result.length} file(s)`
}
</script>
