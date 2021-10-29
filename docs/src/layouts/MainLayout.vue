<template>
  <q-layout view="hHh lpR fff" class="bg-lp-dark">

    <q-header class="bg-lp-dark">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          QUASAR
        </q-toolbar-title>
        <q-space />

        <div class="row items-center">
          <q-btn
            label="Home"
            color="white"
            flat
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
          <q-btn flat round color="lp-primary" icon="search"/>
        </div>

      </q-toolbar>
      <q-separator color="lp-primary"/>
      <div class="row justify-end q-mr-md">
        <template v-for="(socialLink, i) in socialLinks" :key="i">
          <q-btn :icon="socialLink.icon" flat color="lp-primary" round size="sm" />
        </template>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-lp-grey text-size-12 text-capitalize">
      <q-toolbar class="row justify-center bg-white">
        <template v-for="({label, to}, i) in footerToolbar" :key="i">
          <q-btn
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
          <template v-for="(item, i) in footerItem.items" :key="i">
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
        Copyright © 2015 - 2021 PULSARDEV SRL, Razvan Stoenescu // This website has been designed in collaboration with Dreamonkey Srl
      </div>
    </q-footer>

    <scrollToTop :scroll-to-top="scrollToTop"/>
  </q-layout>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { footerToolbar, homepageFooterItems } from 'assets/landing-page/landing-page-footer.ts'
import {
  fabGithub,
  fabTwitter,
  fabFacebookSquare
} from '@quasar/extras/fontawesome-v5'
import ScrollToTop from 'src/components/landing-page/ScrollToTop.vue'

export default defineComponent({
  name: 'MainLayout',
  components: { ScrollToTop },
  setup () {
    const socialLinks = [
      { icon: fabGithub, link: '#' },
      { icon: 'message', link: '#' },
      { icon: 'forum', link: '#' },
      { icon: fabTwitter, link: '#' },
      { icon: fabFacebookSquare, link: '#' }
    ]

    return {
      footerItems: homepageFooterItems,
      fabGithub,
      fabTwitter,
      fabFacebookSquare,
      socialLinks,
      footerToolbar
    }
  }
})
</script>

<style lang="scss" scoped>
.lp-footer {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-column-gap: 1.5rem;
  grid-row-gap: 3rem;
}
</style>
