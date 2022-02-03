<template>
  <transition
    enter-active-class="animated slideInDown"
    leave-active-class="animated fadeOut"
  >
    <q-header
      v-if="primaryHeaderIsVisible"
      ref="layoutHeader"
      :class="dark? 'bg-white text-black-54':'bg-lp-dark text-white-54'"
      class="font-monserrat lp-header"
    >
      <q-toolbar
        :class="{ 'shadow-bottom-small': $q.screen.xs, 'letter-spacing-25': $q.screen.lt.lg, 'letter-spacing-300': $q.screen.gt.md, 'items-stretch': $q.screen.gt.xs }"
        class="primary-toolbar q-pl-lg q-pr-md justify-between text-size-16"
      >
        <q-btn
          v-if="$q.screen.xs"
          color="lp-primary"
          dense
          flat
          icon="menu"
          round
          @click="$emit('update:modelValue', !modelValue)"/>
        <router-link
          v-if="$q.screen.gt.xs || !isSearchFieldActive"
          class="row justify-center items-center cursor-pointer"
          :to="{ name: 'home' }"
        >
          <img
            v-if="$q.screen.sm"
            :src="`https://cdn.quasar.dev/logo-v2/svg/logo${!dark? '-dark':''}.svg`"
            alt="Quasar Logo"
            height="48"
            width="48">
          <img
            v-else
            :height="$q.screen.xs? '24':'48'"
            :src="`https://cdn.quasar.dev/logo-v2/svg/logo-horizontal${!dark? '-dark':''}.svg`"
            alt="Quasar Logo"
            width="236">
          <q-separator
            v-if="$q.screen.gt.xs"
            :color="dark? 'black-12':'lp-primary'"
            class="q-ml-lg"
            vertical/>
        </router-link>

        <div class="row items-center">
          <div
            v-if="$q.screen.gt.xs && showNavItems"
            class="toolbar-menu-items">
            <header-nav-link
              v-for="(navItem, navItemIndex) in navItems.mainNavItems"
              :key="navItemIndex"
              :dark="dark"
              :nav-item="navItem"
              :padding="`xs ${$q.screen.name}`"
              nav-item-class="text-size-16"
            />
          </div>
          <div ref="searchForm">
            <search-quasar-form
              :dark="dark"
              :is-open-by-default="$q.screen.gt.md"
              :show-search-input-field="isSearchFieldActive"
              :class="$q.screen.gt.md? 'q-ml-lg':''"
              @focus-by-keyboard="isSearchFieldActive = true"
            />
          </div>
        </div>

      </q-toolbar>
      <q-separator :color="dark? 'black-12':'lp-primary'"/>
      <template v-if="$q.screen.gt.xs">
        <q-toolbar
          :class="!dark? 'add-bottom-glow':''"
          class="q-pl-none q-pr-md secondary-toolbar letter-spacing-225">
          <q-btn
            v-if="$q.screen.sm"
            class="q-pl-sm q-mx-md"
            color="lp-primary"
            dense
            flat
            icon="menu"
            round
            @click="$emit('update:modelValue', !modelValue)"/>
          <q-btn-dropdown
            :class="$q.screen.gt.sm ? 'q-ml-lg' : ''"
            align="left"
            auto-close
            class="text-weight-bold version-dropdown"
            color="lp-primary"
            content-class="shadow-bottom-medium"
            dense
            no-caps
            outline
            padding="sm">
            <template #label>
              <span
                :class="dark? 'text-dark':'text-white'"
                class="text-size-12 letter-spacing-225">{{ `v${$q.version}` }}</span>
              <!-- q-space for space before icon -->
              <q-space/>
            </template>
            <nav-dropdown-menu :nav-items="versionHistory"/>
          </q-btn-dropdown>
          <template v-if="$q.screen.sm">
            <q-separator
              :color="dark? 'black-12':'lp-primary'"
              class="q-ml-md q-mr-sm"
              inset
              vertical/>
            <q-btn-dropdown
              :color="dark? 'text-dark':'text-white'"
              :menu-offset="[150, 5]"
              class="font-monserrat text-weight-bold text-size-12"
              dense
              flat
              label="More"
              menu-anchor="bottom right"
              no-caps>
              <nav-dropdown-menu :nav-items="moreNavItems"/>
            </q-btn-dropdown>
          </template>

          <q-space/>

          <template v-if="$q.screen.gt.sm">
            <!-- navItems.subNavItems.slice(0, -1): We remove "Quasar brand resources" link when on smaller viewports -->
            <header-nav-link
              v-for="(subNavItem, navIndex) in $q.screen.gt.md ? navItems.subNavItems : navItems.subNavItems.slice(0, -1)"
              :key="`nav-${navIndex}`"
              :dark="dark"
              :nav-item="subNavItem"
              nav-item-class="text-size-12 text-capitalize"
            />
          </template>

          <q-btn
            v-for="(socialLink, socialLinkIndex) in socialLinks"
            :key="`social-${socialLinkIndex}`"
            :color="dark? 'black-54':'lp-primary'"
            :href="socialLink.href"
            :icon="socialLink.icon"
            flat
            padding="sm"
            round
            size="md"
            target="__blank"
            type="a"
          />
        </q-toolbar>
        <q-separator :color="dark? 'black-12':'lp-primary'"/>
      </template>
    </q-header>
    <q-header
      v-else
      ref="layoutHeader"
      :class="dark? 'bg-white text-black-54':'bg-lp-dark text-white-54'"
      class="font-monserrat lp-header">
      <q-toolbar
        :class="{
          'add-bottom-glow': !dark,
          'shadow-bottom-small': $q.screen.xs,
          'letter-spacing-25': $q.screen.lt.lg,
          'letter-spacing-225': $q.screen.gt.md,
          'items-stretch': $q.screen.gt.xs }"
        class="secondary-header q-pl-lg q-pr-md justify-between"
      >
        <q-btn
          v-if="$q.screen.xs"
          color="lp-primary"
          dense
          flat
          icon="menu"
          round
          @click="$emit('update:modelValue', !modelValue)"/>
        <a
          v-if="$q.screen.gt.xs || !isSearchFieldActive"
          class="row justify-center items-center cursor-pointer"
          href="/"
        >
          <img
            v-if="$q.screen.sm"
            :src="`https://cdn.quasar.dev/logo-v2/svg/logo${!dark? '-dark':''}.svg`"
            alt="Quasar Logo"
            height="48"
            width="48">
          <img
            v-else
            :height="$q.screen.xs? '24':'48'"
            :src="`https://cdn.quasar.dev/logo-v2/svg/logo-horizontal${!dark? '-dark':''}.svg`"
            alt="Quasar Logo"
            width="236">
          <q-separator
            v-if="$q.screen.gt.xs"
            :color="dark? 'black-12':'lp-primary'"
            class="q-ml-lg"
            vertical/>
          <q-btn-dropdown
            v-if="$q.screen.gt.sm"
            :class="$q.screen.gt.sm ? 'q-ml-lg' : 'q-ml-sm'"
            align="left"
            auto-close
            class="text-weight-bold version-dropdown"
            color="lp-primary"
            content-class="shadow-bottom-medium"
            dense
            no-caps
            outline
            padding="sm">
            <template #label>
              <span
                :class="dark? 'text-dark':'text-white'"
                class="text-size-12 letter-spacing-225">{{ `v${$q.version}` }}</span>
              <!-- q-space for space before icon -->
              <q-space/>
            </template>
            <nav-dropdown-menu :nav-items="versionHistory"/>
          </q-btn-dropdown>
        </a>
        <div class="row items-center text-size-12">
          <div
            v-if="$q.screen.gt.xs && showNavItems"
            class="toolbar-menu-items">
            <header-nav-link
              v-for="(navItem, navItemIndex) in secondaryHeaderNavItems"
              :key="navItemIndex"
              :dark="dark"
              :nav-item="navItem"
              nav-item-class="text-size-12 text-capitalize"
            />
          </div>
          <div ref="searchForm">
            <search-quasar-form
              :dark="dark"
              :is-open-by-default="$q.screen.gt.md"
              :show-search-input-field="isSearchFieldActive"
              :class="$q.screen.gt.md? 'q-ml-md':''"
              @focus-by-kbd="isSearchFieldActive = true"
            />
          </div>
        </div>
      </q-toolbar>
      <q-separator :color="dark? 'black-12':'lp-primary'"/>
    </q-header>
  </transition>
