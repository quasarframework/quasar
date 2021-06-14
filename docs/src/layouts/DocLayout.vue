<template lang="pug">
q-layout.doc-layout(view="lHh LpR lff", @scroll="onScroll")
  q-header.header.text-dark(bordered)
    q-toolbar.q-px-none
      q-btn.q-mx-sm.lt-md(flat, dense, round, @click="toggleLeftDrawer", aria-label="Menu", :icon="mdiMenu")

      q-btn.quasar-logo.text-bold(key="logo", flat, no-caps, no-wrap, stretch, to="/")
        img.quasar-logo__img(src="https://cdn.quasar.dev/logo-v2/svg/logo.svg")
        img.quasar-logo__logotype(src="https://cdn.quasar.dev/logo-v2/svg/logotype.svg")

      q-space

      header-menu.self-stretch.row.no-wrap(v-if="$q.screen.gt.xs")

      q-btn.q-mx-xs(
        v-show="showRightDrawerToggler"
        flat
        dense
        round
        @click="toggleRightDrawer"
        aria-label="Menu"
        :icon="mdiClipboardText"
      )

  q-drawer.doc-left-drawer(
    side="left"
    v-model="leftDrawerState"
    show-if-above
    bordered
  )
    q-scroll-area(style="height: calc(100% - 51px); margin-top: 51px")
      template(v-if="searchResults !== null")
        component(
          v-if="searchResults.masterComponent !== void 0"
          :is="searchResults.masterComponent"
        )
        app-search-results(
          v-else
          :results="searchResults"
          :search-has-focus="searchHasFocus"
          :search-active-id="searchActiveId"
        )

      template(v-else)
        .row.justify-center.q-my-md
          q-btn.doc-layout__main-btn(
            type="a"
            href="https://donate.quasar.dev"
            target="_blank"
            rel="noopener"
            color="teal"
            outline
            :icon="mdiHeart"
            label="Donate to Quasar"
            padding="12px lg"
            no-wrap
          )

        .row.justify-center.q-my-md
          q-btn.doc-layout__main-btn(
            type="a"
            href="https://bit.ly/3cTLXsO"
            target="_blank"
            color="brand-primary"
            outline
            :icon="mdiFileDocumentEditOutline"
            label="Survey results are out!"
            no-caps
            padding="12px lg"
            no-wrap
          )

        app-menu.q-mb-lg

    .absolute-top.header
      form(
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
      )
        q-input.full-width.app-search-input(
          ref="searchInputRef"
          v-model="searchTerms"
          dense
          square
          borderless
          debounce="300"
          @keydown="onSearchKeydown"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
          placeholder="Search..."
        )
          template(v-slot:prepend)
            q-icon(name="search")
          template(v-slot:append)
            q-icon.cursor-pointer(v-if="searchTerms" name="cancel" @click="onSearchClear")
            .row.items-center.no-wrap.no-pointer-events(v-else-if="!searchHasFocus")
              kbd.flex.flex-center /

      q-separator

  q-drawer(
    v-if="hasRightDrawer"
    side="right"
    v-model="rightDrawerState"
    show-if-above
    :width="220"
    @on-layout="updateRightDrawerOnLayout"
  )
    q-scroll-area.fit
      header-menu.q-mt-sm.text-brand-primary.column(v-if="$q.screen.lt.sm", align="right")

      q-list.doc-toc.q-my-sm.text-grey-8
        q-item(
          v-for="tocItem in tocList"
          :key="tocItem.id"
          clickable
          v-ripple
          dense
          @click="scrollTo(tocItem.id)",
          :active="activeToc === tocItem.id"
        )
          q-item-section(v-if="tocItem.sub === true", side) »
          q-item-section {{ tocItem.title }}

  q-page-container
    router-view

  q-page-scroller
    q-btn(fab-mini, color="brand-primary", glossy, :icon="mdiChevronUp")
</template>

<script>
import { scroll } from 'quasar'
import {
  mdiMenu, mdiClipboardText, mdiHeart, mdiMagnify, mdiChevronUp,
  mdiFileDocumentEditOutline
} from '@quasar/extras/mdi-v5'

import AppMenu from 'components/AppMenu'
import HeaderMenu from 'components/HeaderMenu'
import AppSearchResults from 'components/AppSearchResults'

import LayoutSearchMixin from './layout-search-mixin'

const { setScrollPosition, getScrollPosition } = scroll

