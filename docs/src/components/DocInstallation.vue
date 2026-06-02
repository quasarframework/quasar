<template>
  <q-card :id="id" class="doc-installation q-my-xl" flat bordered>
    <div class="header-toolbar row items-center">
      <DocCardTitle :title="props.title" />
    </div>

    <q-tabs
      class="header-tabs"
      v-model="currentTab"
      align="left"
      active-color="brand-primary"
      indicator-color="brand-primary"
      dense
      :breakpoint="0"
      shrink
    >
      <q-tab
        v-for="tab in tabList"
        :key="`installation-${tab.name}`"
        :name="tab.name"
        class="header-btn"
        no-caps
      >
        {{ tab.name }}
      </q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="currentTab" animated>
      <q-tab-panel
        v-for="tab in tabList"
        :key="`installation-panel-${tab.name}`"
        class="q-pa-none"
        :name="tab.name"
      >
        <div class="relative-position copybtn-hover">
          <div v-html="tab.html" />
          <CopyButton />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue'

import CopyButton from './CopyButton.vue'
import DocCardTitle from './DocCardTitle.vue'

import { slugify } from '@/assets/page-utils.js'

const props = defineProps({
  title: {
    type: String,
    default: 'Installation'
  },
  preRendered: {
    type: Object,
    required: true
  }
})

const tabList = computed(() => [
  { name: 'Quasar CLI', html: props.preRendered.quasarCli },
  { name: 'Vite plugin', html: props.preRendered.externalCli },
  { name: 'UMD', html: props.preRendered.umd }
])

const currentTab = ref('Quasar CLI')

const id = computed(() => slugify(props.title))
</script>
