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
      <quasar-search :model.sync="search"></quasar-search>
    </div>

    <quasar-tabs slot="navigation">
      <quasar-tab icon="mail" v-link="{path: '/layout', exact: true}">Mails</quasar-tab>
      <quasar-tab icon="alarm" v-link="'/layout/alarm'">Alarms</quasar-tab>
      <quasar-tab icon="delete">Account</quasar-tab>
    </quasar-tabs>

    <div slot="header" class="toolbar purple">
      <quasar-search :model.sync="search" class="purple" icon="mail" placeholder="Search mails"></quasar-search>
    </div>
    <div slot="header" class="toolbar red">
      <quasar-search :model.sync="search" class="red"></quasar-search>
    </div>
    <div slot="header" class="toolbar dark">
      <quasar-search :model.sync="search" class="dark"></quasar-search>
    </div>

    <quasar-drawer>
      <div class="drawer-header">
        <img :src="'statics/mountains.jpg'">
        <a class="avatar">
          <img :src="'statics/boy-avatar.png'">
        </a>
        <div>Quasar Framework</div>
        <div>some@email.com</div>
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

      <br>
      <button class="primary" @click="openModal()">Open Modal</button>

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

    <router-view class="layout-view"></router-view>

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
import { Modal } from 'quasar'

export default {
  data () {
    return {
      search: ''
    }
  },
  methods: {
    openModal () {
      Modal.create({
        template: 'Close <button class="primary" @click="close()">me</button>'
      })
      .set({minimized: true})
      .css({padding: '3rem'})
      .show()
    }
  }
}
</script>
