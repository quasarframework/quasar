<template>
  <div class="row items-center q-col-gutter-md">
    <div class="col-xs-12 col-md-6" v-for="layout in list" :key="layout.name">
      <q-card flat bordered>
        <div class="row items-center no-wrap q-px-md q-py-sm">
          <div>{{ layout.name }}</div>
          <q-space />
          <q-btn :href="layout.demoLink" target="_blank" size="12px" flat round color="brand-primary" :icon="mdiOpenInNew" />
          <q-btn :href="layout.sourceLink" target="_blank" size="12px" flat round color="brand-primary" :icon="mdiCodeTags" />
        </div>

        <q-separator />

        <div class="overflow-hidden">
          <a :href="layout.demoLink" target="_blank">
            <q-img alt="Layout Screenshot" :src="layout.screenshot" :ratio="1.95" />
          </a>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { mdiCodeTags, mdiOpenInNew } from '@quasar/extras/mdi-v6'
import list from 'assets/layout-gallery.js'
</script>
