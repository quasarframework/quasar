<template>
  <q-header class="bg-lp-dark font-monserrat">
    <q-toolbar :class="$q.screen.xs? 'shadow-bottom-small':''" class="primary-toolbar q-pl-lg q-pr-md justify-between items-stretch">
      <q-btn v-if="$q.screen.xs" flat @click="$emit('update:modelValue', !modelValue)" round dense icon="menu" color="lp-primary"/>
      <div v-if="$q.screen.gt.xs || !isSearchFieldActive" class="row justify-center items-center cursor-pointer" @click="$router.push({name: 'home'})">
        <img v-if="$q.screen.sm" src="https://cdn.quasar.dev/logo-v2/svg/logo-dark.svg" width="48" height="48" alt="Quasar Logo">
        <img v-else src="https://cdn.quasar.dev/logo-v2/svg/logo-horizontal-dark.svg" width="236" :height="$q.screen.xs? '24':'48'" alt="Quasar Logo">
        <q-separator v-if="$q.screen.gt.xs" vertical color="lp-primary" class="q-ml-lg" />
      </div>

      <div class="row items-center text-size-16">
        <div v-if="$q.screen.gt.xs && showNavItems" class="toolbar-menu-items">
          <q-btn
              v-for="(navItem, navItemIndex) in navItems.mainNavItems" :key="navItemIndex"
              :label="navItem.label"
              :to="computeRouteNav(navItem)"
              :href="computeRouteNav(navItem, 'href')"
              :target="navItem.href? '_blank':'_self'"
              :color="$route.path === `/${navItem.path}`? 'white' : 'white-54'"
              :padding="`xs ${$q.screen.name}`"
              class="text-weight-bold text-size-16"
              flat
          >
            <q-menu v-if="navItem.subMenu" class="shadow-bottom-small">
              <nav-dropdown-menu :nav-items="navItem.subMenu"/>
            </q-menu>
          </q-btn>
        </div>
        <q-form v-if="isSearchFieldActive" autocapitalize="off" autocomplete="off" spellcheck="false" class="search-form position-relative">
          <q-input ref="searchInputRef" autofocus v-model="searchTerms" dark dense square debounce="300" @keydown="onSearchKeydown" @focus="onSearchFocus" @blur="onSearchBlur" placeholder="Search Quasar v2...">
            <template #append>
              <q-icon name="cancel" color="lp-primary" @click.stop="toggleSearchInputField" />
            </template>
          </q-input>
          <div class="search-result-field">
            <q-scroll-area dark class="bg-dark text-white rounded-borders search-result-container">
              <template v-if="searchResults !== null">
                <component v-if="searchResults.masterComponent !== void 0" :is="searchResults.masterComponent"/>
                <app-search-results v-else :results="searchResults" :search-has-focus="searchHasFocus" :search-active-id="searchActiveId"/>
              </template>
            </q-scroll-area>
          </div>
        </q-form>
        <q-btn v-else flat round color="lp-primary" icon="search" size="12px" @click="toggleSearchInputField"/>
      </div>

    </q-toolbar>
    <q-separator color="lp-primary"/>
    <template v-if="$q.screen.gt.xs">
      <q-toolbar class="q-pl-none q-pr-md secondary-toolbar shadow-bottom-small">
        <q-btn v-if="$q.screen.sm" class="q-pl-sm q-mx-md" flat round dense icon="menu" color="lp-primary" @click="$emit('update:modelValue', !modelValue)"/>
        <q-btn-dropdown no-caps dense auto-close align="left" class="text-weight-bold version-dropdown" :class="$q.screen.gt.sm ? 'q-ml-lg' : ''" padding="sm" outline color="lp-primary">
          <template #label>
            <span class="text-white text-size-12">{{ `v${$q.version}` }}</span>
            <q-space />
          </template>
          <nav-dropdown-menu :nav-items="versionHistory"/>
        </q-btn-dropdown>
        <template v-if="$q.screen.sm">
          <q-separator vertical inset color="lp-primary" class="q-ml-md q-mr-sm"/>
          <q-btn-dropdown color="white-54" class="font-monserrat text-weight-bold text-size-12" no-caps dense label="More" flat menu-anchor="bottom right" :menu-offset="[150, 5]">
            <nav-dropdown-menu :nav-items="moreNavItems"/>
          </q-btn-dropdown>
        </template>

        <q-space/>

        <template v-if="$q.screen.gt.sm">
          <!-- We remove "Quasar brand resources" link when on smallwe viewports -->
          <q-btn
            v-for="(subNavItem, navIndex) in $q.screen.gt.md ? navItems.subNavItems : navItems.subNavItems.slice(0, -1)"
            :key="`nav-${navIndex}`"
            :label="subNavItem.label"
            :to="computeRouteNav(subNavItem)"
            :href="computeRouteNav(subNavItem, 'href')"
            :target="subNavItem.href? '_blank':'_self'"
            flat
            color="white-54"
            no-caps
            size="12px"
            class="text-weight-bold"
          >
            <q-menu v-if="subNavItem.subMenu" class="shadow-bottom-small">
              <nav-dropdown-menu :nav-items="subNavItem.subMenu"/>
            </q-menu>
          </q-btn>
        </template>

        <q-btn
          v-for="(socialLink, socialLinkIndex) in socialLinks"
          :key="`social-${socialLinkIndex}`"
          :icon="socialLink.icon"
          flat color="lp-primary" round padding="sm" size="md"
          type="a" :href="socialLink.href" target="__blank"
        />
      </q-toolbar>
      <q-separator color="lp-primary"/>
    </template>
  </q-header>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { mdiBug, mdiClipboardText, mdiGithub } from '@quasar/extras/mdi-v6'
