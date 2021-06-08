<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar color="primary" glossy>
        <q-toolbar-title>
          First Layout
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
import { useMeta } from 'quasar'

export default {
  name: 'LayoutDefault',

  setup () {
    useMeta({
      title: 'LayoutDefault',
      titleTemplate: chunk => `${ chunk } - My Website`,
      meta: {
        // description: { name: 'description', content: 'Layout 1' }
        description: { template: chunk => `${ chunk } - Layout 1` }
      }
    })
  }
}
</script>
