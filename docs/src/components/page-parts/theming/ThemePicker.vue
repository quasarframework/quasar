<template lang="pug">
#theme-picker
  .row.items-stretch
    div(:class="$q.screen.gt.xs ? 'column q-gutter-md' : 'row q-gutter-sm q-mb-md'")
      q-btn(
        v-for="color in list"
        :key="`picker-${color}`"
        :color="color"
        :text-color="dark[color] === true ? 'white' : 'black'"
        no-caps
        glossy
        unelevated
      )
        .text-caption.text-weight-light
          .text-capitalize {{ color }}
          div {{ colors[color] }}

        q-menu(anchor="top start", self="top start")
          q-color(v-model="colors[color]")

    .col(:class="$q.screen.gt.xs ? 'q-pl-md' : ''")
      .relative-position.fit.rounded-borders.shadow-2.bg-white.overflow-hidden
        div(:class="`bg-primary text-${dark.primary === true ? 'white' : 'black'} shadow-2`")
          q-bar(dense, :dark="dark.primary")
            q-space
            q-icon.q-mr-xs(:name="fasSquare", size="12px", style="opacity: 0.5")
            q-icon.q-mr-xs(:name="fasCircle", size="12px", style="opacity: 0.5")
            q-icon.q-mr-sm.rotate-90(:name="fasPlay", size="12px", style="opacity: 0.5")

          q-toolbar
            q-btn(flat, dense, round, :icon="mdiArrowLeft")
            q-space
            q-toggle.q-mr-sm(dense, v-model="darkMode", :dark="dark.primary", color="red", label="Dark page")
            q-btn(flat, dense, round, :icon="mdiMagnify")
            q-btn(flat, dense, round, :icon="mdiMenu")

          q-toolbar(inset)
            q-toolbar-title Quasar

        .q-px-md.q-py-lg(:class="pageClass")
          .row.q-col-gutter-md
            .col-12.col-sm-6.col-md-4.col-lg-3(
              v-for="color in sideColors"
              :key="`card-${color}`"
            )
              q-card(flat, :class="`bg-${color} text-${dark[color] === true ? 'white' : 'black'}`")
                q-card-section
                  .text-h6.row.no-wrap.items-center
                    .ellipsis.text-capitalize {{ color }}
                    q-space
                    q-icon(
                      v-if="color !== 'secondary' && color !== 'dark'"
                      :name="$q.iconSet.type[color]"
                      size="24px"
                    )

                q-card-section Lorem, ipsum dolor sit amet consectetur adipisicing elit.

          q-btn(
            fab
            :icon="mdiMapMarkerRadius"
            color="accent"
            :text-color="dark.accent === true ? 'white' : 'black'"
            class="absolute"
            style="bottom: 16px; right: 16px"
          )

  q-separator.q-mt-lg.q-mb-sm

  .col-12.row.items-center.justify-end.q-gutter-md
    q-btn(color="black", label="Export", @click="exportDialog = true")

  q-dialog(v-model="exportDialog")
    q-card
      q-tabs.text-grey-7(v-model="exportTab", active-color="brand-primary" align="justify")
        q-tab(name="sass", no-caps, label="Sass")
        q-tab(name="scss", no-caps, label="SCSS")
        q-tab(name="quasar-cli", no-caps, label="Quasar CLI")
        q-tab(name="umd", no-caps, label="UMD / Vue CLI")

      q-separator

      q-tab-panels(v-model="exportTab", animated)
        q-tab-panel.q-pa-none(name="sass")
          doc-code(copy, :code="sassExport")

        q-tab-panel.q-pa-none(name="scss")
          doc-code(copy, :code="scssExport")

        q-tab-panel.q-pa-none(name="quasar-cli")
          doc-code(copy, :code="quasarCliExport")

        q-tab-panel.q-pa-none(name="umd")
          doc-code(copy, :code="umdExport")

        q-tab-panel.q-pa-none(name="vue-cli")
          doc-code(copy, :code="vueCliExport")

      q-separator

      q-card-actions(align="right")
        q-btn(color="brand-primary", flat, label="Close", v-close-popup)
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { colors, setCssVar } from 'quasar'

