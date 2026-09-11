/**
 * Build production assets with or without the hash part in filenames.
 * Example: "454d87bd" in "assets/index.454d87bd.js"
 *
 * When used, please be careful how you configure your web server cache strategy as
 * files will not change name so your client might get 304 (Not Modified) even when
 * it's not the case.
 *
 * Will not change anything if your Vite config already touches the
 * build.rolldownOptions.output.entryFileNames/chunkFileNames/assetFileNames props.
 *
 * Gets applied to production builds only.
 *
 * For a PWA it keeps updates small (only the changed files get re-downloaded), but
 * the page applying an update must evict the scripts it preloaded before it reloads:
 * Safari reuses them (<link rel="modulepreload">) from its in-memory cache across
 * that reload without asking the service worker, and with stable filenames the new
 * entry file would then run with old chunks ("SyntaxError: Importing binding name
 * '...' is not found"). A fetch() of each precached script through the new worker
 * evicts them; see the PWA docs, "Filename hashes quirk".
 */
export function quasarViteStripFilenameHashesPlugin() {
  return {
    name: 'quasar:strip-filename-hashes',

    enforce: 'post',

    config: viteConf => {
      viteConf.build.rolldownOptions ||= {}
      viteConf.build.rolldownOptions.output ||= {}

      const target = viteConf.build.rolldownOptions.output
      const assetsDir = (viteConf.build.assetsDir || 'assets') + '/'

      if (!target.entryFileNames) {
        target.entryFileNames = `${assetsDir}[name].js`
      }
      if (!target.chunkFileNames) {
        target.chunkFileNames = `${assetsDir}[name].js`
      }
      if (!target.assetFileNames) {
        target.assetFileNames = `${assetsDir}[name].[ext]`
      }
    }
  }
}
