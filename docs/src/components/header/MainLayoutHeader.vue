<template>
  <transition
    enter-active-class="animated slideInDown"
    leave-active-class="animated fadeOut"
  >
    <!-- TODO: many components here should be extracted and reused into different header versions -->
    <!-- mobile header -->
    <q-header
      v-if="showMobileHeader"
      ref="layoutHeader"
      :class="headerClasses"
    >
      <q-toolbar
        class="primary-toolbar q-pl-lg q-pr-md justify-between text-size-16 letter-spacing-300 shadow-bottom-small"
      >
        <q-btn
          color="brand-primary"
          dense
          flat
          icon="menu"
          round
          @click="$emit('update:modelValue', !modelValue)"
        />
        <router-link
          v-if="!isSearchFieldActive"
          class="cursor-pointer"
          :to="{ name: 'landing' }"
        >
          <img
            height="24"
            :src="`https://cdn.quasar.dev/logo-v2/svg/logo-horizontal${dark? '-dark':''}.svg`"
            alt="Quasar Logo"
            width="236"
          >
        </router-link>

        <div class="row items-center">
          <div ref="searchForm">
            <search-form
              :dark="dark"
              :is-open-by-default="false"
              :show-search-input-field="isSearchFieldActive"
              @focus-by-keyboard="isSearchFieldActive = true"
              @search-result-change="preventHeaderSwapping"
            />
          </div>
        </div>

      </q-toolbar>
    </q-header>
    <!-- expanded header -->
    <q-header
      v-else-if="isExpanded"
      ref="layoutHeader"
      :class="headerClasses"
    >
      <q-toolbar
        class="primary-toolbar q-pl-lg q-pr-md justify-between text-size-16 letter-spacing-300 items-stretch"
      >
        <router-link
          class="row justify-center items-center cursor-pointer"
          :to="{ name: 'landing' }"
        >
          <img
            :src="`https://cdn.quasar.dev/logo-v2/svg/logo${$q.screen.gt.sm ? '-horizontal' : ''}${dark? '-dark':''}.svg`"
            alt="Quasar Logo"
            height="48"
            :width="$q.screen.gt.sm ? 236 : 48"
          >
          <q-separator
            :color="dark? 'brand-primary':'black-12'"
            class="q-ml-lg"
            vertical
          />
        </router-link>

        <div class="row items-center">
          <div v-if="showNavItems" class="toolbar-menu-items">
            <header-nav-link
              v-for="(navItem, navItemIndex) in mainToolbarNavItems"
              :key="navItemIndex"
              :dark="dark"
              :nav-item="navItem"
              :padding="expandedHeaderNavItemPadding"
              nav-item-class="text-size-16"
            />
          </div>
          <div ref="searchForm">
            <search-form
              :dark="dark"
              :is-open-by-default="$q.screen.gt.md"
              :show-search-input-field="isSearchFieldActive"
              :class="$q.screen.gt.md ? 'q-ml-lg' : ''"
              @focus-by-keyboard="isSearchFieldActive = true"
              @search-result-change="preventHeaderSwapping"
            />
          </div>
          <theme-switcher />
        </div>
      </q-toolbar>
      <q-separator :color="dark? 'brand-primary':'black-12'"/>
      <q-toolbar
        :class="dark? 'add-bottom-glow':''"
        class="q-pl-none q-pr-md secondary-toolbar letter-spacing-225">
        <q-btn
          v-if="$q.screen.sm"
          class="q-pl-sm q-mx-md"
          color="brand-primary"
          dense
          flat
          icon="menu"
          round
          @click="$emit('update:modelValue', !modelValue)"
        />

        <nav-dropdown-btn
          :items="versionHistory"
          :class="$q.screen.gt.sm ? 'q-ml-lg q-mr-md' : ''"
          class="text-weight-bold version-dropdown"
          color="brand-primary"
          content-class="shadow-bottom-medium"
          outline
          padding="sm"
        >
          <template #label>
            <span
              :class="dark ? 'text-white' : 'text-dark'"
              class="text-size-12 letter-spacing-225">{{ `v${$q.version}` }}</span>
            <!-- q-space for space before icon -->
            <q-space/>
          </template>
        </nav-dropdown-btn>

        <template v-if="$q.screen.sm">
          <q-separator
            :color="dark ? 'brand-primary' : 'black-12'"
            class="q-ml-md q-mr-sm"
            inset
            vertical/>
          <nav-dropdown-btn
            :color="dark ? 'text-dark' : 'text-white'"
            :items="moreDropdownNavItems"
            :menu-offset="[150, 5]"
            class="font-monserrat text-weight-bold text-size-12"
            flat
            label="More"
          />
        </template>

        <q-space/>

        <template v-if="$q.screen.gt.sm">
          <header-nav-link
            v-for="(navItem, navIndex) in secondaryToolbarNavItems"
            :key="`nav-${navIndex}`"
            :dark="dark"
            :nav-item="navItem"
            nav-item-class="text-size-12 text-capitalize"
          />
        </template>

        <template v-if="$q.screen.gt.md">
          <q-btn
            v-for="(socialLink, socialLinkIndex) in socialLinks"
            :key="`social-${socialLinkIndex}`"
            :color="dark ? 'brand-primary' : 'black-54'"
            :href="socialLink.href"
            :icon="socialLink.icon"
            flat
            padding="sm"
            round
            size="md"
            target="__blank"
            type="a"
          >
            <q-tooltip class="letter-spacing-263">
              {{ socialLink.label }}
            </q-tooltip>
          </q-btn>
        </template>
      </q-toolbar>
      <q-separator :color="dark? 'brand-primary':'black-12'"/>
    </q-header>
    <!-- dense header -->
    <q-header
      v-else
      ref="layoutHeader"
      :class="headerClasses"
    >
      <q-toolbar
        :class="{
          'add-bottom-glow': dark,
          'letter-spacing-25': $q.screen.lt.lg,
          'letter-spacing-225': $q.screen.gt.md,
        }"
        class="dense-header q-pl-lg q-pr-md justify-between items-stretch"
      >
        <div class="row justify-start items-center cursor-pointer">
          <router-link :to="{ name: 'landing' }" class="q-mr-sm">
            <img
              :src="`https://cdn.quasar.dev/logo-v2/svg/logo${$q.screen.gt.sm ? '-horizontal' : ''}${dark? '-dark':''}.svg`"
              alt="Quasar Logo"
              height="36"
            >
          </router-link>
          <q-separator
            v-if="showDenseSeparator"
            :color="dark? 'brand-primary':'black-12'"
            class="q-mx-md"
            vertical
          />
          <nav-dropdown-btn
            :class="$q.screen.gt.sm ? 'q-ml-lg q-mr-md version-dropdown-dense' : ''"
            :items="versionHistory"
            class="text-weight-bold"
            color="brand-primary"
            content-class="shadow-bottom-medium"
            outline
            padding="xs xs"
          >
            <template #label>
              <span
                :class="dark ? 'text-white' : 'text-dark'"
                class="text-size-12 letter-spacing-225"
              >
                {{ `v${$q.version}` }}
              </span>
              <!-- q-space for space before icon -->
              <q-space/>
            </template>
          </nav-dropdown-btn>
        </div>
        <div class="row items-center text-size-12">
          <div
            v-if="showNavItems"
            class="toolbar-menu-items">
            <header-nav-link
              v-for="(navItem, navItemIndex) in denseToolbarNavItems"
              :key="navItemIndex"
              :dark="dark"
              :nav-item="navItem"
              :padding="denseHeaderNavItemPadding"
              nav-item-class="text-size-12 text-capitalize"
            />
          </div>
          <div ref="searchForm">
            <search-form
              :dark="dark"
              :is-open-by-default="$q.screen.gt.md"
              :show-search-input-field="isSearchFieldActive"
              :class="$q.screen.gt.md ? 'q-ml-md' : ''"
              @focus-by-kbd="isSearchFieldActive = true"
              @search-result-change="preventHeaderSwapping"
            />
          </div>
          <theme-switcher />
        </div>
      </q-toolbar>
      <q-separator :color="dark ? 'brand-primary' : 'black-12'" />
    </q-header>
  </transition>
