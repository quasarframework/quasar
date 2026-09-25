<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-toggle v-model="multiple" label="multiple" />
          <q-toggle v-model="images" label="accept image/*" />
          <q-toggle v-model="limit" label="maxFileSize 100KB" />
          <q-toggle v-model="disabled" label="disabled" />
          <q-toggle v-model="useSecond" label="target: second box" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-md">
        <div
          ref="first"
          class="zone column flex-center"
          :class="{ 'zone--over': isOverDropZone && !useSecond }"
        >
          first box
        </div>
        <div
          ref="second"
          class="zone column flex-center"
          :class="{ 'zone--over': isOverDropZone && useSecond }"
        >
          second box
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-sm">
        <q-btn flat label="resetDropZone()" @click="resetDropZone" />
        <q-btn flat label="stop()" @click="stop" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="q-gutter-sm">
          <q-badge :label="`isOverDropZone: ${isOverDropZone}`" />
          <q-badge :label="`dropped: ${droppedFiles.length}`" />
          <q-badge
            color="negative"
            :label="`rejected: ${rejectedFiles.length}`"
          />
        </div>
        <q-list dense v-if="droppedFiles.length !== 0" class="q-mt-sm">
          <q-item v-for="(file, index) in droppedFiles" :key="index">
            <q-item-section>{{ file.name }}</q-item-section>
            <q-item-section side>{{ file.size }} B</q-item-section>
          </q-item>
        </q-list>
        <q-list
          dense
          v-if="rejectedFiles.length !== 0"
          class="q-mt-sm text-negative"
        >
          <q-item v-for="(entry, index) in rejectedFiles" :key="index">
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
import { ref, useTemplateRef } from 'vue'
import { useDropZone } from 'quasar'

const first = useTemplateRef('first')
const second = useTemplateRef('second')

const multiple = ref(true)
const images = ref(false)
const limit = ref(false)
const disabled = ref(false)
const useSecond = ref(false)
const log = ref([])

const { isOverDropZone, droppedFiles, rejectedFiles, resetDropZone, stop } =
  useDropZone(() => ({
    target: useSecond.value ? second.value : first.value,
    disabled: disabled.value,
    multiple: multiple.value,
    accept: images.value ? 'image/*' : void 0,
    maxFileSize: limit.value ? 100 * 1024 : void 0,
    onDrop(files, evt) {
      log.value.unshift(
        `onDrop: ${files.length} file(s), types: ${[...evt.dataTransfer.types].join(', ')}`
      )
    },
    onRejected(rejected) {
      log.value.unshift(`onRejected: ${rejected.length} file(s)`)
    },
    onEnter() {
      log.value.unshift('onEnter')
    },
    onLeave() {
      log.value.unshift('onLeave')
    }
  }))
</script>

<style lang="sass" scoped>
.zone
  width: 200px
  height: 120px
  border: 2px dashed $grey-5
  &--over
    border-color: $primary
    background: rgba($primary, .1)
</style>
