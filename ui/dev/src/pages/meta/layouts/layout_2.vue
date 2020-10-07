<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar color="secondary" glossy>
        <q-toolbar-title>
          SECOND Layout
        </q-toolbar-title>
        <div class="text-caption">
          Quasar v{{ $q.version }}
        </div>
      </q-toolbar>
    </q-header>

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
