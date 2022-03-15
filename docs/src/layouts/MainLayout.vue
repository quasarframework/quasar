<template>
  <q-layout view="hHh lpR fff" class="bg-dark font-monserrat" @scroll="checkHeaderMetFooter">
    <!-- div for stars -->
    <div class="stars-sm" />
    <div class="stars-md" />
    <div class="stars-lg" />

    <main-layout-header v-model="showDrawer" :dark="!footerHasMetHeader" ref="mainLayoutHeader" />
    <q-drawer class="doc-left-drawer" side="left" v-model="showDrawer" bordered>
      <q-scroll-area class="full-height">
        <survey-countdown
          class="layout-countdown"
          color="brand-primary"
          align-class="justify-center"
          padding-class="q-py-md"
        />
        <app-menu class="q-mb-lg" />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!--
      We're not using q-footer because it has a strange interaction
      with the scroll position when navigating back after a link in it has been used:
      the page scroll position will be set as right before the footer, instead of showing it as we left it
    -->
    <footer class="text-size-12 footer" ref="mainLayoutFooter">
      <nav class="footer-nav">
        <q-list v-for="footerItem in footerItems" :key="footerItem.name">
          <q-item-label
            class="text-dark text-weight-bold letter-spacing-225"
          >{{ footerItem.name }}</q-item-label>
          <q-separator spaced color="brand-primary" />
          <template v-for="(item, itemIndex) in footerItem.items" :key="itemIndex">
            <q-item
              v-if="item.external"
              dense
              class="q-pa-none"
              clickable
              type="a"
              :href="item.path"
              target="_blank"
            >
              <q-item-section class="text-dark letter-spacing-100">{{ item.name }}</q-item-section>
            </q-item>
            <q-item
              v-else
              dense
              class="q-pa-none"
              clickable
              :to="footerItem.areOrphans ? `/${item.path}` : `/${footerItem.path}/${item.path}`"
            >
              <q-item-section class="text-dark letter-spacing-100">{{ item.name }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </nav>
      <q-separator color="brand-primary" class="landing-mx--large" />
      <div class="row justify-center q-my-md letter-spacing-225">
        <q-btn
          type="a"
          no-caps
          flat
          href="https://github.com/quasarframework/quasar/blob/dev/LICENSE"
          target="_blank"
          class="text-black-54 text-weight-bold"
          label="MIT License"
        />
        <q-btn
          type="a"
          no-caps
          flat
          href="https://www.iubenda.com/privacy-policy/40685560"
          target="_blank"
          class="text-black-54 text-weight-bold"
          label="Privacy Policy"
        />
      </div>
      <q-separator class="full-width" />
      <div class="text-dark text-center q-pa-lg letter-spacing-100">
        Copyright © 2015 - {{ currentYear }} PULSARDEV SRL, Razvan Stoenescu // This website has been designed in collaboration with
        <a
          href="https://www.dreamonkey.com/"
          target="_blank"
          class="q-ml-sm text-brand-accent text-weight-bold"
        >Dreamonkey Srl</a>
      </div>
    </footer>
    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
      <q-btn round icon="arrow_upward" color="brand-accent" class="shadow-bottom-small" size="md" />
    </q-page-scroller>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import MainLayoutHeader from 'components/header/MainLayoutHeader.vue'
import AppMenu from 'components/AppMenu.js'
import SurveyCountdown from 'components/SurveyCountdown.vue'
import menu from 'assets/menu.js'
import { footerNavs } from 'assets/landing-page/footer.js'

const currentYear = (new Date()).getFullYear()

/**
 * Loop through the menus and extract all menu items therein, including children to a flat array of menu items
 * @param menus menu items to extract from
 * @return {*[]} An array of flattened menu items (no more children, they move up to the same level as others)
 */
function createFooterNavsFromMenuItem (menus) {
  const footerItems = []
  for (const item of menus) {
    if (item.children) {
      // do not add parent item nor its children
      continue
    }
    footerItems.push(item)
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
    if (footerNav.areOrphans && footerNav.items) {
      return footerNav
    }
    // select the items from menu only if they are in the footerNavs
    const menuItem = menu.find(item => item.path === footerNav.path)
    if (!menuItem) {
      return []
    }
    const footerItems = {
      ...footerNav,
      items: createFooterNavsFromMenuItem(menuItem.children)
    }

    if (footerNav.itemToUnshift) {
      footerItems.items.unshift(footerNav.itemToUnshift)
    }

    if (footerNav.itemToPush) {
      footerItems.items.push(footerNav.itemToPush)
    }

    return footerItems
  })
}

