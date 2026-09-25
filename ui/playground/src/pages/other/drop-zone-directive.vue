<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">v-drop-zone</div>
        <div class="row q-gutter-sm items-center">
          <q-toggle
            v-model="enabled"
            label="enabled (false disables in place)"
          />
          <q-toggle v-model="useSecond" label="swap handler" />
          <q-toggle v-model="images" label="object form: accept image/*" />
          <q-toggle v-model="customClass" label="object form: activeClass" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-md">
        <div
          v-drop-zone="enabled ? (useSecond ? onDropSecond : onDrop) : false"
          class="zone column flex-center"
        >
          single file
          <span class="text-caption">(has a child)</span>
        </div>
        <div v-drop-zone.multiple="onDrop" class="zone column flex-center">
          .multiple
        </div>
        <div
          v-drop-zone="{
            handler: onDrop,
            multiple: true,
            accept: images ? 'image/*' : void 0,
            maxFileSize: 100 * 1024,
            activeClass: customClass ? 'zone--custom' : void 0,
            onRejected
          }"
          class="zone column flex-center"
        >
          object form
          <span class="text-caption"
            >(100KB max{{ images ? ', images' : '' }})</span
          >
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <pre class="q-ma-none">{{ log.join('\n') || '(nothing yet)' }}</pre>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const enabled = ref(true)
const useSecond = ref(false)
const images = ref(false)
const customClass = ref(false)
const log = ref([])

function onDrop(files, evt) {
  log.value.unshift(
    `onDrop: ${files.map(file => file.name).join(', ') || '(no files)'}; types: ${[...evt.dataTransfer.types].join(', ')}`
  )
}

function onRejected(rejected) {
  log.value.unshift(
    `onRejected: ${rejected.map(entry => `${entry.file.name} (${entry.failedPropValidation})`).join(', ')}`
  )
}

function onDropSecond(files) {
  log.value.unshift(`onDropSecond: ${files.length} file(s)`)
}
</script>

<style lang="sass" scoped>
.zone
  width: 200px
  height: 120px
  border: 1px solid $grey-5
  &--custom
    background: rgba($primary, .15)
</style>
