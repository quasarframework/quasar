<template>
  <q-layout ref="layout" view="hHr LpR lFf" v-model="sides" :right-breakpoint="900">
    <q-toolbar slot="header">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-btn flat @click="sides.left = !sides.left">
        <q-icon name="menu" />
      </q-btn>
      <div class="q-toolbar-title">
        Quasar Layout
      </div>
      <q-btn flat @click="sides.right = !sides.right">
        <q-icon name="menu" />
      </q-btn>
      <q-btn flat @click="$refs.layout.toggleRight()">
        <q-icon name="menu" />
      </q-btn>
      <q-checkbox color="white" v-model="todo" />
      <q-checkbox color="white" v-model="right" />
    </q-toolbar>

    <q-toolbar v-if="todo" slot="header" color="amber">
      <q-search v-model="search" class="text-black col"></q-search>
    </q-toolbar>

    <q-tabs slot="navigation">
      <q-route-tab slot="title" icon="view_quilt" to="/test-layout/about" replace hide="icon" label="About" />
      <q-route-tab slot="title" icon="view_day" to="/test-layout/toolbar" replace hide="icon" label="Toolbar" />
      <q-route-tab slot="title" icon="view_day" to="/test-layout/tabs" replace label="Tabs" />
      <q-route-tab slot="title" icon="input" to="/test-layout/drawer" replace label="Drawer" />
    </q-tabs>

    <q-scroll-area slot="left" style="width: 100%; height: 100%;" :thumb-style="{right: '4px', borderRadius: '5px', background: 'red', opacity: 1}">
      <div>FirstL</div>
      <q-side-link class="item link" to="/test-layout/about">About</q-side-link>
      <q-side-link class="item link" to="/test-layout/toolbar">Toolbar</q-side-link>
      <q-side-link class="item link" to="/test-layout/tabs">Tabs</q-side-link>
      <q-side-link class="item link" to="/test-layout/drawer">Drawer</q-side-link>
      <div v-for="n in 60">left{{n}}</div>
      <q-input v-model="gigi" />
      <div>Last</div>
    </q-scroll-area>

    <div slot="right">
      <div>FirstR</div>
      <q-side-link class="item link" to="/test-layout/about">About</q-side-link>
      <span id="gigi" class="bg-white text-black"></span>
      <span id="gogu"></span>
      <div v-for="n in 60">right{{n}}</div>
      <div>Last</div>
    </div>

    <router-view></router-view>

    <q-toolbar v-if="todo" slot="footer" color="secondary">
      sdsfssdfs
    </q-toolbar>
    <q-toolbar slot="footer">
      <q-btn flat @click="$router.push('/')" icon="keyboard arrow left">
        Back to Index
      </q-btn>
    </q-toolbar>
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
        left: false,
        right: true
      }
    }
  }
}
</script>
