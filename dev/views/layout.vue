<template>
  <div class="layout">
    <div class="layout-header">
      <div class="toolbar">
        <button class="left-drawer-opener"><i>menu</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-1">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <button class="right-drawer-opener"><i>menu</i></button>
      </div>
      <!--
      <div class="toolbar">
        <button><i>menu</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-2">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button><i>search</i></button>
          <button><i>help</i></button>
        </div>
      </div>
      <div class="toolbar">
        <button><i>menu</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-3">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button><i>search</i></button>
          <button><i>search</i></button>
          <button><i>help</i></button>
        </div>
      </div>
      <div class="toolbar">
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
      <div class="toolbar">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      <div class="toolbar primary">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      <div class="toolbar secondary">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      <div class="toolbar light">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      -->
    </div>

    <!--
    <quasar-tabs class="layout-navbar">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>

    <quasar-tabs class="layout-navbar dark">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>

    <quasar-tabs class="layout-navbar light">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>

    <quasar-tabs class="layout-navbar light">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>

    <quasar-tabs class="layout-navbar orange clear">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>
    -->

    <quasar-tabs class="layout-navbar primary">
      <quasar-tab icon="mail" v-link="{path: '/layout', exact: true}">Mails</quasar-tab>
      <quasar-tab icon="alarm" v-link="'/layout/alarm'">Alarms</quasar-tab>
      <quasar-tab icon="help" v-link="'/layout/help'">Help</quasar-tab>
    </quasar-tabs>

    <div class="row auto">
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

      <div class="layout-content">
        <router-view></router-view>
      </div>
    </div>

    <div class="layout-footer">
      <div class="toolbar light">
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
    </div>
  </div>
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
