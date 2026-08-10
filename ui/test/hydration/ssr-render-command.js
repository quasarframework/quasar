import { join, normalize } from 'node:path'
import { pathToFileURL } from 'node:url'

import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

// resolves through the package self-reference ("node" export
// condition) to dist/quasar.server.prod.js — the SSR flags are baked
// into it, so no Quasar source needs compiling on this side
import { Quasar } from 'quasar'

const rootFolder = normalize(join(import.meta.dirname, '../..'))

/**
 * Vitest browser command (runs in Node): server-renders a fixture the
 * way a real SSR webserver would, with the calling browser's own
 * user-agent on the request so both render passes see the same
 * platform. The fixtures module (root-relative path + export name)
 * resolves its "quasar" import to the built server bundle here.
 */
export async function ssrRender(_ctx, fixturesPath, exportName, userAgent) {
  const absolutePath = normalize(join(rootFolder, fixturesPath))

  if (!absolutePath.startsWith(rootFolder)) {
    throw new Error(
      `Hydration fixtures module outside of /ui: "${fixturesPath}"`
    )
  }

  const fixturesModule = await import(pathToFileURL(absolutePath).href)
  const fixture = fixturesModule[exportName]

  if (fixture === void 0) {
    throw new Error(
      `Hydration fixtures module "${fixturesPath}" has no "${exportName}" export`
    )
  }

  const ssrContext = {
    req: { headers: { 'user-agent': userAgent }, url: '/' },
    res: {}
  }

  const app = createSSRApp(fixture)
  app.use(Quasar, fixturesModule.quasarOptions, ssrContext)

  if (fixturesModule.setupApp !== void 0) {
    await fixturesModule.setupApp(app)
  }

  const html = await renderToString(app, ssrContext)

  // what a real SSR webserver renders into the <html>/<body> tags —
  // plugins like Dark read it back on the client instead of the
  // config, and the client-side plugin installs must converge to the
  // same state (asserted by hydrate())
  return {
    html,
    meta: {
      htmlAttrs: ssrContext._meta.htmlAttrs.trim(),
      bodyClasses: ssrContext._meta.bodyClasses.trim(),
      bodyAttrs: ssrContext._meta.bodyAttrs.trim()
    }
  }
}