const footerItems = extractFooterSectionsFromMenu(footerNavs, menu)

export default defineComponent({
  name: 'MainLayout',
  components: { MainLayoutHeader, AppMenu, SurveyCountdown },
  setup () {
    const showDrawer = ref(false)
    const footerHasMetHeader = ref(false)
    const mainLayoutFooter = ref()
    const mainLayoutHeader = ref()

    function checkHeaderMetFooter () {
      const headerSize = mainLayoutHeader.value.$el.clientHeight
      const positionFromTop = mainLayoutFooter.value.getBoundingClientRect().top
      footerHasMetHeader.value = positionFromTop <= headerSize
    }

    return {
      footerItems,
      showDrawer,
      currentYear,
      footerHasMetHeader,
      mainLayoutFooter,
      mainLayoutHeader,
      checkHeaderMetFooter
    }
  }
})
</script>

<style lang="scss" scoped>
.app-menu .q-item {
  font-size: 14px;
}

$footer-columns-md-min: 5;
$footer-columns-sm-min: 3;
$footer-columns-after-xs: 2;

.footer {
  background-color: #d8e1e5;
  position: relative;
  z-index: 5; // lower than header, higher than stars background and components page filter section
}

.footer-nav {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 24px;
  grid-row-gap: 100px;
  padding: 100px 32px;

  @media screen and (min-width: $breakpoint-sm-min) {
    padding-left: 30px;
    padding-right: 30px;
    grid-column-gap: 36px;
    grid-template-columns: repeat($footer-columns-sm-min, 1fr);
  }

  @media screen and (min-width: $breakpoint-md-min) {
    padding-left: 100px;
    padding-right: 100px;
    grid-template-columns: repeat($footer-columns-md-min, 1fr);
  }
  // handle edge case, on devices just after $breakpoint-xs-max and into sm
  @media screen and (min-width: $breakpoint-xs-max) and (max-width: 807px) {
    padding-left: 64px;
    padding-right: 64px;
    grid-template-columns: repeat($footer-columns-after-xs, 1fr);
  }
}

.layout-countdown {
  background: linear-gradient(
    45deg,
    #e6f1fc 25%,
    #c3e0ff 25%,
    #c3e0ff 50%,
    #e6f1fc 50%,
    #e6f1fc 75%,
    #c3e0ff 75%,
    #c3e0ff
  );
  background-size: 40px 40px;
}

$max-viewport-height: 7000; // max height at which stars are spread

@function generateRandomStars($number-of-stars, $max-viewport-height) {
  $value: "#{random($max-viewport-height)}px #{random($max-viewport-height)}px #{$brand-primary}";
  @for $i from 1 through $number-of-stars {
    $value: "#{$value}, #{random($max-viewport-height)}px #{random($max-viewport-height)}px #{$brand-primary}";
  }
  @return unquote($value);
}

$shadows-sm: generateRandomStars(700, $max-viewport-height);
$shadows-md: generateRandomStars(600, $max-viewport-height);
$shadows-lg: generateRandomStars(500, $max-viewport-height);

@mixin createStar($size, $box-shadow, $animation-duration) {
  animation: animateStar $animation-duration linear infinite;
  background: transparent;
  box-shadow: $box-shadow;
  height: #{$size}px;
  width: #{$size}px;
}

.stars-sm {
  @include createStar(1, $shadows-sm, 70s);
}

.stars-md {
  @include createStar(2, $shadows-md, 100s);
}

.stars-lg {
  @include createStar(3, $shadows-lg, 150s);
}

@keyframes animateStar {
  from {
    transform: translateY(0px);
  }
  to {
    // animate at half the spread distance of stars
    transform: translateY(-#{$max-viewport-height/2}px);
  }
}
</style>
