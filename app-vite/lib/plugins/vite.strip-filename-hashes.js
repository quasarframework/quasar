/**
 * Build production assets with or without the hash part in filenames.
 * Example: "454d87bd" in "assets/index.454d87bd.js"
 *
 * When used, please be careful how you configure your web server cache strategy as
 * files will not change name so your client might get 304 (Not Modified) even when
 * it's not the case.
 *
 * Will not change anything if your Vite config already touches the
 * build.rollupOptions.output.entryFileNames/chunkFileNames/assetFileNames props.
 *
 * Gets applied to production builds only.
 *
 * Useful especially for (but not restricted to) PWA. Without it, updating the
 * PWA will force to re-download all assets again, regardless if they were changed or
 * not (due to how Rollup works through Vite).
 */
module.exports = () => {
  return {
    name: 'quasar:strip-filename-hashes',

    enforce: 'post',

    config: viteConf => {
      viteConf.build.rollupOptions = viteConf.build.rollupOptions || {}
      viteConf.build.rollupOptions.output = viteConf.build.rollupOptions.output || {}

      const target = viteConf.build.rollupOptions.output
      const assetsDir = (viteConf.build.assetsDir || 'assets') + '/'

      if (!target.entryFileNames) { target.entryFileNames = `${ assetsDir }[name].js` }
      if (!target.chunkFileNames) { target.chunkFileNames = `${ assetsDir }[name].js` }
      if (!target.assetFileNames) { target.assetFileNames = `${ assetsDir }[name].[ext]` }
    }
  }
}
