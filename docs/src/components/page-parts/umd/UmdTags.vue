<template lang="pug">
q-card(flat bordered)
  q-card-section.q-gutter-xs
    q-toggle(v-model="css.roboto" label="Roboto font")
    q-toggle(v-model="css.animate" label="Animate.css")

  q-separator

  q-card-section.q-gutter-xs
    q-toggle(v-model="css['material-icons']" label="Material Icons")
    q-toggle(v-model="css['material-icons-outlined']" label="Material Icons (Outlined)")
    q-toggle(v-model="css['material-icons-round']" label="Material Icons (Round)")
    q-toggle(v-model="css['material-icons-sharp']" label="Material Icons (Sharp)")

    q-toggle(v-model="css['mdi-v5']" label="MDI v5")
    q-toggle(v-model="css['fontawesome-v5']" label="Fontawesome v5")
    q-toggle(v-model="css['ionicons-v4']" label="Ionicons v4")
    q-toggle(v-model="css['eva-icons']" label="Eva Icons")
    q-toggle(v-model="css.themify" label="Themify")
    q-toggle(v-model="css['line-awesome']" label="Line Awesome")

  q-separator

  q-card-section.q-gutter-xs
    q-toggle(v-model="cfgObject" label="Quasar Config Object")
    q-toggle(v-model="minified" label="Minified files")
    q-toggle(v-model="rtl" label="RTL CSS support")

  q-separator

  q-card-section.q-gutter-sm.column
    q-select(
      label="Quasar Language Pack"
      dense
      outlined
      :options="langOptions"
      emit-value
      map-options
      options-dense
      v-model="lang"
      style="width: 100%"
    )

    q-select(
      label="Quasar Icon Set"
      dense
      outlined
      :options="iconSetOptions"
      options-dense
      emit-value
      map-options
      v-model="iconSet"
    )

  q-separator

  doc-code.relative-position(lang="html", :code="output")

</template>

<script>
import languages from 'quasar/lang/index.json'

const cssMap = {
  'mdi-v5': 'cdn.jsdelivr.net/npm/@mdi/font@^5.0.0/css/materialdesignicons.min.css',
  'fontawesome-v5': 'use.fontawesome.com/releases/v5.0.13/css/all.css',
  'ionicons-v4': 'cdn.jsdelivr.net/npm/ionicons@^4.0.0/dist/css/ionicons.min.css',
  'eva-icons': 'cdn.jsdelivr.net/npm/eva-icons@^1.0.0/style/eva-icons.css',
  themify: 'themify.me/wp-content/themes/themify-v32/themify-icons/themify-icons.css',
  'line-awesome': 'maxst.icons8.com/vue-static/landings/line-awesome/font-awesome-line-awesome/css/all.min.css',
  animate: 'cdn.jsdelivr.net/npm/animate.css@^4.0.0/animate.min.css'
}

const googleMap = {
  roboto: 'Roboto:100,300,400,500,700,900',
  'material-icons': 'Material+Icons',
  'material-icons-outlined': 'Material+Icons+Outlined',
  'material-icons-round': 'Material+Icons+Round',
  'material-icons-sharp': 'Material+Icons+Sharp'
}

const camelize = str => str.replace(/(-\w)/g, m => m[ 1 ].toUpperCase())

