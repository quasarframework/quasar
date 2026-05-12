// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app';

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
    // 'fontawesome-v6',
    // 'eva-icons',
    // 'themify',
    // 'line-awesome',
    // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

    'roboto-font', // optional, you are not bound to it
    'material-icons', // optional, you are not bound to it
  ],

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
  build: {
    target: {
      browser: 'baseline-widely-available',
      node: 'node22',
    },

    typescript: {
      strict: true,
      vueShim: true,
      // extendTsConfig (tsConfig) {}
    },

    vueRouterMode: 'hash', // available values: 'hash', 'history'
    // vueRouterBase,
    // vueDevtools,
    // vueOptionsAPI: false,

    // publicPath: '/',
    // analyze: true,
    // define: {},
    // defineEnv: {},
    // ignorePublicFolder: true,
    // minify: false,
    // distDir,

    // extendViteConf (viteConf) {},
    // viteVuePluginOptions: {},

    // vitePlugins: [
    //   [ 'package-name', { ..pluginOptions.. }, { server: true, client: true } ]
    // ]
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
  devServer: {
    // https: true,
    open: true, // opens browser window automatically
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
    plugins: [],
  },

  // animations: 'all', // --- includes all animations
  // https://v2.quasar.dev/options/animations
  animations: [],
}));
