<template>
  <div class="q-layout-padding">
    <q-input
      v-model.number="width"
      type="number"
      class="q-my-lg"
      dense
      filled
      label="Layout width (fun from 1024 to 1039"
      input-class="text-right"
      style="width: 210px"
    />

    <q-layout view="hHh lpr fFf" container :style="containerStyle" class="q-mt-xl shadow-2">
      <q-header reveal class="bg-black">
        <q-toolbar>
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-footer reveal>
        <q-toolbar>
          <q-toolbar-title>Footer</q-toolbar-title>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        </q-toolbar>
      </q-footer>

      <q-drawer
        side="right"
        v-model="drawer"
        bordered
      >
        <div v-for="n in contentSize * 2 + 5" :key="n">
          Drawer {{ n }} / {{ contentSize * 2 + 5 }}
        </div>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <div v-for="n in contentSize" :key="n">
            My page My page My page My page My page My page
            My page My page My page My page My page My page {{ n }} / {{ contentSize }}
          </div>
        </q-page>

        <q-page-scroller position="bottom">
          <q-btn fab icon="keyboard_arrow_up" color="red" />
        </q-page-scroller>

        <q-page-scroller position="top" reverse :scroll-offset="2000">
          <q-btn fab icon="keyboard_arrow_down" color="red" />
        </q-page-scroller>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      width: 1030,
      contentSize: 30
    }
  },

  computed: {
    containerStyle () {
      return {
        height: '800px',
        width: this.width + 'px'
      }
    }
  }
}
</script>
