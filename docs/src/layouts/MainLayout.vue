<template>
  <q-layout view="hHh lpR fff" class="bg-lp-dark">

    <q-header class="bg-lp-dark">
      <q-toolbar>
        <q-btn flat @click="showDrawer = !showDrawer" round dense icon="menu" v-if="$q.screen.xs" color="lp-primary" />
        <q-toolbar-title :class="$q.screen.xs? 'row justify-center items-center':''" class="add-vertical-bar position-relative">
          <q-avatar>
            <q-icon name="img:homepage-icons/quasar-logo-blue.svg" size="lg"/>
          </q-avatar>
          QUASAR
        </q-toolbar-title>
        <q-space v-if="$q.screen.gt.xs"/>

        <div class="row items-center">
          <div v-if="$q.screen.gt.xs" class="toolbar-menu-items">
            <q-btn
              label="Docs"
              color="white"
              flat
              :to="{ name: 'lpDocs' }"
            />
            <q-btn
              label="Features"
              color="lp-light"
              flat
              class="q-py-sm q-px-md"
            />
            <q-btn
              color="lp-light"
              flat
              label="Services"
            />
            <q-btn
              color="lp-light"
              flat
              label="Components"
              class="q-py-sm q-px-md"
              :to="{ name: 'lpComponents' }"
            />
            <q-btn
              color="lp-light"
              flat
              label="Become sponsor"
              class="q-py-sm q-px-md"
            />
            <q-btn
              color="lp-light"
              flat
              label="About"
              class="q-py-sm q-px-md"
            />
            <q-btn
              color="lp-light"
              flat
              label="Blog"
            />
          </div>
          <q-btn flat round color="lp-primary" icon="search"/>
        </div>

      </q-toolbar>
      <q-separator color="lp-primary"/>
      <div class="row justify-end shadow-bottom-small q-py-xs q-pr-md social-links">
        <q-btn label="Why Quasar?" flat color="lp-light" no-caps size="sm"/>
        <q-btn label="Getting Started" flat no-caps color="lp-light" size="sm"/>
        <q-btn label="Roadmap" flat no-caps color="lp-light" size="sm"/>
        <q-btn label="Video Tutorials" flat no-caps color="lp-light" size="sm"/>
        <q-btn label="Quasar Brand resources" flat no-caps color="lp-light" size="sm"/>
        <template v-for="(socialLink, linkIndex) in socialLinks" :key="linkIndex">
          <q-btn :icon="socialLink.icon" flat color="lp-primary" round size="sm" type="a" :href="socialLink.href" target="__blank"/>
        </template>
      </div>
    </q-header>

    <q-drawer
      v-model="showDrawer"
      :width="200"
      :breakpoint="500"
      overlay
      bordered
      class="bg-lp-dark"
    >
      <q-scroll-area class="fit">
        <q-list class="text-white">
          <div class="q-ml-md text-size-24 text-lp-primary">Quasar</div>
          <template v-for="(menuItem, index) in menuList" :key="index">
            <q-item clickable v-ripple :active="menuItem.name === 'Home'" active-class="text-white bg-grey-8">
              <q-item-section avatar>
                <q-icon :name="menuItem.icon" color="lp-primary"/>
              </q-item-section>
              <q-item-section>
                {{ menuItem.name }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator" />
          </template>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-lp-grey text-size-12 text-capitalize">
      <q-toolbar class="row justify-center bg-white">
        <template v-for="({label, to}, footerIndex) in footerToolbar" :key="footerIndex">
          <q-btn
            v-if="showFooterToolbar(footerIndex)"
            :label="label"
            :to="to"
            color="lp-light"
            flat
            padding="md"
          />
        </template>
      </q-toolbar>
      <div class="lp-footer q-ma-xl">
        <q-list v-for="footerItem in footerItems" :key="footerItem.label">
          <q-item-label class="text-lp-dark text-weight-bold">{{ footerItem.label }}</q-item-label>
          <q-separator spaced color="lp-primary" />
          <template v-for="(item, itemIndex) in footerItem.items" :key="itemIndex">
            <q-item dense class="q-pa-none" clickable :to="item.to">
              <q-item-section class="text-lp-dark">
                {{ item.label }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
      <q-separator class="full-width" />
      <div class="row text-lp-dark justify-center q-my-md">
        Copyright © 2015 - {{ year }} PULSARDEV SRL, Razvan Stoenescu // This website has been designed in collaboration with Dreamonkey Srl
      </div>
    </q-footer>

    <scrollToTop :scroll-to-top="scrollToTop"/>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { footerToolbar, homepageFooterItems } from 'assets/landing-page/landing-page-footer.js'
import Menu from 'assets/menu.js'

const year = (new Date()).getFullYear()

import {
  fabGithub,
  fabTwitter,
  fabFacebookSquare
} from '@quasar/extras/fontawesome-v5'
import ScrollToTop from 'src/components/landing-page/ScrollToTop.vue'
import { Screen } from 'quasar'

const HIDDEN_FOOTERTOOLBAR_INDEX_XS = [ 0, 2, 3 ]

export default defineComponent({
  name: 'MainLayout',
  components: { ScrollToTop },
  setup () {
    const showDrawer = ref(false)

    const menuList = [
      {
        icon: 'home',
        name: 'Home',
        separator: true
      },
      {
        icon: 'img:homepage-icons/quasar-logo-blue.svg',
        name: 'About',
        separator: false
      },
      {
        icon: 'forum',
        iconColor: 'primary',
        name: 'Blog',
        separator: false
      },
      ...Menu
    ]

    const socialLinks = [
      { icon: fabGithub, href: 'https://github.com/quasarframework' },
      { icon: 'message', href: 'https://discord.com/invite/5TDhbDg' },
      { icon: 'forum', href: 'https://github.com/quasarframework/quasar/discussions/' },
      { icon: fabTwitter, href: 'https://twitter.com/quasarframework' },
      { icon: fabFacebookSquare, href: 'https://www.facebook.com/QuasarFramework' }
    ]

    const showFooterToolbar = (footerIndex) => Screen.gt.xs ? true : HIDDEN_FOOTERTOOLBAR_INDEX_XS.includes(footerIndex)

    return {
      footerItems: homepageFooterItems,
      fabGithub,
      fabTwitter,
      fabFacebookSquare,
      socialLinks,
      footerToolbar,
      showDrawer,
      menuList,
      showFooterToolbar,
      year
    }
  }
})
</script>

<style lang="scss">
$footer-columns-md-min: 6;
$footer-columns-sm-min: 4;
$adjust-header-viewport: 860px;
$hide-social-links-viewport: 687px;

.add-vertical-bar::after {
  display: none;

  @media screen and (min-width: $breakpoint-md-min) {
    content: '';
    position: absolute;
    top: 0;
    left: 160px;
    display: block;
    border-right: 1px solid $lp-primary;
    height: 100%;
  }
}

.lp-footer {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 24px;
  grid-row-gap: 48px;

  @media screen and (min-width: $breakpoint-sm-min) {
    grid-template-columns: repeat($footer-columns-sm-min, 1fr);
  }
  @media screen and (min-width: $breakpoint-md-min) {
    grid-template-columns: repeat($footer-columns-md-min, 1fr);
  }
}

// remove some children just before xs
.toolbar-menu-items {
  .q-btn:nth-last-child(-n+3) {
    @media screen and (max-width: $adjust-header-viewport) {
      display: none;
    }
  }
}

.social-links {
  @media screen and (max-width: $hide-social-links-viewport) {
    display: none;
  }
}

body {
  font-family: $lp-font-family;
}

</style>
