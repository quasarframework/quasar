<template>
  <q-layout view="hHh lpr fFf">
    <q-header reveal class="bg-black">
      <q-toolbar>
        <q-toolbar-title>Header - window.innerHeight to 1128 and window.innerWidth to 1028</q-toolbar-title>
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
      <div v-for="n in contentSize" :key="n">
        Drawer {{ n }} / {{ contentSize }}
      </div>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <div v-for="n in contentSize" :key="n">
          My page My page My page My page My page My page
          My page My page My page My page My page Pa {{ n }} / {{ contentSize }}
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
</template>

<script>
export default {
  data () {
    return {
      drawer: true,
      contentSize: 47
    }
  }
}
</script>
