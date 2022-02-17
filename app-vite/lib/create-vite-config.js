const { quasar: quasarVitePlugin } = require('@quasar/vite-plugin')
const vueVitePlugin = require('@vitejs/plugin-vue')

const appPaths = require('./app-paths')
const parseEnv = require('./parse-env')

const quasarVitePluginIndexHtmlTransform = require('./vite-plugins/index-html-transform')


module.exports = function (quasarConf) {
  const { ctx, build } = quasarConf

  const viteConf = {
    configFile: false,
    root: appPaths.appDir,
    base: build.publicPath,
    publicDir: build.ignorePublicFolder
      ? false
      : appPaths.publicDir,
    mode: ctx.dev === true ? 'development' : 'production',
    resolve: build.resolve,
    define: parseEnv(build.env, build.rawDefine),
    css: build.css,
    json: build.json,
    optimizeDeps: build.optimizeDeps,
    assetsInclude: build.assetsInclude,
    build: {
      rollupOptions: build.rollupOptions,
      commonjsOptions: build.commonjsOptions,
      dynamicImportVarsOptions: build.dynamicImportVarsOptions,
      reportCompressedSize: build.reportCompressedSize,
      chunkSizeWarningLimit: build.chunkSizeWarningLimit,
      assetsInlineLimit: build.assetsInlineLimit,
      cssCodeSplit: build.cssCodeSplit,
      sourcemap: build.sourcemap
    },
    plugins: [
      quasarVitePluginIndexHtmlTransform(quasarConf),
      vueVitePlugin(build.viteVuePluginOptions),
      quasarVitePlugin({
        autoImportComponentCase: quasarConf.framework.autoImportComponentCase,
        sassVariables: quasarConf.metaConf.css.variablesFile
      }),
      ...build.vitePlugins
    ]
  }

  if (ctx.dev) {
    viteConf.server = quasarConf.devServer
  }
  else {
    viteConf.build.outDir = build.distDir
  }

  if (build.minify === false) {
    viteConf.build.minify = false
  }

  return viteConf
}
