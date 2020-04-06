<template lang="pug">
q-layout.doc-layout(view="lHh LpR lff", @scroll="onScroll")
  q-header.header(elevated)
    q-toolbar
      q-btn.q-mr-sm(flat, dense, round, @click="toggleLeftDrawer", aria-label="Menu", :icon="mdiMenu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        q-avatar.doc-layout-avatar
          img(src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg")
        q-toolbar-title(shrink) Quasar

      q-space

      header-menu.self-stretch.row.no-wrap(v-if="$q.screen.gt.xs")

      q-btn.q-ml-xs.lt-md(
        v-show="hasRightDrawer",
        flat,
        dense,
        round,
        @click="toggleRightDrawer",
        aria-label="Menu"
        :icon="mdiClipboardText"
      )

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
          :icon="mdiHeartOutline"
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
        q-input.full-width.doc-algolia.bg-primary(
          ref="docAlgolia"
          v-model="search"
          dense
          square
          dark
          borderless
          :placeholder="searchPlaceholder"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        )
          template(v-slot:append)
            q-icon(
              :name="mdiMagnify"
              @click="$refs.docAlgolia.focus()"
            )
      .layout-drawer-toolbar__shadow.absolute-full.overflow-hidden.no-pointer-events

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
      @leave="resetScroll"
    )
      router-view

  q-page-scroller
    q-btn(fab-mini, color="primary", glossy, :icon="mdiChevronUp")
</template>

<script>
import { scroll } from 'quasar'
import AppMenu from 'components/AppMenu'
import HeaderMenu from 'components/HeaderMenu'

import {
  mdiMenu, mdiClipboardText, mdiHeartOutline, mdiMagnify, mdiChevronUp
} from '@quasar/extras/mdi-v4'

export default {
  name: 'Layout',

  created () {
    this.mdiMenu = mdiMenu
    this.mdiClipboardText = mdiClipboardText
    this.mdiHeartOutline = mdiHeartOutline
    this.mdiMagnify = mdiMagnify
    this.mdiChevronUp = mdiChevronUp
  },

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
      searchFocused: false,
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
    },

    searchPlaceholder () {
      return this.searchFocused === true
        ? 'Type to start searching...'
        : (this.$q.platform.is.desktop === true ? `Type ' / ' to focus here...` : 'Search...')
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerState = !this.leftDrawerState
    },

    toggleRightDrawer () {
      this.rightDrawerState = !this.rightDrawerState
    },

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

        el.id = ''
      }

      window.location.hash = '#' + id

      if (el) {
        setTimeout(() => {
          el.id = id
        }, 300)
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

      for (const i in toc) {
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
    },

    focusOnSearch (evt) {
      if (
        evt.target.tagName !== 'INPUT' &&
        String.fromCharCode(evt.keyCode) === '/'
      ) {
        evt.preventDefault()
        this.search = ''
        if (!this.leftDrawerState) {
          this.leftDrawerState = true
        }
        setTimeout(() => {
          this.$refs.docAlgolia.focus()
        })
      }
    },

    onSearchFocus () {
      this.searchFocused = true
    },

    onSearchBlur () {
      this.searchFocused = false
    }
  },

  mounted () {
    // If we have a search string in the query (mostly from tab-to-search functionality),
    // we need to open the drawer to fill in the search string in the input later
    const searchQuery = this.$route.query.search
    if (searchQuery) {
      this.leftDrawerState = true
    }

    import('docsearch.js').then(docsearch => {
      docsearch.default({
        apiKey: '5c15f3938ef24ae49e3a0e69dc4a140f',
        indexName: 'quasar-framework',
        inputSelector: '.doc-algolia input',
        algoliaOptions: {
          hitsPerPage: 7
        },
        handleSelected: (a, b, suggestion, c, context) => {
          const url = suggestion.url.replace('https://quasar.dev', '')

          this.search = ''
          this.$router.push(url)
          this.$refs.docAlgolia.blur()
        }
      })

      if (this.$q.platform.is.desktop === true) {
        window.addEventListener('keypress', this.focusOnSearch)
      }

      if (searchQuery) {
        // Here we put search string from query into the input and open the search popup.
        // Unfortunately, this input is managed completely by Algolia and their code doesn't seem to
        // have a method of opening the popup programmatically, so we need to simulate typing on that input element.
        // We also need to dispatch the event only after the input text is populated and Vue will
        // do that in next render, so we schedule it on the next event loop iteration with setTimeout.
        this.search = searchQuery
        this.$refs.docAlgolia.focus()
        setTimeout(() => {
          this.$refs.docAlgolia.$refs.input.dispatchEvent(new Event('input', {}))
        })
      }
    })
  },

  beforeDestroy () {
    clearTimeout(this.scrollTimer)

    if (this.$q.platform.is.desktop === true) {
      window.removeEventListener('keypress', this.focusOnSearch)
    }
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
  > form
    margin-right: -2px
  &__shadow
    bottom: -10px
    &:after
      content: ''
      position: absolute
      top: 0
      right: 0
      bottom: 10px
      left: 0
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0px 10px rgba(0, 0, 0, 0.24)

.doc-algolia
  .q-field__control
    padding: 0 18px 0 16px !important
  &.q-field--focused
    .q-icon
      color: #fff

.q-drawer--mobile
  .layout-drawer-toolbar form
    margin-right: -1px
  .doc-algolia .q-field__control
    padding-right: 17px !important
  .doc-toc
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

.q-page-container :target
  scroll-margin-top: ($toolbar-min-height + 16px)
</style>
