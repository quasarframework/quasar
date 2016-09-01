<template>
  <quasar-layout>
    <div slot="header" class="toolbar">
      <button class="left-drawer-opener"><i>menu</i></button>
      <quasar-toolbar-title :padding="1">
        Some very very very very long title here
      </quasar-toolbar-title>
      <button class="right-drawer-opener"><i>menu</i></button>
    </div>

    <quasar-tabs slot="navigation">
      <quasar-tab icon="mail" v-link="{path: '/layout', exact: true}">Mails</quasar-tab>
      <quasar-tab icon="alarm" v-link="'/layout/alarm'">Alarms</quasar-tab>
      <quasar-tab icon="delete">Account</quasar-tab>
    </quasar-tabs>
    <quasar-tabs slot="navigation">
      <quasar-tab icon="mail" v-link="{path: '/layout', exact: true}">Mails</quasar-tab>
      <quasar-tab icon="alarm" v-link="'/layout/alarm'">Alarms</quasar-tab>
      <quasar-tab icon="delete">Account</quasar-tab>
      <quasar-tab icon="delete">Tab</quasar-tab>
      <quasar-tab icon="delete">Some other Tab</quasar-tab>
    </quasar-tabs>

    <quasar-drawer>
      <div class="drawer-header">
        <img :src="'statics/mountains.jpg'">
        <a class="avatar">
          <img :src="'statics/boy-avatar.png'">
        </a>
        <div>Quasar Framework</div>
        <div>some@email.com</div>
      </div>

      <div class="list">
        <quasar-drawer-link v-link="{path: '/layout', exact: true}" icon="mail">
          Mails
        </quasar-drawer-link>
        <div class="item item-link drawer-closer" v-link="'/layout/alarm'">
          <i class="item-primary">alarm</i>
          <div class="item-content">Alarms</div>
        </div>
        <div class="item item-link drawer-closer">
          <i class="item-primary">chat</i>
          <div class="item-content">Chat</div>
        </div>
        <div class="item item-link drawer-closer">
          <i class="item-primary">schedule</i>
          <div class="item-content">Schedule</div>
        </div>
      </div>

      <div class="item three-lines">
        <img class="item-primary" :src="'statics/boy-avatar.png'">
        <div class="item-content inset has-secondary">
          <div>Brunch this weekend?</div>
          <div>
            <span>John Doe</span>
            <br>
            I'll be in your neighborhood doing errands this
            weekend. Do you want to grab brunch?
          </div>
        </div>
        <div class="item-secondary stamp">
          1 week
        </div>
        <div class="item-secondary">
          <quasar-popover v-ref:popover position="top left">
            <i slot="target">
              more_vert
            </i>

            <div class="list">
              <div class="item item-link" @click="$refs.popover.close()">
                <div class="item-content">Reply</div>
              </div>
              <div class="item item-link" @click="$refs.popover.close()">
                <div class="item-content">Forward</div>
              </div>
              <div class="item item-link" @click="$refs.popover.close()">
                <div class="item-content">Delete</div>
              </div>
            </div>
          </quasar-popover>
        </div>
      </div>
      <div style="height: 1000px"></div>

      <br>
      <button class="primary" @click="openModal()">Open Modal</button>

    </quasar-drawer>

    <quasar-drawer right-side swipe-only>
      <div class="toolbar light border-bottom">
        <quasar-toolbar-title :padding="1">
          Right Drawer
        </quasar-toolbar-title>
      </div>

      <div class="list">
        <div class="item item-link drawer-closer">
          <i class="item-primary">chat</i>
          <div class="item-content">Chat</div>
        </div>
        <div class="item item-link drawer-closer">
          <i class="item-primary">schedule</i>
          <div class="item-content">Schedule</div>
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
