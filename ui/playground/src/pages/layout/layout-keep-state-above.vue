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
          @click="toggleLeft"
        />

        <div class="q-ml-sm">
          {{ leftDrawerOpen }}
        </div>
        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div class="q-mx-sm">Quasar v{{ $q.version }}</div>
        <div class="q-mr-sm">{{ rightDrawerOpen }}</div>

        <q-btn
          flat
          dense
          round
          icon="settings"
          aria-label="settings"
          @click="toggleRight"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-list>
        <q-item-label header> Left drawer </q-item-label>
        <q-item-label header>
          This should be shown after resizing, as it has the show-if-above
          property
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" bordered side="right">
      <q-list>
        <q-item-label header> Right drawer </q-item-label>
        <q-item-label header>
          This should NOT be shown after resizing, as it DOES NOT HAVE the
          show-if-above property
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref } from 'vue'

defineOptions({ name: 'MainLayout' })

const $q = useQuasar()

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

function toggleLeft() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleRight() {
  rightDrawerOpen.value = !rightDrawerOpen.value
}
</script>
