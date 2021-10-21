<template>
  <q-layout view="hHh lpR fff">

    <q-header class="bg-lp-dark homepage-header">
      <q-toolbar class="q-py-sm q-px-md">
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          QUASAR
        </q-toolbar-title>
        <q-space />

        <div class="row items-center">
          <q-btn
            label="Home"
            color="white"
            flat
            class="q-py-sm q-px-md"
          />
          <q-btn
            label="Features"
            color="lp-light"
            flat
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Services"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Components"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Become sponsor"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="About"
            class="q-py-sm q-px-md"
          />
          <q-btn
            color="lp-light"
            flat
            label="Blog"
            class="q-py-sm q-px-md"
          />
          <q-btn flat round color="lp-primary" class="q-ml-sm" icon="search" padding="xs"/>
        </div>

      </q-toolbar>
      <q-separator color="lp-primary"/>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const tab = ref('tab1')

    return {
      tab
    }
  }
})
</script>
