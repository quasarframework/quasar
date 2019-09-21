<template lang="pug">
q-layout.doc-layout(view="lHh LpR lff", @scroll="onScroll")
  q-header.header(elevated)
    q-toolbar
      q-btn.q-mr-sm(flat, dense, round, @click="leftDrawerState = !leftDrawerState", aria-label="Menu")
        q-icon(name="menu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        q-avatar.doc-layout-avatar
          img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
        q-toolbar-title(shrink) Quasar

      q-space

      header-menu.self-stretch.row.no-wrap(v-if="$q.screen.gt.xs")

      q-btn.q-ml-xs(v-show="hasRightDrawer", flat, dense, round, @click="rightDrawerState = !rightDrawerState", aria-label="Menu")
        q-icon(name="assignment")

  q-drawer(
    v-model="leftDrawerState"
    show-if-above
    bordered
    content-class="doc-left-drawer"
  )
    q-scroll-area(style="height: calc(100% - 50px); margin-top: 50px")
      .row.justify-center.q-my-lg
        q-btn(
          type="a"
          href="https://donate.quasar.dev"
          target="_blank"
          rel="noopener"
          size="13px"
          color="primary"
          icon="favorite_border"
          label="Donate to Quasar"
        )

      app-menu.q-my-lg

    .absolute-top.bg-white.layout-drawer-toolbar
      form(
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      )
        q-input.full-width.doc-algolia(
          ref="docAlgolia"
          v-model="search"
          dense
          standout="bg-primary text-white"
          square
          placeholder="Search..."
        )
          template(v-slot:append)
            q-icon(
              name="search"
              @click="$refs.docAlgolia.focus()"
            )

  q-drawer(
    v-if="hasRightDrawer"
    v-model="rightDrawerState"
    show-if-above
    side="right"
    content-class="bg-grey-1"
    :width="180"
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
    q-btn(fab-mini, color="primary", glossy, icon="keyboard_arrow_up")
</template>

<script>
import { scroll } from 'quasar'
import AppMenu from 'components/AppMenu'
import HeaderMenu from 'components/HeaderMenu'

export default {
  name: 'Layout',

  components: {
    AppMenu,
    HeaderMenu
  },

  watch: {
    $route () {
      this.leftDrawerState = this.$q.screen.width > 1023
      this.rightDrawerState = this.$q.screen.width > 1023
      this.$nextTick(() => {
        this.updateActiveToc(document.documentElement.scrollTop || document.body.scrollTop)
      })
    }
  },

  data () {
    return {
      search: '',
      rightDrawerOnLayout: false,
      activeToc: void 0
    }
  },

  computed: {
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
    },

    hasRightDrawer () {
      return this.$store.state.toc.length > 0 || this.$q.screen.lt.sm === true
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
      if (this.scrollingPage !== true) {
        this.updateActiveToc(position)
      }
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

  mounted () {
    import('docsearch.js').then(docsearch => docsearch.default({
      apiKey: '5c15f3938ef24ae49e3a0e69dc4a140f',
      indexName: 'quasar-framework',
      inputSelector: '.doc-algolia input',
      algoliaOptions: {
        hitsPerPage: 7
      },
      handleSelected: (a, b, suggestion, c, context) => {
        const url = suggestion.url
          .replace('https://v1.quasar-framework.org', '') // TODO remove when Algolia is updated
          .replace('https://quasar.dev', '')

        this.search = ''
        this.$router.push(url)
        this.$refs.docAlgolia.blur()
      }
    }))
  },

  beforeDestroy () {
    clearTimeout(this.scrollTimer)
  }
}
</script>

<style lang="sass">
@import '../css/docsearch'

.header
  background: linear-gradient(145deg, $primary 11%, $dark-primary 75%)

.header-logo
  width: 25px
  height: 25px

.doc-layout-avatar > div
  border-radius: 0

.layout-drawer-toolbar
  border-bottom: 1px solid $separator-color

.q-drawer--mobile .doc-toc
  .q-item
    margin-left: 3px
  .q-item--active
    font-weight: 600

.doc-toc .q-item
  border-radius: 10px 0 0 10px
  margin-top: 1px
  margin-bottom: 1px

  &.q-item--active
    background: scale-color($primary, $lightness: 90%)

.doc-left-drawer
  overflow: inherit !important

.quasar-logo
  img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out
  &:hover img
    transform: rotate(-360deg)
</style>