export default {
  data () {
    return {
      version: this.$q.version,

      css: {
        roboto: true,

        'material-icons': true,
        'material-icons-outlined': false,
        'material-icons-round': false,
        'material-icons-sharp': false,

        'mdi-v5': false,
        'fontawesome-v5': false,
        'ionicons-v4': false,
        'eva-icons': false,
        themify: false,
        'line-awesome': false,

        animate: false
      },

      minified: true,
      rtl: false,
      cfgObject: false,

      lang: 'en-us',
      iconSet: 'material-icons'
    }
  },

  computed: {
    output () {
      return `<!DOCTYPE html>
<html>
  <!--
    WARNING! Make sure that you match all Quasar related
    tags to the same version! (Below it's "@${this.version}")
  -->

  <head>
    ${this.head}
  </head>

  <body>
    <!-- example of injection point where you write your app template -->
    <div id="q-app"></div>

    <!-- Add the following at the end of your body tag -->
    ${this.body}
    ${this.scriptTag}
  </body>
</html>
`
    },

    googleFonts () {
      const css = Object.keys(googleMap)
        .filter(key => this.css[ key ] === true)
        .map(key => googleMap[ key ])

      return css.length === 0
        ? ''
        : `fonts.googleapis.com/css?family=${css.join('|')}`
    },

    head () {
      const css = Object.keys(cssMap)
        .filter(key => this.css[ key ] === true)
        .map(key => cssMap[ key ])

      css.unshift(this.googleFonts)
      css.push(`cdn.jsdelivr.net/npm/quasar@${this.version}/dist/quasar.rtl.prod.css`)

      return css.filter(url => url)
        .map(url => this.getCssTag(url))
        .join('\n    ')
    },

    configInstantiation () {
      if (this.cfgObject === false) {
        return 'config: {}'
      }

      return `
        config: {
          brand: {
            primary: '#e46262',
            // ... or all other brand colors
          },
          notify: {...}, // default set of options for Notify Quasar plugin
          loading: {...}, // default set of options for Loading Quasar plugin
          loadingBar: { ... }, // settings for LoadingBar Quasar plugin
          // ..and many more (check Installation card on each Quasar component/directive/plugin)
        }\n     `
    },

    postCreateApp () {
      let str = ''

      if (this.lang !== 'en-us' || this.iconSet !== 'material-icons') {
        if (this.lang !== 'en-us') {
          str += `Quasar.lang.set(Quasar.lang.${camelize(this.lang)})\n      `
        }

        if (this.iconSet !== 'material-icons') {
          str += `Quasar.iconSet.set(Quasar.iconSet.${camelize(this.iconSet)})\n      `
        }
      }

      return str
    },

    scriptTag () {
      const startup = `
      /*
        Example kicking off the UI. Obviously, adapt this to your specific needs.
        Assumes you have a <div id="q-app"></div> in your <body> above
       */
      const app = Vue.createApp({
        data () {
          return {}
        },
        methods: {},
        // ...etc
      })

      app.use(Quasar, { ${this.configInstantiation} })
      ${this.postCreateApp}app.mount('#q-app')
    `

      // funky form below otherwise vue-loader will crash
      return '\n    <' + `script>${startup}<` + '/script>'
    },

    body () {
      const js = [
        'cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
        `cdn.jsdelivr.net/npm/quasar@${this.version}/dist/quasar.umd.prod.js`
      ]

      if (this.lang !== 'en-us') {
        js.push(`cdn.jsdelivr.net/npm/quasar@${this.version}/dist/lang/${this.lang}.umd.prod.js`)
      }

      if (this.iconSet !== 'material-icons') {
        js.push(`cdn.jsdelivr.net/npm/quasar@${this.version}/dist/icon-set/${this.iconSet}.umd.prod.js`)
      }

      return js
        .map(url => this.getJsTag(url))
        .join('\n    ')
    }
  },

  methods: {
    getUrl (url) {
      const min = this.minified === false
        ? url.replace('.prod', '')
        : url

      return this.rtl === false
        ? min.replace('.rtl', '')
        : min
    },

    getCssTag (url) {
      // funky form below, otherwise vue-loader will misinterpret
      return '<' + `link href="https://${this.getUrl(url)}" rel="stylesheet" type="text/css"` + '>'
    },

    getJsTag (url) {
      // funky form below, otherwise vue-loader will crash
      return '<' + `script src="https://${this.getUrl(url)}"` + '><' + '/script>'
    }
  },

  created () {
    this.langOptions = languages.map(lang => ({ label: lang.nativeName, value: lang.isoName }))
    this.iconSetOptions = [
      { label: 'Material (webfont)', value: 'material-icons' },
      { label: 'Material (svg)', value: 'svg-material-icons' },
      { label: 'Material Outlined (webfont)', value: 'material-icons-outlined' },
      { label: 'Material Round (webfont)', value: 'material-icons-round' },
      { label: 'Material Sharp (webfont)', value: 'material-icons-sharp' },
      { label: 'MDI v5 (webfont)', value: 'mdi-v5' },
      { label: 'MDI v5 (svg)', value: 'svg-mdi-v5' },
      { label: 'Ionicons v4 (webfont)', value: 'ionicons-v4' },
      { label: 'Ionicons v4 (svg)', value: 'svg-ionicons-v4' },
      { label: 'Fontawesome v5 (webfont)', value: 'fontawesome-v5' },
      { label: 'Fontawesome v5 (svg)', value: 'svg-fontawesome-v5' },
      { label: 'Eva Icons (webfont)', value: 'eva-icons' },
      { label: 'Eva Icons (svg)', value: 'svg-eva-icons' },
      { label: 'Themify (webfont)', value: 'themify' },
      { label: 'Themify (svg)', value: 'svg-themify' },
      { label: 'Line Awesome (webfont)', value: 'line-awesome' },
      { label: 'Line Awesome (svg)', value: 'svg-line-awesome' }
    ]
  }
}
</script>
