<template>
  <q-card flat bordered>
    <div v-if="props.title" class="header-toolbar row items-center">
      <div class="doc-card-title q-my-xs q-mr-sm">{{ props.title }}</div>
    </div>

    <q-tabs v-if="props.tabs" class="header-tabs" v-model="currentTab" align="left" active-color="brand-primary" indicator-color="brand-primary" dense :breakpoint="0" shrink>
      <q-tab v-for="tab in props.tabs" :key="tab" :name="tab" class="header-btn" no-caps>
        {{ tab }}
      </q-tab>
    </q-tabs>

    <q-separator v-if="props.title || props.tabs" />

    <q-tab-panels v-if="props.tabs" v-model="currentTab" animated>
      <slot />
    </q-tab-panels>
    <div v-else class="relative-position">
      <slot />

    </div>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: String,
  tabs: Array
})

const currentTab = ref(props.tabs !== void 0 ? props.tabs[ 0 ] : null)
</script>
