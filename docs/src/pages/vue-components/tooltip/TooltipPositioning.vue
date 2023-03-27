<template>
  <q-card flat bordered>
    <div class="q-pa-md text-center">
      <q-btn class="call-to-action-btn" label="Test me" style="width: 200px">
        <q-tooltip :anchor="anchor" :self="self">
          Here I am!
        </q-tooltip>
      </q-btn>
    </div>

    <q-separator />

    <q-card-section class="row">
      <div class="column items-center col-6">
        <div class="text-weight-bold">Anchor Origin</div>
        <div class="flex q-gutter-sm">
          <div class="column q-gutter-y-xs">
            <div class="text-center">Vertical</div>
            <q-radio dense v-model="anchorOrigin.vertical" val="top" label="Top" />
            <q-radio dense v-model="anchorOrigin.vertical" val="center" label="Center" />
            <q-radio dense v-model="anchorOrigin.vertical" val="bottom" label="Bottom" />
          </div>
          <div class="column q-gutter-y-xs">
            <div class="text-center">Horizontal</div>
            <q-radio dense v-model="anchorOrigin.horizontal" val="left" label="Left" />
            <q-radio dense v-model="anchorOrigin.horizontal" val="middle" label="Middle" />
            <q-radio dense v-model="anchorOrigin.horizontal" val="right" label="Right" />
            <q-radio dense v-model="anchorOrigin.horizontal" val="start" label="Start" />
            <q-radio dense v-model="anchorOrigin.horizontal" val="end" label="End" />
          </div>
        </div>
      </div>
      <div class="column items-center col-6">
        <div class="text-weight-bold">Self Origin</div>
        <div class="flex q-gutter-sm">
          <div class="column q-gutter-y-xs">
            <div class="text-center">Vertical</div>
            <q-radio dense v-model="selfOrigin.vertical" val="top" label="Top" />
            <q-radio dense v-model="selfOrigin.vertical" val="center" label="Center" />
            <q-radio dense v-model="selfOrigin.vertical" val="bottom" label="Bottom" />
          </div>
          <div class="column q-gutter-y-xs">
            <div class="text-center">Horizontal</div>
            <q-radio dense v-model="selfOrigin.horizontal" val="left" label="Left" />
            <q-radio dense v-model="selfOrigin.horizontal" val="middle" label="Middle" />
            <q-radio dense v-model="selfOrigin.horizontal" val="right" label="Right" />
            <q-radio dense v-model="selfOrigin.horizontal" val="start" label="Start" />
            <q-radio dense v-model="selfOrigin.horizontal" val="end" label="End" />
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <doc-code lang="html" :code="tooltipExport" />
  </q-card>
</template>

<script setup>
import { reactive, computed } from 'vue'

import DocCode from 'src/components/DocCode.vue'

const anchorOrigin = reactive({ vertical: 'bottom', horizontal: 'middle' })
const selfOrigin = reactive({ vertical: 'top', horizontal: 'middle' })

const anchor = computed(() => {
  return `${anchorOrigin.vertical} ${anchorOrigin.horizontal}`
})

const self = computed(() => {
  return `${selfOrigin.vertical} ${selfOrigin.horizontal}`
})

const tooltipExport = computed(() => {
  return `<q-tooltip anchor="${anchor.value}" self="${self.value}">
  Here I am!
</q-tooltip>`
})
</script>
