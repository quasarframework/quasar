// The UMD page the reader copies: UmdTags.vue lets them pick the
// options, the docs generator (build/mcp) writes the default pick.

export const cssMap = {
  'mdi-v7':
    'cdn.jsdelivr.net/npm/@mdi/font@^7.0.0/css/materialdesignicons.min.css',
  'fontawesome-v7': 'use.fontawesome.com/releases/v7.0.0/css/all.css',
  'ionicons-v4':
    'cdn.jsdelivr.net/npm/ionicons@^4.0.0/dist/css/ionicons.min.css',
  'eva-icons': 'cdn.jsdelivr.net/npm/eva-icons@^1.0.0/style/eva-icons.css',
  themify:
    'themify.me/wp-content/themes/themify-v32/themify-icons/themify-icons.css',
  'line-awesome':
    'maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css',
  'bootstrap-icons':
    'cdn.jsdelivr.net/npm/bootstrap-icons@^1.0.0/font/bootstrap-icons.css',
  animate: 'cdn.jsdelivr.net/npm/animate.css@^4.0.0/animate.min.css'
}

export const googleMap = {
  roboto: 'Roboto:100,300,400,500,700,900',
  'material-icons': 'Material+Icons',
  'material-icons-outlined': 'Material+Icons+Outlined',
  'material-icons-round': 'Material+Icons+Round',
  'material-icons-sharp': 'Material+Icons+Sharp'
}

export const googleSymbolsMap = {
  'material-symbols-outlined': 'Material+Symbols+Outlined',
  'material-symbols-rounded': 'Material+Symbols+Rounded',
  'material-symbols-sharp': 'Material+Symbols+Sharp'
}

export const iconSetOptions = [
  { label: 'Material (webfont)', value: 'material-icons' },
  { label: 'Material (svg)', value: 'svg-material-icons' },
  { label: 'Material Outlined (webfont)', value: 'material-icons-outlined' },
  { label: 'Material Round (webfont)', value: 'material-icons-round' },
  { label: 'Material Sharp (webfont)', value: 'material-icons-sharp' },
  {
    label: 'Material Symbols Outlined (webfont)',
    value: 'material-symbols-outlined'
  },
  {
    label: 'Material Symbols Rounded (webfont)',
    value: 'material-symbols-rounded'
  },
  {
    label: 'Material Symbols Sharp (webfont)',
    value: 'material-symbols-sharp'
  },
  { label: 'MDI v7 (webfont)', value: 'mdi-v7' },
  { label: 'MDI v7 (svg)', value: 'svg-mdi-v7' },
  { label: 'Ionicons v8 (svg)', value: 'svg-ionicons-v8' },
  { label: 'Ionicons v4 (webfont)', value: 'ionicons-v4' },
  { label: 'Ionicons v4 (svg)', value: 'svg-ionicons-v4' },
  { label: 'Fontawesome v7 (webfont)', value: 'fontawesome-v7' },
  { label: 'Fontawesome v7 (svg)', value: 'svg-fontawesome-v7' },
  { label: 'Eva Icons (webfont)', value: 'eva-icons' },
  { label: 'Eva Icons (svg)', value: 'svg-eva-icons' },
  { label: 'Themify (webfont)', value: 'themify' },
  { label: 'Themify (svg)', value: 'svg-themify' },
  { label: 'Line Awesome (webfont)', value: 'line-awesome' },
  { label: 'Line Awesome (svg)', value: 'svg-line-awesome' },
  { label: 'Bootstrap Icons (webfont)', value: 'bootstrap-icons' },
  { label: 'Bootstrap Icons (svg)', value: 'svg-bootstrap-icons' }
]

export const defaultCss = {
  roboto: true,

  'material-icons': true,
  'material-icons-outlined': false,
  'material-icons-round': false,
  'material-icons-sharp': false,

  'material-symbols-outlined': false,
  'material-symbols-rounded': false,
  'material-symbols-sharp': false,

  'mdi-v7': false,
  'fontawesome-v7': false,
  'ionicons-v4': false,
  'eva-icons': false,
  themify: false,
  'line-awesome': false,
  'bootstrap-icons': false,

  animate: false
}