import { socialLinks } from 'assets/landing-page/social-links.js'
import useSearch from 'layouts/doc-layout/use-search'
import { Screen, useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import AppSearchResults from 'components/AppSearchResults.vue'
import { navItems } from 'assets/landing-page/nav-items.js'
import { computeRouteNav } from 'assets/landing-page/nav-items.js'
import NavDropdownMenu from 'components/landing-page/NavDropdownMenu'

export default defineComponent({
  name: 'MainLayoutHeader',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NavDropdownMenu,
    AppSearchResults
  },
  setup () {
    const $q = useQuasar()
    const $route = useRoute()
    const isSearchFieldActive = ref(false)
    const showNavItems = ref(true)

    function toggleSearchInputField () {
      if (isSearchFieldActive.value) {
        showNavItems.value = true
      }
      else if (Screen.lt.lg) {
        showNavItems.value = false
      }
      else {
        showNavItems.value = true
      }

      isSearchFieldActive.value = !isSearchFieldActive.value
    }

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

    const scope = {
      mdiGithub,
      mdiBug,
      mdiClipboardText,
      navItems,
      socialLinks,
      isSearchFieldActive,
      showNavItems,
      versionHistory,
      moreNavItems,
      computeRouteNav,
      toggleSearchInputField
    }

    useSearch(scope, $q, $route)

    return scope
  }
})
</script>
<style lang="scss" scoped>
$footer-columns-md-min: 6;
$footer-columns-sm-min: 4;
$adjust-header-viewport: 860px;
$search-form-width: 300px;

// remove second child, (components nav)
.toolbar-menu-items {
  .q-btn:nth-child(2) {
    @media screen and (max-width: $adjust-header-viewport) {
      display: none;
    }
  }
}

.primary-toolbar {
  height: 92px;
}

.secondary-toolbar {
  height: 62px;
}

.version-dropdown {
  width: 220px;
}

.search-form {
  width: $search-form-width;
}

.search-result-field {
  position: absolute;
  left: 0;
  z-index: 10000;
  width: $search-form-width;
}

.search-result-container {
  height: 80vh;
  max-width: $search-form-width;
}
</style>
