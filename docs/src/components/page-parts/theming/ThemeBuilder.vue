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
          q-tab(name="styl", no-caps, label="Stylus")
          q-tab(name="quasar-cli", no-caps, label="Quasar CLI")
          q-tab(name="umd", no-caps, label="UMD")
          q-tab(name="vue-cli", no-caps, label="Vue CLI")

        q-separator

        q-tab-panels.bg-code(v-model="exportTab", animated)
          q-tab-panel.q-pa-none(name="sass")
            doc-code(copy) {{ sassExport }}

          q-tab-panel.q-pa-none(name="scss")
            doc-code(copy) {{ scssExport }}

          q-tab-panel.q-pa-none(name="styl")
            doc-code(copy) {{ stylusExport }}

          q-tab-panel.q-pa-none(name="quasar-cli")
            doc-code(copy) {{ quasarCliExport }}

          q-tab-panel.q-pa-none(name="umd")
            doc-code(copy) {{ umdExport }}

          q-tab-panel.q-pa-none(name="vue-cli")
            doc-code(copy) {{ vueCliExport }}

        q-separator

        q-card-actions(align="right")
          q-btn(color="brand-primary", flat, label="Close", v-close-popup)
</template>

<script>
import { colors } from 'quasar'

import {
  fasSquare, fasCircle, fasPlay
} from '@quasar/extras/fontawesome-v5'

import {
  mdiArrowLeft, mdiMagnify, mdiMenu, mdiMapMarkerRadius
} from '@quasar/extras/mdi-v5'

const { setBrand, luminosity } = colors

export default {
  created () {
    this.fasSquare = fasSquare
    this.fasCircle = fasCircle
    this.fasPlay = fasPlay

    this.mdiArrowLeft = mdiArrowLeft
    this.mdiMagnify = mdiMagnify
    this.mdiMenu = mdiMenu
    this.mdiMapMarkerRadius = mdiMapMarkerRadius
  },

  data () {
    return {
      colors: {
        primary: '#027BE3',
        secondary: '#26A69A',
        accent: '#9C27B0',

        dark: '#1d1d1d',

        positive: '#21BA45',
        negative: '#C10015',
        info: '#31CCEC',
        warning: '#F2C037'
      },

      dark: {
        primary: true,
        secondary: true,
        accent: true,
        dark: true,

        positive: true,
        negative: true,
        info: false,
        warning: false
      },

      darkMode: false,
      exportDialog: false,
      exportTab: 'sass',
      list: [ 'primary', 'secondary', 'accent', 'dark', 'positive', 'negative', 'info', 'warning' ],
      sideColors: [ 'secondary', 'dark', 'positive', 'negative', 'info', 'warning' ]
    }
  },

  watch: {
    'colors.primary' (val) {
      this.update('primary', val)
    },

    'colors.secondary' (val) {
      this.update('secondary', val)
    },

    'colors.accent' (val) {
      this.update('accent', val)
    },

    'colors.dark' (val) {
      this.update('dark', val)
    },

    'colors.positive' (val) {
      this.update('positive', val)
    },

    'colors.negative' (val) {
      this.update('negative', val)
    },

    'colors.info' (val) {
      this.update('info', val)
    },

    'colors.warning' (val) {
      this.update('warning', val)
    }
  },

  computed: {
    pageClass () {
      return this.darkMode === true
        ? 'bg-grey-10 text-white'
        : 'bg-white text-black'
    },

    sassExport () {
      return `// src/css/quasar.variables.sass\n\n` +
        `$primary   : ${this.colors.primary}\n` +
        `$secondary : ${this.colors.secondary}\n` +
        `$accent    : ${this.colors.accent}\n\n` +
        `$dark      : ${this.colors.dark}\n\n` +
        `$positive  : ${this.colors.positive}\n` +
        `$negative  : ${this.colors.negative}\n` +
        `$info      : ${this.colors.info}\n` +
        `$warning   : ${this.colors.warning}`
    },

    scssExport () {
      return `// src/css/quasar.variables.scss\n\n` +
        `$primary   : ${this.colors.primary};\n` +
        `$secondary : ${this.colors.secondary};\n` +
        `$accent    : ${this.colors.accent};\n\n` +
        `$dark      : ${this.colors.dark};\n\n` +
        `$positive  : ${this.colors.positive};\n` +
        `$negative  : ${this.colors.negative};\n` +
        `$info      : ${this.colors.info};\n` +
        `$warning   : ${this.colors.warning};`
    },

    stylusExport () {
      return `// src/css/quasar.variables.styl\n\n` +
        `$primary   = ${this.colors.primary}\n` +
        `$secondary = ${this.colors.secondary}\n` +
        `$accent    = ${this.colors.accent}\n\n` +
        `$dark      = ${this.colors.dark}\n\n` +
        `$positive  = ${this.colors.positive}\n` +
        `$negative  = ${this.colors.negative}\n` +
        `$info      = ${this.colors.info}\n` +
        `$warning   = ${this.colors.warning}`
    },

    quasarCliExport () {
      return `// quasar.conf.js
// (will not work for IE11)

return {
  framework: {
    config: {
      brand: {
        primary: '${this.colors.primary}',
        secondary: '${this.colors.secondary}',
        accent: '${this.colors.accent}',

        dark: '${this.colors.dark}',

        positive: '${this.colors.positive}',
        negative: '${this.colors.negative}',
        info: '${this.colors.info}',
        warning: '${this.colors.warning}'
      }
    }
  }
}`
    },

    umdExport () {
      return `// place before including Quasar UMD script
// (will not work for IE11)

window.quasarConfig = {
  brand: {
    primary: '${this.colors.primary}',
    secondary: '${this.colors.secondary}',
    accent: '${this.colors.accent}',

    dark: '${this.colors.dark}',

    positive: '${this.colors.positive}',
    negative: '${this.colors.negative}',
    info: '${this.colors.info}',
    warning: '${this.colors.warning}'
  }
}`
    },

    vueCliExport () {
      return `// main.js
// (will not work for IE11)

Vue.use(Quasar, {
  config: {
    brand: {
      primary: '${this.colors.primary}',
      secondary: '${this.colors.secondary}',
      accent: '${this.colors.accent}',

      dark: '${this.colors.dark}',

      positive: '${this.colors.positive}',
      negative: '${this.colors.negative}',
      info: '${this.colors.info}',
      warning: '${this.colors.warning}'
    }
  }
})`
    }
  },

  methods: {
    update (color, val) {
      setBrand(color, val, document.getElementById('theme-picker'))
      this.dark[color] = luminosity(val) <= 0.4
    }
  }
}
</script>
