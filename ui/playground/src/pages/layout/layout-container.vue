<template>
  <div class="q-layout-padding">
    <q-btn @click="modal = true" label="Open" />

    <q-layout view="Lhh lpR fff" container style="height: 500px; width: 300px" class="q-mt-xl shadow-2">
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-footer reveal>
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Footer</q-toolbar-title>
          <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
        </q-toolbar>
      </q-footer>

      <q-drawer v-model="drawer" :width="200" :breakpoint="300">
        <div v-for="n in 50" :key="n">
          Drawer {{ n }} / 50
        </div>
      </q-drawer>
      <q-drawer side="right" v-model="drawerR" :width="200" :breakpoint="300">
        <div v-for="n in 50" :key="n">
          Drawer {{ n }} / 50
        </div>
      </q-drawer>
      <q-page-container>
        <q-page style="padding-top: 50px" class="bg-yellow">
          <div v-for="n in contentSize" :key="n">
            My page My page My page My page My page My page My page My page My page {{ n }} / {{ contentSize }}
          </div>

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

          <q-page-sticky position="top" expand class="bg-purple text-white">
            <q-toolbar>
              <q-btn flat round dense icon="map" @click="dialog = true" />
              <q-toolbar-title>Title</q-toolbar-title>
              <q-checkbox dark color="orange" v-model="moreContent" label="Scroll" />
            </q-toolbar>
          </q-page-sticky>
        </q-page>

        <q-page-scroller position="bottom">
          <q-btn fab icon="keyboard_arrow_up" color="red" />
        </q-page-scroller>

        <q-page-scroller position="top" reverse :scroll-offset="2000">
          <q-btn fab icon="keyboard_arrow_down" color="red" />
        </q-page-scroller>
      </q-page-container>
    </q-layout>

    <q-layout view="Lhh lpR fff" container style="height: 500px; width: 900px" class="q-mt-xl shadow-2">
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-btn flat @click="drawer3 = !drawer3" round dense icon="menu" />
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat @click="drawer3R = !drawer3R" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-footer reveal>
        <q-toolbar>
          <q-btn flat @click="drawer3 = !drawer3" round dense icon="menu" />
          <q-toolbar-title>Footer</q-toolbar-title>
          <q-btn flat @click="drawer3R = !drawer3R" round dense icon="menu" />
        </q-toolbar>
      </q-footer>

      <q-drawer v-model="drawer3" :width="200" :breakpoint="300">
        <div v-for="n in 50" :key="n">
          Drawer {{ n }} / 50
        </div>
      </q-drawer>
      <q-drawer side="right" v-model="drawer3R" :width="200" :breakpoint="300">
        <div v-for="n in 50" :key="n">
          Drawer {{ n }} / 50
        </div>
      </q-drawer>
      <q-page-container>
        <q-page style="padding-top: 50px" class="bg-yellow">
          <div v-for="n in contentSize" :key="n">
            My page My page My page My page My page My page My page My page My page {{ n }} / {{ contentSize }}
          </div>

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

          <q-page-sticky position="top" expand class="bg-purple text-white">
            <q-toolbar>
              <q-btn flat round dense icon="map" @click="dialog = true" />
              <q-toolbar-title>Title</q-toolbar-title>
              <q-checkbox dark color="orange" v-model="moreContent" label="Scroll" />
            </q-toolbar>
          </q-page-sticky>

          <q-page-scroller position="bottom">
            <q-btn fab icon="keyboard_arrow_up" color="red" />
          </q-page-scroller>

          <q-page-scroller position="top" reverse :scroll-offset="2000">
            <q-btn fab icon="keyboard_arrow_down" color="red" />
          </q-page-scroller>
        </q-page>
      </q-page-container>
    </q-layout>

    <q-dialog v-model="modal" no-backdrop-dismiss>
      <q-layout view="LHh lpR fff" container style="min-height: 60vh; min-width: 60vw;">
        <q-header reveal class="bg-black">
          <q-toolbar>
            <q-btn flat @click="drawer2 = !drawer2" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="drawer2R = !drawer2R" round dense icon="menu" />
            <q-btn flat @click="modal = false" round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer reveal>
          <q-toolbar>
            <q-btn flat @click="drawer2 = !drawer2" round dense icon="menu" />
            <q-toolbar-title>Footer</q-toolbar-title>
            <q-btn flat @click="drawer2R = !drawer2R" round dense icon="menu" />
          </q-toolbar>
        </q-footer>

        <q-drawer v-model="drawer2" :width="200" :breakpoint="900">
          <div v-for="n in 50" :key="n">
            Drawer {{ n }} / 50
          </div>
        </q-drawer>
        <q-drawer side="right" v-model="drawer2R" :width="200" :breakpoint="900">
          <div v-for="n in 50" :key="n">
            Drawer {{ n }} / 50
          </div>
        </q-drawer>

        <q-page-container>
          <q-page style="padding-top: 50px" class="bg-yellow">
            <div v-for="n in contentSize" :key="n">
              My page My page My page My page My page My page My page My page My page {{ n }} / {{ contentSize }}
            </div>

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

            <q-page-sticky position="top" expand class="bg-purple text-white">
              <q-toolbar>
                <q-btn flat round dense icon="map" @click="dialog = true" />
                <q-toolbar-title>Title</q-toolbar-title>
                <q-checkbox dark color="orange" v-model="moreContent" label="Scroll" />
              </q-toolbar>
            </q-page-sticky>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

    <q-btn @click="modal = true" label="Open" class="q-my-xl" />
    <div v-for="n in 50" :key="n">
      Some text {{ n }} / 50
    </div>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          hogehgoe
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      modal: false,
      drawer: false,
      drawerR: true,
      drawer2: false,
      drawer2R: true,
      drawer3: false,
      drawer3R: false,
      moreContent: true
    }
  },
  computed: {
    contentSize () {
      return this.moreContent ? 150 : 5
    }
  },
  methods: {
  }
}
</script>
