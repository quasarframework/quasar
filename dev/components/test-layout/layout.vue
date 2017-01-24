<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
        Quasar Layout
      </q-toolbar-title>
      <button @click="$refs.rightDrawer.open()">
        <i>assignment</i>
      </button>
    </div>

    <div slot="header" class="toolbar primary">
      <q-search v-model="search" class="primary"></q-search>
    </div>

    <q-tabs slot="navigation">
      <q-tab icon="view_quilt" :route="{path: '/test-layout/about'}" replace hide="icon">About</q-tab>
      <q-tab icon="view_day" route="/test-layout/toolbar" replace hide="icon">Toolbar</q-tab>
      <q-tab icon="view_day" route="/test-layout/tabs" replace>Tabs</q-tab>
      <q-tab icon="input" route="/test-layout/drawer" replace>Drawer</q-tab>
    </q-tabs>

    <q-drawer ref="leftDrawer">
      <div class="toolbar light">
        <q-toolbar-title :padding="1">
          Drawer
        </q-toolbar-title>
      </div>

      <div class="list no-border platform-delimiter" v-for="n in 10">
        <q-drawer-link icon="view_quilt" :to="{path: '/test-layout', exact: true}">
          About Layout
        </q-drawer-link>
        <hr>
        <div class="list-label">Layout Components</div>
        <q-drawer-link icon="build" to="/test-layout/toolbar">
          Toolbar
        </q-drawer-link>
        <q-drawer-link icon="tab" to="/test-layout/tabs">
          Tabs
        </q-drawer-link>
        <q-drawer-link icon="compare_arrows" to="/test-layout/drawer">
          Layout Drawer
        </q-drawer-link>
      </div>
    </q-drawer>

    <router-view class="layout-view"></router-view>

    <q-drawer right-side swipe-only ref="rightDrawer">
      <div class="toolbar light">
        <q-toolbar-title :padding="1">
            Right-side Drawer
        </q-toolbar-title>
      </div>

      <p style="padding: 25px;" class="text-grey-7">
        This is yet another Drawer that does not gets displayed alongside content on
        bigger screens.
      </p>
    </q-drawer>

    <div slot="footer" class="toolbar">
      <router-link tag="button" to="/" exact>
        <i class="on-left">keyboard_arrow_left</i>
        Back to Index
      </router-link>
    </div>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  }
}
</script>
