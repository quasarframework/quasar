<template lang="pug">
q-layout(view="hHh LpR lff")
  q-header(elevated)
    q-toolbar
      q-btn(v-show="hasDrawer", flat, dense, round, @click="leftDrawerState = !leftDrawerState", aria-label="Menu")
        q-icon(name="menu")

      q-btn.q-ml-sm.self-stretch.text-bold(flat, no-caps, to="/")
        q-avatar
          img(src="statics/quasar-logo.png")
        q-toolbar-title(shrink) Quasar

      q-separator.q-mx-xs(vertical, dark, inset)
      q-btn.text-bold(flat, stretch, no-caps, to="/components/qbtn", label="Documentation")

      q-space

      q-btn-dropdown.header-squared.self-stretch.text-bold(flat, no-caps, :label="`v${$q.version}`", auto-close)
        q-list
          q-item(
            v-for="version in ['17', '16', '15', '14', '13']"
            :key="version"
            clickable
            @click="openURL(`https://v0-${version}.quasar-framework.org/`)"
          )
            q-item-section {{ `v0.${version}` }}

      q-btn-dropdown.header-squared.self-stretch.text-bold(flat, no-caps, label="Quick Links", auto-close)
        q-list
          q-item(clickable, @click="openURL('https://github.com/quasarframework/quasar-awesome')")
            q-item-section.text-yellow-9(avatar)
              q-icon(name="flare")
            q-item-section Awesome Quasar
          q-item(clickable, @click="openURL('https://medium.com/quasar-framework')")
            q-item-section.text-primary(avatar)
              q-icon(name="fab fa-medium")
            q-item-section Quasar Blog
          q-item(clickable, @click="openURL('https://github.com/quasarframework')")
            q-item-section.text-secondary(avatar)
              q-icon(name="work")
            q-item-section Repositories
          q-item-label(header) Playground
          q-item(clickable, @click="openURL('https://codepen.io/rstoenescu/pen/KQRZJg')")
            q-item-section.text-brown-5(avatar)
              q-icon(name="fab fa-codepen")
            q-item-section Codepen
          q-item(clickable, @click="openURL('https://jsfiddle.net/rstoenescu/waugrryy/')")
            q-item-section.text-primary(avatar)
              q-icon(name="fab fa-jsfiddle")
            q-item-section jsFiddle
          q-item-label(header) Social
          q-item(clickable, @click="openURL('https://forum.quasar-framework.org/category/1/announcements')")
            q-item-section.text-purple(avatar)
              q-icon(name="announcement")
            q-item-section Announcements
          q-item(clickable, @click="openURL('https://github.com/quasarframework/quasar')")
            q-item-section.text-black(avatar)
              q-icon(name="fab fa-github")
            q-item-section Github
          q-item(clickable, @click="openURL('https://twitter.com/quasarframework')")
            q-item-section.text-blue(avatar)
              q-icon(name="fab fa-twitter")
            q-item-section Twitter

      q-btn-dropdown.header-squared.self-stretch.text-bold(flat, no-caps, label="Support", auto-close)
        q-list
          q-item(clickable, @click="openURL('https://discord.gg/5TDhbDg')")
            q-item-section.text-primary(avatar)
              q-icon(name="fab fa-discord")
            q-item-section Chat
          q-item(clickable, @click="openURL('https://forum.quasar-framework.org/')")
            q-item-section.text-secondary(avatar)
              q-icon(name="fas fa-comments")
            q-item-section Forum
          q-item(clickable, @click="openURL('https://stackoverflow.com/search?q=quasarframework')")
            q-item-section.text-red(avatar)
              q-icon(name="fab fa-stack-overflow")
            q-item-section Stack Overflow
          q-separator
          q-item(clickable, @click="openURL('https://www.patreon.com/quasarframework')")
            q-item-section.text-red(avatar)
              q-icon(name="fab fa-patreon")
            q-item-section Patreon

      q-btn.q-ml-xs(v-show="hasDrawer", flat, dense, round, @click="rightDrawerState = !rightDrawerState", aria-label="Menu")
        q-icon(name="menu")

  q-drawer(
    v-if="hasDrawer"
    v-model="leftDrawerState"
    bordered
  )
    .flex.justify-center
      q-btn.q-mt-lg(
        type="a"
        href="https://www.patreon.com/quasarframework"
        target="_blank"
        size="13px"
        color="red"
        icon="fab fa-patreon"
        label="Become a Patron"
      )

      q-input.q-my-lg(v-model="search", filled, dense)
        q-icon(slot="prepend", name="search")

    q-separator

    q-item-label(header) For Design - Working
    q-item(to="/", exact)
      q-item-section Landing Page
    q-item(to="/components/qbtn", exact)
      q-item-section Component Page
    q-item(to="/components/other", exact)
      q-item-section Some Other Page

    q-separator
    q-item-label.q-mt-md(header) Actual Menu - Not Working

    app-menu

  q-drawer(
    v-if="hasDrawer"
    v-model="rightDrawerState"
    side="right"
    content-class="bg-grey-3"
    :width="180"
  )
    q-list.docs-toc
      q-item-label(header) Table of Contents
      q-item(clickable, @click="scrollTo('introduction')")
        q-item-section Introduction
      q-item(clickable, @click="scrollTo('installation')")
        q-item-section Installation
      q-item(clickable, @click="scrollTo('usage')")
        q-item-section Usage
      q-item(clickable, @click="scrollTo('api')")
        q-item-section API
    .flex.justify-center.q-mt-sm
      .bg-grey.flex.flex-center.text-white(
        style="width: 160px; height: 243px"
      ) Ad

  q-page-container
    transition(
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      :duration="200"
      @leave="resetScroll"
    )
      router-view
</template>

<script>
import { openURL, scroll } from 'quasar'
import AppMenu from 'components/AppMenu'

export default {
  name: 'Layout',

  meta: {
    title: 'Welcome!',
    titleTemplate: title => `${title} - Quasar Framework`
  },

  components: {
    AppMenu
  },

  watch: {
    $route () {
      this.leftDrawerState = true
      this.rightDrawerState = true
    }
  },

  data () {
    return {
      search: ''
    }
  },

  computed: {
    hasDrawer () {
      return this.$store.getters.hasDrawer
    },

    leftDrawerState: {
      get () {
        return this.$store.state.leftDrawerState
      },
      set (val) {
        this.$store.commit('updateLeftDrawerState', val)
      }
    },

    rightDrawerState: {
      get () {
        return this.$store.state.rightDrawerState
      },
      set (val) {
        this.$store.commit('updateRightDrawerState', val)
      }
    }
  },

  methods: {
    openURL,

    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },

    scrollTo (id) {
      const el = document.getElementById(id)
      if (el) {
        const
          target = scroll.getScrollTarget(el),
          offset = el.offsetTop - el.scrollHeight

        scroll.setScrollPosition(target, offset, 500)
      }
    }
  }
}
</script>

<style lang="stylus">
.header-squared
  border-radius 0
.header-logo
  width 25px
  height 25px
.docs-toc .q-item .q-focus-helper
  border-radius 5px 0 0 5px
</style>
