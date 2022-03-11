<template>
  <q-page class="column justify-center items-center text-center q-px-xl font-monserrat landing-mb--large">
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
    <div class="row justify-center q-gutter-sm q-mb-xl">
      <q-card
        v-for="({path, label, icon, name}, cardIndex) in integrationOptions"
        :key="cardIndex"
        class="card raise-on-hover column justify-center items-center cursor-pointer"
        flat
        @click="$router.push(`/${path}`)"
      >
        <q-icon
          :name="icon"
          class="text-size-24 q-my-sm"
          color="brand-accent"
        />
        <div class="text-size-14 text-weight-bold letter-spacing-263 text-brand-secondary">
          {{ label }}
        </div>
        <div class="text-size-12 q-px-sm letter-spacing-100 text-brand-secondary">
          {{ name }}
        </div>
      </q-card>
    </div>
    <h2 class="landing-heading landing-heading--medium q-mb-lg normal-line-height">Discover Quasar Ecosystem</h2>
    <template v-for="({about, options}, partIndex) in ecosystemParts" :key="`part-${partIndex}`">
      <p class="text-size-16 letter-spacing-40 primary-line-height text-brand-secondary">{{ about }}</p>
      <div class="row justify-center q-gutter-sm margin-bottom-36">
        <router-link
          v-for="({icon, label, path, isInternal, iconColor}, cardIndex) in options"
          :key="cardIndex"
          :target="isInternal? '_self' : '_blank'"
          :to="isInternal? `/${path}` : `//${path}`"
          class="remove-a-tag-styles"
        >
          <q-card
            class="card card--bordered raise-on-hover column justify-center items-center cursor-pointer"
            flat
          >
            <q-icon
              :name="icon"
              class="text-size-36 q-my-sm"
              :color="iconColor || 'brand-primary'"
            />
            <div class="text-size-12 q-px-sm letter-spacing-100 text-brand-secondary">
              {{ label }}
            </div>
          </q-card>
        </router-link>
      </div>
    </template>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'
import { useDocStore } from 'assets/doc-store.js'
import {
  mdiAndroid,
  mdiApple,
  mdiAppleSafari,
  mdiApplicationOutline,
  mdiCalendar,
  mdiDevices,
  mdiFileDownload,
  mdiFirefox,
  mdiGoogleChrome,
  mdiGraphql,
  mdiLanguageMarkdown,
  mdiLinux,
  mdiMicrosoftEdge,
  mdiMicrosoftWindows,
  mdiPuzzle,
  mdiServer,
  mdiSvg,
  mdiTestTube
} from '@quasar/extras/mdi-v6'

const platformIntegrationIcons = [
  mdiGoogleChrome,
  mdiAppleSafari,
  mdiFirefox,
  mdiMicrosoftEdge,
  mdiLinux,
  mdiMicrosoftWindows,
  mdiApple,
  mdiAndroid
]

const ecosystemParts = [
  {
    about: 'App Extensions that help you design your UI',
    options: [
      {
        label: 'QCalendar',
        icon: mdiCalendar,
        path: 'github.com/quasarframework/quasar-ui-qcalendar'
      },
      {
        label: 'QMarkdown',
        icon: mdiLanguageMarkdown,
        path: 'github.com/quasarframework/app-extension-qmarkdown'
      },
      {
        label: 'QMediaPlayer',
        icon: 'ondemand_video',
        path: 'github.com/quasarframework/app-extension-qmediaplayer'
      },
      {
        label: 'All AEs',
        icon: 'extension',
        path: 'quasar.dev/app-extensions/discover',
        iconColor: 'brand-accent'
      }
    ]
  },
  {
    about: 'App Extensions for your app low tech integrations',
    options: [
      {
        label: 'Testing',
        icon: mdiTestTube,
        path: 'github.com/quasarframework/quasar-testing'
      },
      {
        label: 'Apollo GraphQL',
        icon: mdiGraphql,
        path: 'github.com/quasarframework/app-extension-apollo'
      },
      {
        label: 'SSG Mode',
        icon: mdiFileDownload,
        path: 'github.com/freddy38510/quasar-app-extension-ssg'
      },
      {
        label: 'All AEs',
        icon: 'extension',
        path: 'quasar.dev/app-extensions/discover',
        iconColor: 'brand-accent'
      }
    ]
  },
  {
    about: 'Our tools and resources that help you manage icons in your projects',
    options: [
      {
        label: 'Icon Genie',
        icon: 'stars',
        path: 'icongenie/installation',
        isInternal: true
      },
      {
        label: 'Icon Explorer',
        icon: 'search',
        path: 'iconexplorer.app'
      },
      {
        label: 'Extra SVG Icons',
        icon: mdiSvg,
        path: 'github.com/quasarframework/extra-svg-icons'
      }
    ]
  }
]

const integrationOptions = [
  {
    label: 'SPA',
    name: 'Single Page Application',
    icon: mdiApplicationOutline,
    path: 'quasar-cli/developing-spa/introduction'
  },
  {
    label: 'SSR',
    name: 'Server Side Rendering',
    icon: mdiServer,
    path: 'quasar-cli/developing-ssr/introduction'
  },
  {
    label: 'PWA',
    name: 'Progressive Web App',
    icon: 'web',
    path: 'quasar-cli/developing-pwa/introduction'
  },
  {
    label: 'HMA',
    name: 'Hybrid Mobile App',
    icon: 'phone_iphone',
    path: 'quasar-cli/developing-mobile-apps'
  },
  {
    label: 'BEX',
    name: 'Browser Extension',
    icon: mdiPuzzle,
    path: 'quasar-cli/developing-browser-extensions/introduction'
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

    return {
      integrationOptions,
      platformIntegrationIcons,
      ecosystemParts
    }
  }
})

</script>

<style lang="scss" scoped>
.card {
  height: 120px;
  width: 120px;
  border-radius: 4px;

  &--bordered {
    border-radius: 8px;
    border: solid 1px rgba(0, 0, 0, 0.12);
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

.remove-a-tag-styles {
  text-decoration: none;
}

.margin-bottom-36 {
  margin-bottom: 36px;
}
</style>
