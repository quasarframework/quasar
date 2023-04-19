<template>
  <q-card flat bordered>
    <div class="q-pa-md text-center">
      <q-btn class="call-to-action-btn" label="Test me" style="width: 200px">
        <q-menu :fit="fit" :cover="cover" :anchor="anchor" :self="self" auto-close>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>New tab</q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section>New incognito tab</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable>
              <q-item-section>Recent tabs</q-item-section>
            </q-item>

            <q-item clickable>
              <q-item-section>History</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <q-separator />

    <div class="q-pt-sm">
      <div class="flex flex-center q-gutter-md">
        <q-toggle v-model="fit" label="Fit"></q-toggle>
        <q-toggle v-model="cover" label="Cover"></q-toggle>
      </div>
    </div>

    <q-card-section class="row" :class="cover ? 'justify-center' : ''">
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

      <div class="column items-center col-6" v-if="!cover">
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

    <doc-code lang="html" :code="menuExport" />
  </q-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

import DocCode from 'src/components/DocCode.vue'

const fit = ref(false)
const cover = ref(false)
const anchorOrigin = reactive({ vertical: 'bottom', horizontal: 'left' })
const selfOrigin = reactive({ vertical: 'top', horizontal: 'left' })

const anchor = computed(() => `${anchorOrigin.vertical} ${anchorOrigin.horizontal}`)
const self = computed(() => `${selfOrigin.vertical} ${selfOrigin.horizontal}`)
const menuExport = computed(() => {
  const props = cover.value === true
    ? `cover anchor="${anchor.value}"`
    : `${fit.value ? 'fit ' : ''}anchor="${anchor.value}" self="${self.value}"`

  return `<q-menu ${props}>
  <q-item clickable>
    <q-item-section>New tab</q-item-section>
  </q-item>
  <q-item clickable>
    <q-item-section>New incognito tab</q-item-section>
  </q-item>
</q-menu>`
})
</script>
