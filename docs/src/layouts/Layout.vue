<template lang="pug">
q-layout.doc-layout(view="hHh LpR lff", @scroll="onScroll")
  q-header.header(elevated)
    q-toolbar
      q-btn.q-mr-sm(v-if="hasDrawer", flat, dense, round, @click="leftDrawerState = !leftDrawerState", aria-label="Menu")
        q-icon(name="menu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        q-avatar
          img(src="https://cdn.quasar-framework.org/img/quasar-logo.png")
        q-toolbar-title(shrink) Quasar

      template(v-if="hasDrawer !== true")
        q-separator.q-mx-xs(vertical, dark, inset)
        q-btn.text-bold(key="docs", flat, stretch, no-caps, to="/docs", label="Docs")

      q-space

      header-menu.self-stretch.row.no-wrap(v-if="$q.screen.gt.xs")

      q-btn.q-ml-xs(v-show="hasDrawer", flat, dense, round, @click="rightDrawerState = !rightDrawerState", aria-label="Menu")
        q-icon(name="assignment")

  q-footer.text-white.text-center.footer
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

    div Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu

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
          template(v-slot:append)
            q-icon(name="search")

      app-menu.q-mb-lg

  q-drawer(
    v-if="hasDrawer"
    v-model="rightDrawerState"
    side="right"
    content-class="bg-grey-2"
    :width="180"
    show-if-above
    @on-layout="updateRightDrawerOnLayout"
  )
    q-scroll-area.fit
      header-menu.q-mt-sm.text-primary.column(v-if="$q.screen.lt.sm", align="right")

      q-list.doc-toc.q-my-lg.text-grey-8
        q-item(
          v-for="toc in $store.state.toc",
          :key="toc.id",
          clickable,
          v-ripple,
          dense,
          @click="scrollTo(toc.id)",
          :active="activeToc === toc.id"
        )
          q-item-section(v-if="toc.sub === true", side) •
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
</template>

<script>
import { scroll } from 'quasar'
import AppMenu from 'components/AppMenu'
import HeaderMenu from 'components/HeaderMenu'

export default {
  name: 'Layout',

  meta: {
    title: 'Welcome!',
    titleTemplate: title => `${title} | Quasar Framework`
  },

  components: {
    AppMenu,
    HeaderMenu
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

.header, .footer
  background linear-gradient(145deg, $primary 11%, $dark-primary 45%)

.header-logo
  width 25px
  height 25px

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

.q-drawer--standard .doc-toc
  .q-item
    border-radius 5px 0 0 5px
    border-left 3px solid transparent
  .q-item--active
    border-left 3px solid $primary
.q-drawer--mobile .doc-toc
  .q-item--active
    font-weight 600

.quasar-logo
  img
    transition transform .8s ease-in-out
  &:hover img
    transform rotate(360deg)
</style>
