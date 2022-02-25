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
          v-for="theme in availableThemes"
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
import { BRAND_THEME_ONLY_PAGES } from 'src/router/routes'
import { useTheme } from 'src/components/landing-page/use-theme'
import { computed, defineComponent, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'ThemeSwitcher',
  setup () {
    const $q = useQuasar()
    const $route = useRoute()
    const { currentTheme, availableThemes } = useTheme()

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
      availableThemes,
      setTheme,
      isThemeSwitcherEnabled,
      mdiThemeLightDark
    }
  }
})
</script>
