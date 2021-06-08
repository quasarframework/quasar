<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn label="Click me" color="primary" @click="layout = true" />

    <q-dialog v-model="layout">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer class="bg-black text-white">
          <q-toolbar inset>
            <q-toolbar-title>Footer</q-toolbar-title>
          </q-toolbar>
        </q-footer>

        <q-drawer bordered v-model="drawer" :width="200" :breakpoint="600" class="bg-grey-3 q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>

        <q-drawer side="right" bordered v-model="drawerR" :width="200" :breakpoint="300" class="bg-grey-3 q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>

        <q-page-container>
          <q-page padding>
            <p v-for="n in contentSize" :key="n">
              {{ lorem }}
            </p>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  setup () {
    const moreContent = ref(true)

    return {
      layout: ref(false),

      moreContent,
      contentSize: computed(() => moreContent.value ? 150 : 5),
      drawer: ref(false),
      drawerR: ref(false),

      lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi dicta facilis corporis magnam, suscipit at quo nostrum!'
    }
  }
}
</script>
