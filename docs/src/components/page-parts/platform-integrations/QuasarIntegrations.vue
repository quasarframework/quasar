<template>
  <q-page class="column justify-center items-center text-center q-px-xl font-monserrat">
    <h1 class="page-title landing-heading landing-heading--large normal-line-height">All platforms in one go</h1>
    <p class="letter-spacing-300 text-size-16 text-weight-bold text-center">
      Focus only on your mission and forget about the spaceship.
    </p>
    <p class="letter-spacing-40 text-size-16 q-mb-xl">
      Combine the power of Quasar UI with Quasar CLI. One source code for all platforms<br v-if="$q.screen.gt.sm">
      simultaneously with all the latest and greatest best practices out of the box.
    </p>
    <div class="platform-icons q-gutter-lg">
      <q-icon
        v-for="(iconName, platformIndex) in platformIntegrationIcons"
        :key="`platform-${platformIndex}`"
        color="brand-secondary"
        :name="iconName"
      />
    </div>
    <h2
      class="landing-heading landing-heading--medium q-mb-lg normal-line-height"
    >We have an impressive gear</h2>
    <div class="integration-options row justify-center q-gutter-lg q-mb-xl">
      <q-card
        v-for="({path, label, icon, name}, cardIndex) in integrationOptions"
        :key="cardIndex"
        class="card raise-on-hover column justify-center items-center cursor-pointer bg-brand-secondary"
        flat
        @click="$router.push(`/${path}`)"
      >
        <q-icon
          :name="icon"
          class="card__icon"
          color="brand-accent"
        />

        <q-card-section class="text-white text-size-16 text-weight-bold letter-spacing-300">
          {{ label }}
        </q-card-section>

        <q-card-section class="text-white text-size-14 q-py-none q-px-xs letter-spacing-263 primary-line-height">
          {{ name }}
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { useDocStore } from 'assets/doc-store.js'
import { fabChrome } from '@quasar/extras/fontawesome-v5'
import {
  mdiAndroid,
  mdiApple,
  mdiAppleSafari,
  mdiFirefox,
  mdiLinux,
  mdiMicrosoftEdge,
  mdiMicrosoftWindows,
  mdiServer,
  mdiApplicationOutline,
  mdiWidgets,
  mdiDevices,
  mdiPuzzle
} from '@quasar/extras/mdi-v6'

const platformIntegrationIcons = [
  fabChrome,
  mdiAppleSafari,
  mdiFirefox,
  mdiMicrosoftEdge,
  mdiLinux,
  mdiMicrosoftWindows,
  mdiApple,
  mdiAndroid
]

const integrationOptions = [
  {
    label: 'UI',
    name: 'User Interface Components',
    icon: mdiWidgets,
    path: 'components'
  },
  {
    label: 'SPA',
    name: 'Single Page Application',
    icon: mdiApplicationOutline,
    path: 'quasar-cli/developing-spa/introduction'
  },
  {
    label: 'PWA',
    name: 'Progressive Web App',
    icon: 'web',
    path: 'quasar-cli/developing-pwa/introduction'
  },
  {
    label: 'BEX',
    name: 'Browser Extension',
    icon: mdiPuzzle,
    path: 'quasar-cli/developing-browser-extensions/introduction'
  },
  {
    label: 'SSR',
    name: 'Server Side Rendering',
    icon: mdiServer,
    path: 'quasar-cli/developing-ssr/introduction'
  },
  {
    label: 'HMA',
    name: 'Hybrid Mobile App',
    icon: 'phone_iphone',
    path: 'quasar-cli/developing-mobile-apps'
  },
  {
    label: 'MPDA',
    name: 'Multi Platform Desktop App',
    icon: mdiDevices,
    path: 'quasar-cli/developing-electron-apps/introduction'
  }
]

export default defineComponent({
  name: 'QuasarIntegrations',

  setup () {
    useMeta({
      title: 'Integrations'
    })

    const $store = useDocStore()
    $store.toc = []

    return { integrationOptions, platformIntegrationIcons }
  }
})

</script>

<style lang="scss" scoped>
.integration-options {
  width: 85%;
  @media screen and (min-width: $breakpoint-lg-max) {
    width: 50%;
  }
}

.card {
  height: 200px;
  width: 200px;
  border-radius: 8px;
  border: solid 1px rgba(0, 0, 0, 0.12);

  &__icon {
    font-size: 36px;
  }

  @media screen and (min-width: $breakpoint-xs-max) {
    height: 160px;
    width: 160px;
  }
}

.raise-on-hover {
  transition: transform .3s, box-shadow 0.3s;

  &:hover {
    // !important needed when used with flat cards
    box-shadow: 0 8px 8px 0 rgba($dark, .2) !important;
    transform: scale(1.03)
  }
}

.platform-icons {
  font-size: 60px;
  margin-bottom: 60px;
}

.page-title {
  margin-top: 72px;
}
</style>
