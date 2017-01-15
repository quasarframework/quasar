<template>
  <q-layout v-resize:window="isResponsive">
    <!-- NAVBAR -->
    <div slot="header" class="navbar">
      <button class="lt-md" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>
      <q-navbar-title :padding="1">
        Quasar Layout NavBar
      </q-navbar-title>

      <q-tabs class="navbar-menu gt-sm">
        <!--q-tab icon="view_quilt" :route="{path: '/test-navbar/about'}" replace>About</q-tab-->
        <q-tab icon="view_quilt" route="/test-navbar/about" replace>About</q-tab>
        <q-tab icon="view_day" route="/test-layout/toolbar" replace>Toolbar</q-tab>
        <q-tab icon="view_day" route="/test-layout/tabs" replace>Tabs</q-tab>
        <q-tab icon="input" route="/test-layout/drawer" replace>Drawer</q-tab>
      </q-tabs>
      <q-tabs class="navbar-menu sm">
        <!-- leave empty for small sizes -->
      </q-tabs>

      <template v-if="!responsive" >
        <q-search v-if="showSearch" v-model="search" class="primary" v-click-outside:selector.div.navbar="toggleSearch"></q-search>
      </template>
      <button v-if="!showSearch" @click.stop.prevent="toggleSearch" class="pull-right">
        <i>search</i>
      </button>
      <button @click="$refs.rightDrawer.open()" class="pull-right">
        <i>assignment</i>
      </button>
    </div>

    <template v-if="responsive">
      <div slot="header" class="primary">
        <!--
        <q-search :model.sync="search" class="primary"></q-search>
        -->
        <q-search v-if="showSearch" v-model="search" class="primary" v-click-outside="toggleSearch"></q-search>
      </div>
    </template>

    <q-drawer v-if="responsive" ref="leftDrawer" class="swipe-only hide-on-menu-visible">
      <div class="toolbar light">
        <q-toolbar-title :padding="1">
          Left Drawer
        </q-toolbar-title>
      </div>

      <div class="list no-border platform-delimiter">
        <!--q-drawer-link icon="view_quilt" :to="{path: '/test-navbar/about', exact: true}"-->
        <q-drawer-link icon="view_quilt" to="/test-navbar/about">
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
        Back to Index - {{ mediaSize }}
      </router-link>
    </div>
  </q-layout>
</template>

<script>
import { Utils } from 'quasar'
export default {
  data () {
    return {
      showSearch: false,
      search: '',
      responsive: false,
      mediaSize: 0
    }
  },
  methods: {
    toggleSearch () {
      this.showSearch = !this.showSearch
      if (!this.showSearch) {
        this.search = ''
      }
    },
    isResponsive (width) {
      this.mediaSize = width
      this.responsive = Utils.dom.isScreenMediaSize('lt-sm', width)
    }
  },
  mounted () {
    this.mediaSize = Utils.dom.viewport(window).width
    this.responsive = Utils.dom.isScreenMediaSize('lt-sm', this.mediaSize)
  }
}
</script>

<style lang="styl">
$layout-navbar-min-height ?= 56px
$navbar-title-font-size   ?= 1.25rem

.navbar
  padding 4px
  min-height $layout-navbar-min-height
  display flex
  overflow hidden
  flex-direction row
  align-items center
  justify-content space-bewteen
  width 100%
  position relative
  color $navbar-color
  background $navbar-background

  for $name, $color in $colors
    if $name != 'light' && $name != 'white'
      &.{$name}
        color white
        background $color
        &.inverted
          color $color
    if $name == 'light' || $name == 'white'
      &.{$name}
        color composite-color($color)
        background $color
        &.inverted
          color $color
          background composite-color($color)

  &.inverted
    background white

  button
    margin 0 .2rem
    padding .2rem
    text-shadow none
    &:active:not(.disabled)
      color $navbar-active-color

.navbar-content
  flex 0 1 auto
  min-width 0
  max-width 100%

.navbar-title
  flex 1
  align-items center
  font-size $navbar-title-font-size
  font-weight 500
  > div
    padding 0 12px
    width 100%
    text-overflow ellipsis
    white-space nowrap
    overflow hidden

.navbar-menu
  flex 1
  min-width 0
  max-width 100%

</style>

<style lang="styl" scoped>
.q-search
  width auto

</style>
