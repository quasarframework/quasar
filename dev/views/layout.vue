<template>
  <quasar-layout>
    <div slot="header" class="toolbar">
      <button class="left-drawer-opener"><i>menu</i></button>
      <div class="toolbar-content">
        <div class="toolbar-title padding-1">
          <div>Some very very very very long title here</div>
        </div>
      </div>
      <button class="right-drawer-opener"><i>menu</i></button>
    </div>
    <div slot="header" class="toolbar">
      <button><i>menu</i></button>
      <div class="toolbar-content">
        <div class="toolbar-title padding-4">
          <div>Some very very very very long title here</div>
        </div>
      </div>
      <div class="toolbar-buttons">
        <button><i>search</i></button>
        <button><i>search</i></button>
        <button><i>search</i></button>
        <button><i>help</i></button>
      </div>
    </div>
    <div slot="header" class="toolbar">
      <quasar-searchbar :model.sync="search"></quasar-searchbar>
    </div>

    <quasar-tabs slot="navbar" class="layout-navbar primary">
      <quasar-tab icon="mail" v-link="{path: '/layout', exact: true}">Mails</quasar-tab>
      <quasar-tab icon="alarm" v-link="'/layout/alarm'">Alarms</quasar-tab>
      <quasar-tab icon="help" v-link="'/layout/help'">Help</quasar-tab>
    </quasar-tabs>

    <quasar-drawer>
      <div class="toolbar light border-bottom">
        <div class="toolbar-content">
          <div class="toolbar-title no-padding">
            <div>Left Drawer</div>
          </div>
        </div>
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
        <div class="toolbar-content">
          <div class="toolbar-title no-padding">
            <div>Right Drawer</div>
          </div>
        </div>
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

    <quasar-layout-view>
      <router-view></router-view>
    </quasar-layout-view>

    <div slot="footer" class="toolbar light">
      <div class="toolbar-buttons">
        <button><i>menu</i></button>
      </div>
      <div class="toolbar-content">
        <div class="toolbar-title">
          <div>Toolbar</div>
        </div>
      </div>
      <div class="toolbar-buttons">
        <button class="text-red"><i>search</i></button>
        <button class="text-yellow"><i>help</i></button>
      </div>
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
