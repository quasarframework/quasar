<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar color="secondary" glossy>
        <q-toolbar-title>
          Second Layout
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',
  meta: {
    // stopPropagation: true,
    title: 'Layout 2',
    link: {
      google: { template: chunk => `${chunk}/addition` }
    },
    bodyAttr: {
      layout: 2
    }
  }
}
</script>
