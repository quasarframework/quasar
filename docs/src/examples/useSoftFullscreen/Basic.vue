<template>
  <div class="q-pa-md">
    <q-card
      ref="viewerRef"
      class="viewer column"
      :class="{ fullscreen: inFullscreen }"
    >
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Mountains</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          :icon="inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="toggleFullscreen"
        />
      </q-toolbar>

      <q-img
        src="https://cdn.quasar.dev/img/mountains.jpg"
        class="col"
        :ratio="inFullscreen ? void 0 : 16 / 9"
        fit="cover"
      >
        <div class="absolute-bottom text-subtitle2">
          {{
            inFullscreen
              ? 'Soft fullscreen: the photo fills the viewport'
              : 'Open the photo in soft fullscreen'
          }}
        </div>
      </q-img>
    </q-card>
  </div>
</template>

<script setup>
import { useTemplateRef } from 'vue'
import { useSoftFullscreen } from 'quasar'

const viewerRef = useTemplateRef('viewerRef') // a component: its root gets moved

const { inFullscreen, toggleFullscreen } = useSoftFullscreen({
  target: viewerRef
})
</script>