</template>
<script>
import { mdiBug, mdiClipboardText, mdiGithub } from '@quasar/extras/mdi-v6'
import { HEADER_SCROLL_OFFSET as SWAP_HEADER_OFFSET_DOWN } from 'assets/landing-page/constants.js'
import { socialLinks } from 'assets/landing-page/social-links.js'
import HeaderNavLink from 'components/header/HeaderNavLink.vue'
import NavDropdownBtn from 'components/header/NavDropdownBtn.vue'
import ThemeSwitcher from 'components/landing-page/ThemeSwitcher.vue'
import SearchForm from 'components/search-results/SearchForm.vue'
import { useQuasar } from 'quasar'
import {
  denseHeaderNavItems,
  expandedHeaderMainToolbarNavItems,
  expandedHeaderMoreDropdownNavItems,
  expandedHeaderSecondaryToolbarNavItems,
  filterNavItems
} from 'src/assets/landing-page/nav-items.js'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const SWAP_HEADER_OFFSET_UP = 200
const HIDE_COMPONENT_NAV_ITEM_VIEWPORT = 880
const HIDE_COMPONENT_DENSE_NAV_ITEM_VIEWPORT = 770
const HIDE_ANNOUNCEMENTS_NAV_ITEM_VIEWPORT = 1300

