<template lang="pug">
q-layout.doc-layout(view="hHh LpR lff", @scroll="onScroll")
  q-header.bg-black(elevated)
    q-toolbar
      q-btn.q-mr-sm(v-if="hasDrawer", flat, dense, round, @click="leftDrawerState = !leftDrawerState", aria-label="Menu")
        q-icon(name="menu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, stretch, to="/")
        q-avatar
          img(src="https://cdn.quasar-framework.org/img/quasar-logo.png")
        q-toolbar-title(shrink) Quasar

      template(v-if="hasDrawer !== true")
        q-separator.q-mx-xs(vertical, dark, inset)
        q-btn.text-bold(key="docs", flat, stretch, no-caps, to="/docs", label="Docs")

      q-space

      q-btn-dropdown.header-squared.text-bold(flat, no-caps, stretch, :label="`v${$q.version}`", auto-close)
        q-list
          q-item(
            v-for="version in ['17', '16', '15', '14', '13']"
            :key="version"
            clickable
            tag="a"
            :href="`https://v0-${version}.quasar-framework.org/`"
            target="_blank"
          )
            q-item-section {{ `v0.${version}` }}

      q-btn-dropdown.header-squared.text-bold(flat, no-caps, stretch, label="Quick Links", auto-close)
        q-list
          q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar-awesome", target="_blank")
            q-item-section.text-yellow-9(avatar)
              q-icon(name="flare")
            q-item-section Awesome Quasar

          q-item(clickable, tag="a", href="https://medium.com/quasar-framework", target="_blank")
            q-item-section.text-primary(avatar)
              q-icon(name="fab fa-medium")
            q-item-section Quasar Blog

          q-item(clickable, tag="a", href="https://github.com/quasarframework/quasar", target="_blank")
            q-item-section(avatar)
              q-icon(name="fab fa-github")
            q-item-section Github

          q-item-label(header) Playground

          q-item(clickable, tag="a", href="https://codepen.io/rstoenescu/pen/KQRZJg", target="_blank")
            q-item-section.text-brown-5(avatar)
              q-icon(name="fab fa-codepen")
            q-item-section Codepen

          q-item(clickable, tag="a", href="https://jsfiddle.net/rstoenescu/waugrryy/", target="_blank")
            q-item-section.text-primary(avatar)
              q-icon(name="fab fa-jsfiddle")
            q-item-section jsFiddle

          q-item-label(header) Social

          q-item(clickable, tag="a", href="https://forum.quasar-framework.org/category/1/announcements", target="_blank")
            q-item-section.text-purple(avatar)
              q-icon(name="announcement")
            q-item-section Announcements

          q-item(clickable, tag="a", href="https://twitter.com/quasarframework", target="_blank")
            q-item-section.text-blue(avatar)
              q-icon(name="fab fa-twitter")
            q-item-section Twitter

      q-btn-dropdown.header-squared.text-bold(flat, no-caps, stretch, label="Support", auto-close)
        q-list

          q-item(clickable, tag="a", href="https://discord.gg/5TDhbDg", target="_blank")
            q-item-section.text-primary(avatar)
              q-icon(name="fab fa-discord")
            q-item-section Chat

          q-item(clickable, tag="a", href="https://forum.quasar-framework.org/", target="_blank")
            q-item-section.text-secondary(avatar)
              q-icon(name="fas fa-comments")
            q-item-section Forum

          q-item(clickable, tag="a", href="https://stackoverflow.com/search?q=quasarframework", target="_blank")
            q-item-section.text-red(avatar)
              q-icon(name="fab fa-stack-overflow")
            q-item-section Stack Overflow

          q-separator

          q-item(clickable, tag="a", href="https://www.patreon.com/quasarframework", target="_blank")
            q-item-section.text-red(avatar)
              q-icon(name="fab fa-patreon")
            q-item-section Patreon

      q-btn.q-ml-xs(v-show="hasDrawer", flat, dense, round, @click="rightDrawerState = !rightDrawerState", aria-label="Menu")
        q-icon(name="assignment")

  q-drawer(
    v-if="hasDrawer"
    v-model="leftDrawerState"
    bordered
    show-if-above
  )
    q-scroll-area.fit
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
          q-icon(slot="append", name="search")

      app-menu

  q-drawer(
    v-if="hasDrawer"
    v-model="rightDrawerState"
    side="right"
    content-class="bg-grey-3"
    :width="180"
    show-if-above
    @on-layout="updateRightDrawerOnLayout"
  )
    q-scroll-area.fit
      q-list.docs-toc.q-my-lg.text-grey-8
        q-item(v-for="toc in $store.state.toc", :key="toc.id", clickable, v-ripple, @click="scrollTo(toc.id)", :active="activeToc === toc.id")
          q-item-section {{ toc.title }}

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

  q-page-scroller
    q-btn(fab, color="red", icon="keyboard_arrow_up")

  q-footer.bg-black.text-white.text-center.footer
    div.footer__icons.row.flex-center
      a(href="https://github.com/quasarframework/quasar", target="_blank")
        q-icon(name="fab fa-github")

      a(href="https://twitter.com/quasarframework", target="_blank")
        q-icon(name="fab fa-twitter")

      a(href="https://medium.com/quasar-framework", target="_blank")
        q-icon(name="fab fa-medium")

      a(href="https://discord.gg/5TDhbDg", target="_blank")
        q-icon(name="fab fa-discord")

      a(href="https://forum.quasar-framework.org/", target="_blank")
        q-icon(name="fas fa-comments")
    div
      | Released under the <doc-link to="https://github.com/quasarframework/quasar/blob/dev/LICENSE">MIT LICENSE</doc-link>

    div Copyright © 2015 - {{ year }} Razvan Stoenescu
</template>

<script>
import { scroll } from 'quasar'
import AppMenu from 'components/AppMenu'

export default {
  name: 'Layout',

  meta: {
    title: 'Welcome!',
    titleTemplate: title => `${title} | Quasar Framework`
  },

  components: {
    AppMenu
  },

  watch: {
    $route () {
      this.leftDrawerState = true
      this.rightDrawerState = true
      this.hasDrawer === true && this.$nextTick(() => {
        this.updateActiveToc(document.documentElement.scrollTop || document.body.scrollTop)
      })
    }
  },

  data () {
    return {
      year: (new Date()).getFullYear(),
      search: '',
      rightDrawerOnLayout: false,
      activeToc: void 0
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
    resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },

    scrollTo (id) {
      const el = document.getElementById(id)
      clearTimeout(this.scrollTimer)

      if (el) {
        if (this.rightDrawerOnLayout !== true) {
          this.rightDrawerState = false
          this.scrollTimer = setTimeout(() => {
            this.scrollPage(el)
          }, 300)
        }
        else {
          this.scrollPage(el)
        }
      }
    },

    scrollPage (el) {
      const
        target = scroll.getScrollTarget(el),
        offset = el.offsetTop - el.scrollHeight

      this.scrollingPage = true
      this.scrollTimer = setTimeout(() => {
        this.scrollingPage = false
      }, 510)
      scroll.setScrollPosition(target, offset, 500)
    },

    updateRightDrawerOnLayout (state) {
      this.rightDrawerOnLayout = state
    },

    onScroll ({ position }) {
      if (this.scrollingPage === true || this.hasDrawer !== true) {
        return
      }

      this.updateActiveToc(position)
    },

    updateActiveToc (position) {
      const toc = this.$store.state.toc
      let last

      for (let i in toc) {
        const section = toc[i]
        const item = document.getElementById(section.id)

        if (item === null) {
          continue
        }

        if (item.offsetTop >= position + 155) {
          if (last === void 0) {
            last = section.id
          }
          break
        }
        else {
          last = section.id
        }
      }

      if (last !== void 0) {
        this.activeToc = last
      }
    }
  },

  beforeDestroy () {
    clearTimeout(this.scrollTimer)
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.doc-layout
  background $grey-3
.header-squared
  border-radius 0
.header-logo
  width 25px
  height 25px
.q-drawer--standard .docs-toc .q-item
  border-radius 5px 0 0 5px
.footer
  padding 24px 0

  &__icons
    font-size 2em
    a
      margin 0 8px 8px
      text-decoration none
      outline 0
      color inherit
  .doc-link
    color inherit
.docs-toc .q-item--active
  font-weight 600

.quasar-logo
  img
    transition transform .8s ease-in-out
  &:hover img
    transform rotate(360deg)
</style>
