<template>
  <div>
    <router-view />

    <q-btn to="/" round icon="home" dense size="xs" class="fixed dev-home-btn z-max" color="accent" />

    <q-card
      style="padding: 11px; right: 11px; bottom: 10px; z-index: 6000;"
      class="rounded-borders shadow-4 fixed"
    >
      <q-btn dense flat size="sm" icon="visibility" @click="toggleSelector" class="absolute-top-right z-top" />
      <template v-if="showSelector">
        <q-toggle :model-value="$q.dark.isActive" @update:model-value="$q.dark.toggle" :label="`Dark Mode (${$q.dark.mode})`" />

        <q-btn dense flat size="sm" :icon="lang === 'he' ? 'navigate_before' : 'navigate_next'" @click="switchRTL" class="absolute-bottom-right z-top" />
        <q-select
          label="Quasar Language"
          dense
          outlined
          :options="langOptions"
          emit-value
          map-options
          options-dense
          v-model="lang"
          style="min-width: 150px"
          class="q-mb-xs"
        />
        <q-select
          label="Icon set"
          dense
          outlined
          :options="iconOptions"
          options-dense
          emit-value
          map-options
          v-model="iconSet"
        />
      </template>
    </q-card>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { Quasar, Dark, useQuasar, useMeta } from 'quasar'
import { ref, watch, onMounted } from 'vue'
import languages from 'quasar/lang/index.json'

export default {
  setup () {
    const $q = useQuasar()
    useMeta({ title: 'Quasar Development' })

    const lang = ref($q.lang.isoName)
    const iconSet = ref($q.iconSet.name)
    const showSelector = ref(false)

    watch(lang, lang => {
      import('quasar/lang/' + lang).then(lang => {
        $q.lang.set(lang.default)
      })
    })

    watch(iconSet, set => {
      import('quasar/icon-set/' + set).then(iconSet => {
        $q.iconSet.set(iconSet.default)
      })
    })

    function resetScroll (el, done) {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      done()
    }

    function switchRTL () {
      lang.value = lang.value === 'en-US' ? 'he' : 'en-US'
    }

    function toggleSelector () {
      showSelector.value = !showSelector.value
    }

    onMounted(() => {
      window.$q = $q
      window.Quasar = Quasar
      /*
      nextTick(() => {
        Dark.set(false)
      })
      */
    })

    // $q.dark.set('auto')
    // $q.dark.set(false)

    return {
      lang,
      iconSet,
      switchRTL,
      toggleSelector,
      showSelector,
      resetScroll,
      langOptions: languages.map(lang => ({ label: lang.nativeName, value: lang.isoName })),
      iconOptions: [
        { label: 'Material', value: 'material-icons' },
        { label: 'SVG Material', value: 'svg-material-icons' },
        { label: 'Material Outlined', value: 'material-icons-outlined' },
        { label: 'Material Round', value: 'material-icons-round' },
        { label: 'Material Sharp', value: 'material-icons-sharp' },
        { label: 'MDI v5', value: 'mdi-v5' },
        { label: 'SVG MDI v5', value: 'svg-mdi-v5' },
        { label: 'SVG Ionicons v5', value: 'svg-ionicons-v5' },
        { label: 'Ionicons v4', value: 'ionicons-v4' },
        { label: 'SVG Ionicons v4', value: 'svg-ionicons-v4' },
        { label: 'Fontawesome v5', value: 'fontawesome-v5' },
        { label: 'SVG Fontawesome v5', value: 'svg-fontawesome-v5' },
        { label: 'Eva Icons', value: 'eva-icons' },
        { label: 'SVG Eva Icons', value: 'svg-eva-icons' },
        { label: 'Themify', value: 'themify' },
        { label: 'SVG Themify', value: 'svg-themify' },
        { label: 'Line Awesome', value: 'line-awesome' },
        { label: 'SVG Line Awesome', value: 'svg-line-awesome' },
        { label: 'Bootstrap Icons', value: 'bootstrap-icons' },
        { label: 'SVG Bootstrap Icons', value: 'svg-bootstrap-icons' }
      ]
    }
  }
}
</script>

<style lang="sass">
body
  background: $grey-3

.dev-home-btn
  top: 36px
  right: 8px
</style>