</template>
<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import { mdiBug, mdiClipboardText, mdiGithub } from '@quasar/extras/mdi-v6'
import { socialLinks } from 'assets/landing-page/social-links.js'
import { Screen, useQuasar } from 'quasar'
import { navItems, secondaryHeaderNavItems } from 'assets/landing-page/nav-items.js'
import NavDropdownMenu from 'components/landing-page/NavDropdownMenu'
import SearchQuasarForm from 'components/landing-page/SearchQuasarForm'
import HeaderNavLink from 'components/landing-page/HeaderNavLink'

const SWAP_HEADER_OFFSET = 100

export default defineComponent({
  name: 'MainLayoutHeader',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    dark: {
      type: Boolean,
      default: false
    },
    scrollData: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    HeaderNavLink,
    SearchQuasarForm,
    NavDropdownMenu
  },
  setup (props) {
    const $q = useQuasar()
    const isSearchFieldActive = ref(false)
    const showNavItems = ref(true)
    const searchForm = ref()
    const scrollOffSetInitPosition = ref(props.scrollData?.position)
    const scrollDirection = ref(props.scrollData?.direction)
    const primaryHeaderIsVisible = ref(true)

    const versionHistory = [
      {
        label: `Latest (v${$q.version})`,
        isHeader: true
      },
      {
        label: 'Release notes',
        icon: mdiClipboardText,
        path: 'start/release-notes'
      },
      {
        label: 'Report a bug',
        icon: mdiBug,
        href: 'https://github.com/quasarframework/quasar/issues'
      },
      {
        label: 'Repository',
        icon: mdiGithub,
        href: 'https://github.com/quasarframework'
      },
      {
        isSeparator: true
      },
      {
        label: 'Older Releases',
        isHeader: true
      },
      {
        label: 'v1 docs',
        href: 'https://v1.quasar.dev/'
      },
      {
        label: 'v0.17 docs',
        href: 'https://v0-17.quasar-framework.org/'
      },
      {
        label: 'v0.16 docs',
        href: 'https://v0-16.quasar-framework.org/'
      },
      {
        label: 'v0.15 docs',
        href: 'https://v0-15.quasar-framework.org/'
      },
      {
        label: 'v0.14 docs',
        href: 'https://v0-14.quasar-framework.org/'
      },
      {
        label: 'v0.13 docs',
        href: 'https://v0-13.quasar-framework.org/'
      }
    ]

    // add components nav item to the 'More' dropdown
    const moreNavItems = [
      {
        label: 'Components',
        path: 'components'
      },
      ...navItems.subNavItems
    ]

    onMounted(() => {
      document.body.addEventListener('click', (e) => {
        // if the element clicked is part of the search form (i.e: the search input field, the search result scroll area or the search icon)
        // then leave the search form open, otherwise, close it
        if (searchForm.value && searchForm.value.contains(e.target)) {
          isSearchFieldActive.value = true
          showNavItems.value = !Screen.lt.lg
        }
        else {
          isSearchFieldActive.value = false
          // irrespective of the viewport, show nav items since search form is hidden
          showNavItems.value = true
        }
      })
    })

    watch(() => props.scrollData, (currentScrollData) => {
      // scroll direction has changed
      if (currentScrollData.direction !== scrollDirection.value) {
        scrollOffSetInitPosition.value = currentScrollData.position
        scrollDirection.value = currentScrollData.direction
      }
      if (Math.abs(currentScrollData.position - scrollOffSetInitPosition.value) >= SWAP_HEADER_OFFSET) {
        primaryHeaderIsVisible.value = currentScrollData.direction !== 'down'
      }
    })

    return {
      mdiGithub,
      mdiBug,
      mdiClipboardText,
      navItems,
      socialLinks,
      isSearchFieldActive,
      showNavItems,
      versionHistory,
      moreNavItems,
      searchForm,
      secondaryHeaderNavItems,
      primaryHeaderIsVisible,
      SWAP_HEADER_OFFSET
    }
  }
})
</script>
<style lang="scss" scoped>
$footer-columns-md-min: 6;
$footer-columns-sm-min: 4;
$adjust-header-viewport: 860px;

// remove second child, (components nav)
.toolbar-menu-items {
  .q-btn:nth-child(2) {
    @media screen and (max-width: $adjust-header-viewport) {
      display: none;
    }
  }
}

.primary-toolbar {
  height: 64px;
  @media screen and (min-width: $breakpoint-xs-max) {
    height: 92px;
  }
}

.secondary-toolbar {
  height: 62px;
}

.secondary-header {
  height: 64px;
}

.white-color-on-hover:hover {
  // some components may be using some other css to change the color, prevent with !important
  color: $white !important;
}

.version-dropdown {
  width: 220px;
}

.lp-header {
  transition: all .3s ease-in-out;
}

.add-bottom-glow {
  transition: all .5s;
  animation: bottom-glow 1.5s ease-in-out infinite alternate;
}

@keyframes bottom-glow {
  0% {
    box-shadow: 0 6px 6px 0 rgba($lp-primary, 0.48);
  }
  to {
    box-shadow: 0 4.5px 4.5px 0 rgba($lp-primary, 0.28);
  }
}
</style>
