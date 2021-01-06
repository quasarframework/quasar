<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>

        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="settings"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      show-if-above
    >
      <q-list>
        <q-item-label
          header
        >
          Left drawer
        </q-item-label>
        <q-item-label
          header
        >
          This should be shown after resizing, as it has the show-if-above property
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-drawer
      v-model="rightDrawerOpen"
      bordered
      side="right"
    >
      <q-list>
        <q-item-label
          header
        >
          Right drawer
        </q-item-label>
        <q-item-label
          header
        >
          This should NOT be shown after resizing, as it DOES NOT HAVE the show-if-above property
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',

  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false
    }
  }
}
</script>
