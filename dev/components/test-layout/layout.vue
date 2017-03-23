<template>
  <q-layout view="hhr lpr lFf" reveal>
    <div slot="header" class="toolbar">
      <q-btn class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title :padding="1">
        Quasar Layout
      </q-toolbar-title>
      <q-btn @click="$refs.rightDrawer.open()">
        <q-icon name="assignment" />
      </q-btn>
      <q-checkbox v-model="todo" />
      <q-checkbox v-model="right" />
    </div>

    <div v-if="todo" slot="header" class="toolbar primary">
      <q-search v-model="search" class="primary"></q-search>
    </div>

    <q-tabs slot="navigation">
      <q-route-tab slot="title" icon="view_quilt" to="/test-layout/about" replace hide="icon">About</q-route-tab>
      <q-route-tab slot="title" icon="view_day" to="/test-layout/toolbar" replace hide="icon">Toolbar</q-route-tab>
      <q-route-tab slot="title" icon="view_day" to="/test-layout/tabs" replace>Tabs</q-route-tab>
      <q-route-tab slot="title" icon="input" to="/test-layout/drawer" replace>Drawer</q-route-tab>
    </q-tabs>

    <div slot="left" style="width: 200px;background: yellow;">
      <div>First</div>
      <div v-for="n in 60">left{{n}}</div>
      <div>Last</div>
    </div>
    <div v-if="right" slot="right" style="width: 50px;background: yellow;">
      <div>First</div>
      <div v-for="n in 60">right{{n}}</div>
      <div>Last</div>
    </div>

    <!--
    <q-drawer ref="leftDrawer">
      <div class="toolbar light">
        <q-toolbar-title :padding="1">
          Drawer
        </q-toolbar-title>
      </div>

      <div class="list no-border platform-delimiter" v-for="n in 10">
        <q-drawer-link icon="view_quilt" to="/test-layout/about">
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
    -->

    <router-view></router-view>

    <!--
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
    -->

    <div v-if="todo" slot="footer" class="toolbar">
      sdsfssdfs
    </div>
    <div slot="footer" class="toolbar">
      <router-link tag="button" to="/" exact>
        <q-icon name="keyboard arrow left" class="on-left" />
        Back to Index
      </router-link>
    </div>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      right: true,
      todo: true
    }
  }
}
</script>