const getVersionHistory = (quasarVersion) => [
  {
    label: `Latest (v${quasarVersion})`,
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

export default defineComponent({
  name: 'MainLayoutHeader',
  components: {
    HeaderNavLink,
    SearchForm,
    ThemeSwitcher,
    NavDropdownBtn
  },
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
  setup (props) {
    const $q = useQuasar()
    const $route = useRoute()

    const versionHistory = getVersionHistory($q.version)

    const searchForm = ref()
    const isSearchFieldActive = ref(false)
    const areSearchResultsDisplayed = ref(false)

    const isExpanded = ref(true)
    const scrollOffSetInitPosition = ref(props.scrollData?.position)
    const scrollDirection = ref(props.scrollData?.direction)

    const showNavItems = ref(true)

    onMounted(() => {
      document.body.addEventListener('click', (e) => {
        // if the element clicked is part of the search form (i.e: the search input field, the search result scroll area or the search icon)
        // then leave the search form open, otherwise, close it
        isSearchFieldActive.value = searchForm.value && searchForm.value.contains(e.target)
      })
    })

    watch(isSearchFieldActive, isActive => {
      showNavItems.value = isActive ? !$q.screen.lt.lg : true
    })

    function preventHeaderSwapping (searchResults) {
      areSearchResultsDisplayed.value = !!searchResults
    }

    watch(() => props.scrollData, (currentScrollData) => {
      // if search form is shown, then stop any possible header change
      // a header change will prevent search result form from staying visible when one
      // of the result items is clicked and the page scrolls to it
      if (areSearchResultsDisplayed.value) {
        return
      }
      // scroll direction has changed
      if (currentScrollData.direction !== scrollDirection.value) {
        scrollOffSetInitPosition.value = currentScrollData.position
        scrollDirection.value = currentScrollData.direction
      }
      const scrollDirectionOffset = currentScrollData.direction === 'down' ? SWAP_HEADER_OFFSET_DOWN : SWAP_HEADER_OFFSET_UP
      if (Math.abs(currentScrollData.position - scrollOffSetInitPosition.value) >= scrollDirectionOffset) {
        isExpanded.value = currentScrollData.direction !== 'down'
      }
      // when at the top always display the primary header
      if (props.scrollData.position <= SWAP_HEADER_OFFSET_DOWN) {
        isExpanded.value = true
      }
    })

    watch(() => $route.path, () => {
      // when navigating to a new doc page, always force the primary header to be displayed
      isExpanded.value = true
    })

    const mainToolbarNavItems = computed(() => {
      const pagesToHide = []

      if ($q.screen.width < HIDE_COMPONENT_NAV_ITEM_VIEWPORT) {
        pagesToHide.push('components')
      }

      return filterNavItems(expandedHeaderMainToolbarNavItems, pagesToHide)
    })

    const secondaryToolbarNavItems = computed(() => {
      const pagesToHide = []

      if ($q.screen.md) {
        pagesToHide.push('brand-resources')
      }

      if ($q.screen.width < HIDE_ANNOUNCEMENTS_NAV_ITEM_VIEWPORT) {
        pagesToHide.push('announcements')
      }

      if ($q.screen.gt.md) {
        pagesToHide.push('socials')
      }

      return filterNavItems(expandedHeaderSecondaryToolbarNavItems, pagesToHide)
    })

    const moreDropdownNavItems = computed(() => {
      const pagesToHide = []

      if ($q.screen.width >= HIDE_COMPONENT_NAV_ITEM_VIEWPORT) {
        pagesToHide.push('components')
      }

      return filterNavItems(expandedHeaderMoreDropdownNavItems, pagesToHide)
    })

    const denseToolbarNavItems = computed(() => {
      const pagesToHide = []

      if ($q.screen.width < HIDE_COMPONENT_DENSE_NAV_ITEM_VIEWPORT) {
        pagesToHide.push('components')
      }

      return filterNavItems(denseHeaderNavItems, pagesToHide)
    })

    // We need to adjust the padding at some viewports, to prevent the icon or some other nav item
    // from collapsing while keeping the airy (spacious) nature of the main header.
    const expandedHeaderNavItemPadding = computed(() => {
      if ($q.screen.width >= $q.screen.sizes.sm && $q.screen.width < 630) {
        return 'xs sm'
      }

      if ($q.screen.width >= 630 && $q.screen.width < 700) {
        return 'xs md'
      }

      if ($q.screen.width >= 1020 && $q.screen.width < 1070) {
        return 'xs md'
      }

      return 'xs lg'
    })

    // on these particular viewports, we reduce the padding on the dense header to prevent
    // icon or some items from collapsing.
    const denseHeaderNavItemPadding = computed(() => {
      if ($q.screen.width >= $q.screen.sizes.md && $q.screen.width < 1500) {
        return 'xs sm'
      }

      if ($q.screen.width >= 769 && $q.screen.width < 820) {
        return 'xs sm'
      }

      if ($q.screen.width >= $q.screen.sizes.sm && $q.screen.width < 685) {
        return 'xs sm'
      }

      return 'xs md'
    })
    // hide separator on this specific viewport to prevent version dropdown from collapsing
    const showDenseSeparator = computed(() => {
      return !($q.screen.width >= $q.screen.sizes.sm && $q.screen.width < 641)
    })

    const headerClasses = computed(() => `${props.dark ? 'bg-dark text-white-54' : 'bg-white text-black-54'} font-monserrat header`)

    const showMobileHeader = computed(() => {
      const isInLandscapeMode = $q.screen.width > $q.screen.height
      const isTooWide = $q.screen.width > 1000 // we consider only widths below this value
      return $q.screen.xs || ($q.platform.is.mobile && isInLandscapeMode && !isTooWide)
    })

    return {
      versionHistory,
      mdiGithub,
      mdiBug,
      mdiClipboardText,

      mainToolbarNavItems,
      secondaryToolbarNavItems,
      moreDropdownNavItems,
      denseToolbarNavItems,
      socialLinks,

      headerClasses,
      expandedHeaderNavItemPadding,
      denseHeaderNavItemPadding,
      showDenseSeparator,

      isSearchFieldActive,
      searchForm,

      isExpanded,
      preventHeaderSwapping,
      showMobileHeader,

      showNavItems
    }
  }
})
</script>

<style lang="scss" scoped>
.primary-toolbar {
  height: 64px;
  @media screen and (min-width: $breakpoint-xs-max) {
    height: 92px;
  }
}

.secondary-toolbar {
  height: 62px;
}

.dense-header {
  height: 64px;
}

.version-dropdown {
  width: 220px;
}

.version-dropdown-dense {
  width: 156px;
}

.header {
  transition: all .3s ease-in-out;
}

.add-bottom-glow {
  transition: all 0.5s;
  animation: bottom-glow 1.5s ease-in-out infinite alternate;
}

@keyframes bottom-glow {
  0% {
    box-shadow: 0 6px 6px 0 rgba($brand-primary, 0.48);
  }
  to {
    box-shadow: 0 4.5px 4.5px 0 rgba($brand-primary, 0.28);
  }
}
</style>