import {
  fasSquare, fasCircle, fasPlay
} from '@quasar/extras/fontawesome-v5'

import {
  mdiArrowLeft, mdiMagnify, mdiMenu, mdiMapMarkerRadius
} from '@quasar/extras/mdi-v5'

const { luminosity } = colors

export default {
  name: 'ThemePicker',

  setup () {
    const colors = reactive({
      primary: '#1976d2',
      secondary: '#26A69A',
      accent: '#9C27B0',

      dark: '#1d1d1d',

      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    })

    const dark = reactive({
      primary: true,
      secondary: true,
      accent: true,
      dark: true,

      positive: true,
      negative: true,
      info: false,
      warning: false
    })

    const darkMode = ref(false)
    const exportDialog = ref(false)
    const exportTab = ref('sass')

    function update (color, val) {
      setCssVar(color, val, document.getElementById('theme-picker'))
      dark[ color ] = luminosity(val) <= 0.4
    }

    const list = [ 'primary', 'secondary', 'accent', 'dark', 'positive', 'negative', 'info', 'warning' ]

    list.forEach(entry => {
      watch(() => colors[ entry ], val => { update(entry, val) })
    })

    const pageClass = computed(() => {
      return darkMode.value === true
        ? 'bg-grey-10 text-white'
        : 'bg-white text-black'
    })

    const sassExport = computed(() => {
      return '// src/css/quasar.variables.sass\n\n' +
        `$primary   : ${colors.primary}\n` +
        `$secondary : ${colors.secondary}\n` +
        `$accent    : ${colors.accent}\n\n` +
        `$dark      : ${colors.dark}\n\n` +
        `$positive  : ${colors.positive}\n` +
        `$negative  : ${colors.negative}\n` +
        `$info      : ${colors.info}\n` +
        `$warning   : ${colors.warning}`
    })

    const scssExport = computed(() => {
      return '// src/css/quasar.variables.scss\n\n' +
        `$primary   : ${colors.primary};\n` +
        `$secondary : ${colors.secondary};\n` +
        `$accent    : ${colors.accent};\n\n` +
        `$dark      : ${colors.dark};\n\n` +
        `$positive  : ${colors.positive};\n` +
        `$negative  : ${colors.negative};\n` +
        `$info      : ${colors.info};\n` +
        `$warning   : ${colors.warning};`
    })

    const quasarCliExport = computed(() => {
      return `// quasar.conf.js

return {
  framework: {
    config: {
      brand: {
        primary: '${colors.primary}',
        secondary: '${colors.secondary}',
        accent: '${colors.accent}',

        dark: '${colors.dark}',

        positive: '${colors.positive}',
        negative: '${colors.negative}',
        info: '${colors.info}',
        warning: '${colors.warning}'
      }
    }
  }
}`
    })

    const umdExport = computed(() => {
      return `app.use(Quasar, {
  config: {
    brand: {
      primary: '${colors.primary}',
      secondary: '${colors.secondary}',
      accent: '${colors.accent}',

      dark: '${colors.dark}',

      positive: '${colors.positive}',
      negative: '${colors.negative}',
      info: '${colors.info}',
      warning: '${colors.warning}'
    }
  }
}`
    })

    return {
      fasSquare,
      fasCircle,
      fasPlay,

      mdiArrowLeft,
      mdiMagnify,
      mdiMenu,
      mdiMapMarkerRadius,

      colors,
      dark,

      darkMode,
      exportDialog,
      exportTab,
      list,
      sideColors: [ 'secondary', 'dark', 'positive', 'negative', 'info', 'warning' ],

      pageClass,
      sassExport,
      scssExport,
      quasarCliExport,
      umdExport
    }
  }
}
</script>