export default {
  name: 'Layout',

  mixins: [
    LayoutSearchMixin
  ],

  created () {
    this.preventTocUpdate = this.$route.hash.length > 1

    this.mdiMenu = mdiMenu
    this.mdiClipboardText = mdiClipboardText
    this.mdiHeart = mdiHeart
    this.mdiMagnify = mdiMagnify
    this.mdiChevronUp = mdiChevronUp
    this.mdiFileDocumentEditOutline = mdiFileDocumentEditOutline
  },

  components: {
    AppMenu,
    HeaderMenu,
    AppSearchResults
  },

  data () {
    return {
      leftDrawerState: false,
      rightDrawerState: false,
      rightDrawerOnLayout: false,

      activeToc: this.$route.hash.length > 1
        ? this.$route.hash.substring(1)
        : void 0
    }
  },

  computed: {
    hasRightDrawer () {
      return this.tocList.length > 0 || this.$q.screen.lt.sm
    },

    showRightDrawerToggler () {
      return this.hasRightDrawer === true &&
        this.rightDrawerOnLayout === false
    },

    tocList () {
      const toc = this.$root.store.toc
      return toc.length > 0
        ? [
          { id: 'introduction', title: 'Introduction' },
          ...this.$root.store.toc
        ]
        : toc
    }
  },

  watch: {
    $route (newRoute, oldRoute) {
      this.leftDrawerState = this.$q.screen.width > 1023
      setTimeout(() => {
        this.scrollToCurrentAnchor(newRoute.path !== oldRoute.path)
      })
    },

    hasRightDrawer (shown) {
      if (shown === false) {
        this.rightDrawerState = false
      }
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerState = !this.leftDrawerState
    },

    toggleRightDrawer () {
      this.rightDrawerState = !this.rightDrawerState
    },

    resetScroll (_, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    },

    changeRouterHash (hash) {
      if (this.$route.hash !== hash) {
        this.$router.push({ hash }).catch(() => {})
      }
      else {
        this.scrollToCurrentAnchor()
      }
    },

    scrollTo (id) {
      clearTimeout(this.scrollTimer)

      if (this.rightDrawerOnLayout !== true) {
        this.rightDrawerState = false
        this.scrollTimer = setTimeout(() => {
          this.changeRouterHash('#' + id)
        }, 300)
      }
      else {
        this.changeRouterHash('#' + id)
      }
    },

    scrollPage (el, delay) {
      const { top } = el.getBoundingClientRect()
      const offset = Math.max(0, getScrollPosition(window) + top - 66)

      clearTimeout(this.scrollTimer)

      this.preventTocUpdate = true
      setScrollPosition(window, offset, delay)

      this.scrollTimer = setTimeout(() => {
        this.preventTocUpdate = false
      }, delay + 10)
    },

    updateRightDrawerOnLayout (state) {
      this.rightDrawerOnLayout = state
    },

    onScroll ({ position }) {
      if (
        this.preventTocUpdate !== true &&
        (this.rightDrawerOnLayout === true || this.rightDrawerState !== true)
      ) {
        this.updateActiveToc(position)
      }
    },

    updateActiveToc (position) {
      if (position === void 0) {
        position = getScrollPosition(window)
      }

      const toc = this.tocList
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

    scrollToCurrentAnchor (immediate) {
      const { hash } = this.$route
      const el = hash.length > 1
        ? document.getElementById(hash.substring(1))
        : null

      if (el !== null) {
        if (immediate === true) {
          let anchorEl = el
          while (anchorEl.parentElement !== null && anchorEl.parentElement.classList.contains('q-page') !== true) {
            anchorEl = anchorEl.parentElement
          }

          document.body.classList.add('q-scroll--lock')
          anchorEl.classList.add('q-scroll--anchor')

          setTimeout(() => {
            document.body.classList.remove('q-scroll--lock')
            anchorEl && anchorEl.classList.remove('q-scroll--anchor')
          }, 2000)
        }

        this.scrollPage(el, immediate === true ? 0 : 500)
      }
      else {
        this.preventTocUpdate = false
        this.updateActiveToc()
      }
    }
  },

  mounted () {
    this.scrollToCurrentAnchor(true)
  },

  beforeDestroy () {
    clearTimeout(this.scrollTimer)
  }
}
</script>

<style lang="sass">
@supports (backdrop-filter: none)
  .header
    background-color: rgba(0,0,0,.1)
    backdrop-filter: blur(7px)

@supports not (backdrop-filter: none)
  .header
    background-color: $grey-4

.header-logo
  width: 25px
  height: 25px

.doc-layout__main-btn
  width: 268px

.q-drawer--mobile
  .doc-toc
    .q-item
      margin-left: 3px
    .q-item--active
      font-weight: 600

.doc-toc .q-item
  border-radius: 10px 0 0 10px
  margin-top: 1px
  margin-bottom: 1px
  font-size: 12px

  .q-item__section--side
    padding-right: 8px

  &.q-item--active
    background: scale-color($brand-primary, $lightness: 90%)

.doc-left-drawer
  overflow: inherit !important

.quasar-logo
  &__img
    transform: rotate(0deg)
    transition: transform .8s ease-in-out
    width: 38px
    height: 38px
    margin-right: 8px

  &:hover &__img
    transform: rotate(-360deg)

  &__logotype
    height: 19px
    vertical-align: middle

.q-page-container :target
  scroll-margin-top: ($toolbar-min-height + 16px)

// keep the button on top of sticky in examples
.q-page-scroller > .q-page-sticky
  z-index: 1

.doc-layout
  .countdown
    .heading
      font-size: 18px
    .time
      font-size: 38px

.app-search-input,
.app-search-input .q-field__control
  height: 50px

.app-search-input
  .q-field__control
    padding: 0 18px 0 16px !important
  input
    line-height: 38px
  .q-field__prepend,
  .q-field__append
    height: 100%
    cursor: text !important
  kbd
    font-size: .6em !important
    min-width: 1.6em
    min-height: 1.5em
    font-weight: bold

body.mobile .app-search-input kbd
  display: none
</style>
