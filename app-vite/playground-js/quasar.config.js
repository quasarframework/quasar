// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app'

export default defineConfig((/* ctx */) => ({
  // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
  // preFetch: true,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://v2.quasar.dev/quasar-cli-vite/boot-files
  boot: [],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
  css: ['app.scss'],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    // 'ionicons-v4',
    // 'mdi-v7',
    // 'fontawesome-v7',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    'roboto-font', // optional, you are not bound to it
    'material-icons' // optional, you are not bound to it
  ],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
  build: {
    target: {
      // browser: 'baseline-widely-available',
      // node: 'node22'
    },

    // https://v2.quasar.dev/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing
    filenameBasedRouting: true,

    vueRouterMode: 'history' // available values: 'hash', 'history'
    // vueRouterBase,
    // vueDevtools,

    // publicPath: '/',
    // define: {},
    // defineEnv: {}
    // ignorePublicFolder: true,
    // minify: false,
    // distDir

    // extendViteConf (viteConf) {},
    // viteVuePluginOptions: {},

    // vitePlugins: [
    //   [ 'package-name', { ..pluginOptions.. }, { server: true, client: true } ]
    // ]
  },

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
  devServer: {
    // https: true,
    open: {
      app: { name: 'google chrome' }
    }
  },

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
  framework: {
    config: {},

    // iconSet: 'material-icons', // Quasar icon set
    // lang: 'en-US', // Quasar language pack

    // For special cases outside of where the auto-import strategy can have an impact
    // (like functional components as one of the examples),
    // you can manually specify Quasar components/directives to be available everywhere:
    //
    // components: [],
    // directives: [],

    // Quasar plugins
    plugins: []
  },

  // animations: 'all', // --- includes all animations
  // https://v2.quasar.dev/options/animations
  animations: [],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#sourcefiles
  // sourceFiles: {
  //   rootComponent: 'src/App.vue',
  //   router: 'src/router/index',
  //   store: 'src/store/index',
  //   pwaRegisterServiceWorker: 'src-pwa/register-sw',
  //   pwaServiceWorker: 'src-pwa/sw/custom-sw',
  //   pwaManifestFile: 'src-pwa/manifest.json',
  //   electronMain: 'src-electron/electron-main',
  //   electronPreload: 'src-electron/electron-preload'
  //   bexManifestFile: 'src-bex/manifest.json
  // },

  // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
  ssr: {
    pwa: false,
    /**
     * The default port that the production server should use
     * (gets superseded if process.env.PORT is specified at runtime)
     */
    prodPort: 3000,
    middlewares: [
      'render' // keep this as last one
    ]

    // extendSSRPackageJson (pkgJson) {},
    // extendSSRManifestJson (json) {},
    // extendSSRWebserverConf (rolldownConf) {},

    // manualStoreSerialization: true,
    // manualStoreSsrContextInjection: true,
    // manualStoreHydration: true,
    // manualPostHydrationTrigger: true,

    // pwaOfflineHtmlFilename: 'offline.html', // do NOT use index.html as name!
    // extendSSRGenerateSWOptions (cfg) {},
    // extendSSRInjectManifestOptions (cfg) {}
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-ssg/configuring-ssg
  ssg: {
    // pwa: true
    // extendSSGManifestJson (json) {},
    // extendSSGRendererConf (rolldownConf) {},
    // manualStoreSerialization: true,
    // manualStoreSsrContextInjection: true,
    // manualStoreHydration: true,
    // manualPostHydrationTrigger: true,
    // error404HtmlFilename: '404.html'
    // pwaOfflineHtmlFilename: 'offline.html',
    // clientSideRenderingHtmlFilename: 'csr.html'
    // extendSSGGenerateSWOptions (cfg) {},
    // extendSSGInjectManifestOptions (cfg) {},
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
  pwa: {
    workboxMode: 'GenerateSW' // 'GenerateSW' or 'InjectManifest'
    // swFilename: 'sw.js',
    // manifestFilename: 'manifest.json',
    // extendPWAManifestJson (json) {},
    // useCredentialsForManifestTag: true,
    // injectPWAMetaTags: false,
    // extendPWACustomSWConf (rolldownConf) {},
    // extendPWAGenerateSWOptions (cfg) {},
    // extendPWAInjectManifestOptions (cfg) {},
    // extendPWASwTsConfig (tsConfig) {}
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
  cordova: {},

  // https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
  capacitor: {
    hideSplashscreen: true
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
  electron: {
    // extendElectronMainConf (rolldownConf) {},
    // extendElectronPreloadConf (rolldownConf) {},
    // extendElectronPackageJson (pkgJson) {},

    // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
    preloadScripts: ['electron-preload'],

    // specify the debugging port to use for the Electron app when running in development mode
    inspectPort: 5858,

    bundler: 'packager', // 'packager' or 'builder'

    packager: {
      // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
      // OS X / Mac App Store
      // appBundleId: '',
      // appCategoryType: '',
      // osxSign: '',
      // protocol: 'myapp://path',
      // Windows only
      // win32metadata: { ... }
    },

    builder: {
      // https://www.electron.build/configuration

      appId: 'playground-js'
    }
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
  bex: {
    // extendBexScriptsConf (rolldownConf) {},
    // extendBexManifestJson (json) {},

    /**
     * The list of extra scripts (js/ts) not in your bex manifest that you want to
     * compile and use in your browser extension. Maybe dynamic use them?
     *
     * Each entry in the list should be a relative filename to /src-bex/
     *
     * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
     */
    extraScripts: []
  }
}))
