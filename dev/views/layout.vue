<template>
  <quasar-layout>
    <div slot="header" class="toolbar">
      <button class="left-drawer-opener"><i>menu</i></button>
      <quasar-toolbar-title :padding="1">
        Some very very very very long title here
      </quasar-toolbar-title>
      <button class="right-drawer-opener"><i>menu</i></button>
    </div>
    <div slot="header" class="toolbar">
      <button><i>menu</i></button>
      <quasar-toolbar-title :padding="2">
        Some very very very very long title here
      </quasar-toolbar-title>
      <button><i>search</i></button>
      <button><i>help</i></button>
    </div>
    <div slot="header" class="toolbar">
      <button><i>menu</i></button>
      <quasar-toolbar-title :padding="3">
        Some very very very very long title here
      </quasar-toolbar-title>
      <button><i>search</i></button>
      <button><i>search</i></button>
      <button><i>help</i></button>
    </div>
    <div slot="header" class="toolbar">
      <button><i>menu</i></button>
      <quasar-toolbar-title :padding="4" class="text-left">
        Some very very very very long title here
      </quasar-toolbar-title>
      <button><i>search</i></button>
      <button><i>search</i></button>
      <button><i>search</i></button>
      <button><i>help</i></button>
    </div>
    <div slot="header" class="toolbar">
      <quasar-searchbar :model.sync="search"></quasar-searchbar>
    </div>

    <quasar-tabs slot="navbar" class="primary">
      <quasar-tab icon="mail" v-link="{path: '/layout', exact: true}">Mails</quasar-tab>
      <quasar-tab icon="alarm" v-link="'/layout/alarm'">Alarms</quasar-tab>
      <quasar-tab icon="help" v-link="'/layout/help'">Help</quasar-tab>
    </quasar-tabs>

    <quasar-drawer>
      <div class="toolbar light border-bottom">
        <quasar-toolbar-title :padding="0">
          Left Drawer
        </quasar-toolbar-title>
      </div>

      <div class="list platform-delimiter">
        <quasar-drawer-link v-link="{path: '/layout', exact: true}" icon="mail">
          Maaails
        </quasar-drawer-link>
        <div class="item item-link drawer-closer" v-link="{path: '/layout', exact: true}">
          <i>mail</i>
          <div class="item-content text-truncate">Mails</div>
        </div>
        <div class="item item-link drawer-closer" v-link="'/layout/alarm'">
          <i>alarm</i>
          <div class="item-content text-truncate">Alarms</div>
        </div>
      </div>
    </quasar-drawer>

    <quasar-drawer right-side swipe-only>
      <div class="toolbar light border-bottom">
        <quasar-toolbar-title :padding="1">
          Right Drawer
        </quasar-toolbar-title>
      </div>

      <div class="list platform-delimiter">
        <div class="item item-link">
          <i>mail</i>
          <div class="item-content text-truncate">Mails</div>
        </div>
        <div class="item item-link">
          <i>alarm</i>
          <div class="item-content text-truncate">Alarms</div>
        </div>
      </div>
    </quasar-drawer>

    <div class="layout-view">
      <router-view class="layout-scroll-area"></router-view>
    </div>

    <div slot="footer" class="toolbar light">
      <div class="toolbar-buttons">
        <button><i>menu</i></button>
      </div>
      <quasar-toolbar-title :padding="1">
        Toolbar
      </quasar-toolbar-title>
      <button class="text-red"><i>search</i></button>
      <button class="text-yellow"><i>help</i></button>
    </div>
  </quasar-layout>
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
