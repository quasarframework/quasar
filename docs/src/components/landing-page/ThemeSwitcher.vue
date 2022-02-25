<template>
  <q-btn
    v-if="isThemeSwitcherEnabled"
    class="q-ml-xs"
    round
    flat
    color="lp-primary"
    :icon="mdiThemeLightDark"
  >
    <q-menu>
      <q-list>
        <q-item
          v-for="theme in AVAILABLE_THEMES"
          :key="theme"
          :class="theme === currentTheme ? 'text-lp-primary' : ''"
          class="text-capitalize"
          clickable
          @click="setTheme(theme)"
          v-close-popup
        >
          <q-item-section>
            {{ theme }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script>
import { mdiThemeLightDark } from '@quasar/extras/mdi-v6'
import { useQuasar } from 'quasar'
import { useTheme, AVAILABLE_THEMES } from 'src/components/landing-page/use-theme'
import { computed, defineComponent, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

export const BRAND_THEME_ONLY_PAGES = [ 'landing', 'components' ]

export default defineComponent({
  name: 'ThemeSwitcher',
  setup () {
    const $q = useQuasar()
    const $route = useRoute()
    const { currentTheme } = useTheme()

    const isThemeSwitcherEnabled = computed(() => !BRAND_THEME_ONLY_PAGES.includes($route.name))

    watchEffect(() => !isThemeSwitcherEnabled.value
      ? (currentTheme.value = 'brand')
      : (currentTheme.value = $q.localStorage.getItem('theme'))
    )

    function setTheme (newTheme) {
      currentTheme.value = newTheme
      $q.localStorage.set('theme', newTheme)
    }

    return {
      currentTheme,
      AVAILABLE_THEMES,
      setTheme,
      isThemeSwitcherEnabled,
      mdiThemeLightDark
    }
  }
})
</script>
