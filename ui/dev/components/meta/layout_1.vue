<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar color="primary" glossy>
        <q-toolbar-title>
          First Layout
          <div slot="subtitle">
            Running on Quasar v{{ $q.version }}
          </div>
        </q-toolbar-title>
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
    title: 'LayoutDefault',
    titleTemplate: chunk => `${chunk} - My Website`,
    meta: {
      // description: { name: 'description', content: 'Layout 1' }
      description: { template: chunk => `${chunk} - Layout 1` }
    }
  }
}
</script>
