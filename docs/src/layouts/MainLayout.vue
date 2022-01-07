<template>
  <q-layout view="hHh lpR fff" class="bg-lp-dark font-monserrat">
    <main-layout-header v-model="showDrawer"/>

    <q-drawer class="doc-left-drawer" side="left" v-model="showDrawer" bordered>
      <q-scroll-area class="full-height">
        <survey-countdown class="layout-countdown" color="lp-primary" align-class="justify-center" padding-class="q-py-md"/>
        <app-menu class="q-mb-lg" />
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
            color="black-54"
            flat
            padding="md"
          />
        </template>
      </q-toolbar>
      <div class="lp-footer q-ma-xl">
        <q-list v-for="footerItem in footerItems" :key="footerItem.name">
          <q-item-label class="text-lp-dark text-weight-bold">{{ footerItem.name }}</q-item-label>
          <q-separator spaced color="lp-primary" />
          <template v-for="(item, itemIndex) in footerItem.items" :key="itemIndex">
            <q-item dense class="q-pa-none" clickable tag="a" :to="`/${footerItem.path}/${item.path}`" :href="item.path" :target="item.external? '_blank':'_self'">
              <q-item-section class="text-lp-dark text-capitalize">
                {{ item.name }}
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
      <q-separator class="full-width" />
      <div class="row text-lp-dark justify-center q-my-md">
        Copyright © 2015 - {{ currentYear }} PULSARDEV SRL, Razvan Stoenescu // This website has been designed in collaboration with
        <a href="https://www.dreamonkey.com/" target="_blank" class="q-ml-sm">Dreamonkey Srl</a>
      </div>
    </q-footer>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn round icon="arrow_upward" color="lp-accent" class="shadow-bottom-small" size="md"/>
    </q-page-scroller>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { footerToolbar } from 'assets/landing-page/landing-page-footer.js'
import { Screen } from 'quasar'
import MainLayoutHeader from 'components/landing-page/MainLayoutHeader'
import AppMenu from 'components/AppMenu.js'
import SurveyCountdown from 'components/SurveyCountdown.vue'
import menu from 'assets/menu.js'
import { footerNavs } from 'assets/landing-page/landing-page-footer.js'

const currentYear = (new Date()).getFullYear()

const HIDDEN_FOOTERTOOLBAR_INDEX_XS = [ 0, 2, 3 ]

/**
 * Loop through the menus and extract all menu items therein, including children to a flat array of menu items
 * @param menus menu items to extract from
 * @param exitCondition: (menuItem) => boolean - we may want to exit the loop early without reading all the elements
 * @return {*[]} An array of flattened menu items (no more children, they move up to the same level as others)
 */
function createFooterNavsFromMenuItem (menus, exitCondition = () => false) {
  const footerItems = []
  for (const item of menus) {
    footerItems.push(item)
    if (typeof exitCondition === 'function' && exitCondition(item)) {
      return footerItems
    }
    if (item.children) {
      footerItems.push(...item.children)
    }
  }
  return footerItems
}

/**
 * Loop through the footer sections and select menu items from menus[] to be considered for the footer links
 * @param footerNavs
 * @param menu
 * @return {*}
 */
function extractFooterSectionsFromMenu (footerNavs, menu) {
  return footerNavs.flatMap(footerNav => {
    // select the items from menu only if they are in the footerNavs
    const menuItem = menu.find(item => item.path === footerNav.path)
    if (!menuItem) {
      return []
    }
    return {
      ...footerNav,
      items: createFooterNavsFromMenuItem(menuItem.children, footerNav.menuExitCondition)
    }
  })
}

const footerItems = extractFooterSectionsFromMenu(footerNavs, menu)

export default defineComponent({
  name: 'MainLayout',
  components: { MainLayoutHeader, AppMenu, SurveyCountdown },
  setup () {
    const showDrawer = ref(false)

    const showFooterToolbar = (footerIndex) => Screen.gt.xs ? true : HIDDEN_FOOTERTOOLBAR_INDEX_XS.includes(footerIndex)

    return {
      footerItems,
      footerToolbar,
      showDrawer,
      showFooterToolbar,
      currentYear
    }
  }
})
</script>

<style lang="scss" scoped>
$footer-columns-md-min: 6;
$footer-columns-sm-min: 4;
$adjust-header-viewport: 860px;

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

.layout-countdown {
  background: linear-gradient(45deg, #e6f1fc 25%, #c3e0ff 25%, #c3e0ff 50%, #e6f1fc 50%, #e6f1fc 75%, #c3e0ff 75%, #c3e0ff);
  background-size: 40px 40px;
}

.app-menu .q-item {
  font-size: 14px;
}

</style>
