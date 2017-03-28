<template>
  <q-layout ref="layout" view="hhr Lpr lFf" reveal v-model="sides" :right-breakpoint="900">
    <div slot="header" class="toolbar">
      <q-btn @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-btn @click="sides.left = !sides.left">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title :padding="1">
        Quasar Layout {{sides}}
      </q-toolbar-title>
      <q-btn @click="sides.right = !sides.right">
        <q-icon name="menu" />
      </q-btn>
      <q-btn @click="$refs.layout.toggleRight()">
        <q-icon name="menu" />
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

    <div slot="left" style="width: 200px;">
      <div>FirstL</div>
      <q-side-link class="item link" to="/test-layout/about">About</q-side-link>
      <q-side-link class="item link" to="/test-layout/toolbar">Toolbar</q-side-link>
      <q-side-link class="item link" to="/test-layout/tabs">Tabs</q-side-link>
      <q-side-link class="item link" to="/test-layout/drawer">Drawer</q-side-link>
      <div v-for="n in 60">left{{n}}</div>
      <q-input v-model="gigi" />
      <div>Last</div>
    </div>
    <div v-if="right" slot="right" style="width: 150px;">
      <div>FirstR</div>
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
      todo: true,
      gigi: '',
      sides: {
        left: true,
        right: false
      }
    }
  }
}
</script>
