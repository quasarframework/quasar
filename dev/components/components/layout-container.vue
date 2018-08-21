<template>
  <div class="layout-padding">
    <q-btn @click="modal = true" label="Open" />

    <q-layout view="LHh lpR fff" container style="height: 500px; width: 300px" class="q-mt-xl shadow-2">
      <q-layout-header reveal>
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
        </q-toolbar>
      </q-layout-header>

      <q-layout-footer reveal>
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Footer</q-toolbar-title>
        </q-toolbar>
      </q-layout-footer>

      <q-layout-drawer v-model="drawer" :width="200" :breakpoint="300">
        <div v-for="n in 50" :key="n">Drawer</div>
      </q-layout-drawer>
      <q-page-container>
        <q-page style="padding-top: 50px">
          <div v-for="n in 50" :key="n">My page My page My page My page My page My page My page My page My page</div>

          <q-page-sticky position="top-left" :offset="[18, 58]">
            <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
          </q-page-sticky>
          <q-page-sticky position="top-right" :offset="[18, 58]">
            <q-btn round color="primary" icon="arrow_upward" class="rotate-45" />
          </q-page-sticky>
          <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-btn round color="primary" icon="arrow_forward" class="rotate-135" />
          </q-page-sticky>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn round color="primary" icon="arrow_forward" class="rotate-45" />
          </q-page-sticky>

          <q-page-sticky position="top" expand>
            <q-toolbar>
              <q-btn flat round dense icon="map" />
              <q-toolbar-title>Title</q-toolbar-title>
            </q-toolbar>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>

    <q-modal v-model="modal" no-backdrop-dismiss>
      <q-layout view="LHh lpR fff" container style="min-height: 60vh; min-width: 60vw;">
        <q-layout-header reveal>
          <q-toolbar>
            <q-btn flat @click="drawer2 = !drawer2" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="modal = false" round dense icon="close" />
          </q-toolbar>
        </q-layout-header>

        <q-layout-footer reveal>
          <q-toolbar>
            <q-btn flat @click="drawer2 = !drawer2" round dense icon="menu" />
            <q-toolbar-title>Footer</q-toolbar-title>
          </q-toolbar>
        </q-layout-footer>

        <q-layout-drawer v-model="drawer2" :width="200" :breakpoint="900">
          <div v-for="n in 50" :key="n">Drawer</div>
        </q-layout-drawer>

        <q-page-container>
          <q-page style="padding-top: 50px">
            <div v-for="n in 50" :key="n">My page</div>

            <q-page-sticky position="top-left" :offset="[18, 58]">
              <q-btn round color="primary" icon="arrow_back" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="top-right" :offset="[18, 58]">
              <q-btn round color="primary" icon="arrow_upward" class="rotate-45" />
            </q-page-sticky>
            <q-page-sticky position="bottom-left" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-135" />
            </q-page-sticky>
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
              <q-btn round color="primary" icon="arrow_forward" class="rotate-45" />
            </q-page-sticky>

            <q-page-sticky position="top" expand>
              <q-toolbar>
                <q-btn flat round dense icon="map" />
                <q-toolbar-title>Title</q-toolbar-title>
              </q-toolbar>
            </q-page-sticky>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-modal>

    <q-btn @click="modal = true" label="Open" class="q-my-xl" />
    <div v-for="n in 50" :key="n">Some text</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modal: false,
      drawer: false,
      drawer2: false
    }
  },
  methods: {
  }
}
</script>