export const defaultOptions = {
  css: defaultCss,
  minified: true,
  rtl: false,
  cfgObject: false,
  lang: 'en-US',
  iconSet: 'material-icons'
}

const camelize = str => str.replaceAll(/(-\w)/g, m => m[1].toUpperCase())
const jsTag = url => `<script src="https://${url}"></script>`

/**
 * The html page for one pick of options.
 *
 * @param {{ version: string, css: Record<string, boolean>, minified: boolean, rtl: boolean, cfgObject: boolean, lang: string, iconSet: string }} options
 * @returns {string}
 */
export function buildUmdHtml({
  version,
  css,
  minified,
  rtl,
  cfgObject,
  lang,
  iconSet
}) {
  const parseUrl = url => {
    const min = minified ? url : url.replace('.prod', '')
    return rtl ? min : min.replace('.rtl', '')
  }
  const cssTag = url =>
    `<link href="https://${parseUrl(url)}" rel="stylesheet" type="text/css">`

  const picked = map =>
    Object.keys(map)
      .filter(key => css[key])
      .map(key => map[key])

  const googleFonts = picked(googleMap)
  const googleSymbols = picked(googleSymbolsMap)

  const head = [
    googleFonts.length === 0
      ? ''
      : `fonts.googleapis.com/css?family=${googleFonts.join('|')}`,
    googleSymbols.length === 0
      ? ''
      : `fonts.googleapis.com/css2?family=${googleSymbols.join('|')}`,
    ...picked(cssMap),
    `cdn.jsdelivr.net/npm/quasar@${version}/dist/quasar.rtl.prod.css`
  ]
    .filter(Boolean)
    .map(cssTag)
    .join('\n    ')

  const configInstantiation = cfgObject
    ? `, {
        config: {
          /*
          brand: {
            // primary: '#e46262',
            // ... or all other brand colors
          },
          notify: {...}, // default set of options for Notify Quasar plugin
          loading: {...}, // default set of options for Loading Quasar plugin
          loadingBar: { ... }, // settings for LoadingBar Quasar plugin
          // ..and many more (check Installation card on each Quasar component/directive/plugin)
          */
        }
      }`
    : ''

  let postCreateApp = ''
  if (lang !== 'en-US') {
    postCreateApp += `Quasar.Lang.set(Quasar.Lang.${lang.replaceAll('-', '')})\n      `
  }
  if (iconSet !== 'material-icons') {
    postCreateApp += `Quasar.IconSet.set(Quasar.IconSet.${camelize(iconSet)})\n      `
  }

  const startup = `
      /*
        Example kicking off the UI. Obviously, adapt this to your specific needs.
        Assumes you have a <div id="q-app"></div> in your <body> above
       */
      const app = Vue.createApp({
        setup () {
          return {}
        }
      })

      app.use(Quasar${configInstantiation})
      ${postCreateApp}app.mount('#q-app')
    `
  const scriptTag = `\n    <script>${startup}</script>`

  const js = [
    parseUrl('cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js'),
    parseUrl(`cdn.jsdelivr.net/npm/quasar@${version}/dist/quasar.umd.prod.js`)
  ]
  if (lang !== 'en-US') {
    js.push(
      `cdn.jsdelivr.net/npm/quasar@${version}/dist/lang/${lang}.umd.prod.js`
    )
  }
  if (iconSet !== 'material-icons') {
    js.push(
      `cdn.jsdelivr.net/npm/quasar@${version}/dist/icon-set/${iconSet}.umd.prod.js`
    )
  }
  const body = js.map(jsTag).join('\n    ')

  return `<!doctype html>
<html>
  <!--
    WARNING! Make sure that you match all Quasar related
    tags to the same version! (Below it's "@${version}")
  -->

  <head>
    ${head}
  </head>

  <body>
    <!-- example of injection point where you write your app template -->
    <div id="q-app"></div>

    <!-- Add the following at the end of your body tag -->
    ${body}
    ${scriptTag}
  </body>
</html>
`
}
