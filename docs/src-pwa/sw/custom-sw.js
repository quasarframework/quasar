import { clientsClaim, setCacheNameDetails } from 'workbox-core'
import {
  addPlugins,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'

import { agentFilesRE } from '../../build/agent-files.js'

// the cache names of the generated worker this one replaces (GenerateSW
// mode prefixed them with the package name): the precache carries over
setCacheNameDetails({ prefix: 'quasar.dev' })

// No skipWaiting: an updated worker waits until the browser activates it,
// once no tab uses the current one (src-pwa/register-sw.js). Claiming only
// matters for the very first install.
clientsClaim()

// WebKit keeps the scripts and styles a document loaded in a memory cache
// of its web process and hands them to the next document of the same site
// without asking the worker, so a tab opened seconds after the last one
// closed would run the previous build's chunks against the updated
// precache (the chunk filenames are stable). A "no-store" response is not
// reused that way; the precache itself keeps the original headers.
addPlugins([
  {
    handlerWillRespond: ({ request, response }) => {
      if (!/\.(js|css)$/.test(new URL(request.url).pathname)) {
        return response
      }

      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'no-store')

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      })
    }
  }
])

precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()

registerRoute(
  new NavigationRoute(
    createHandlerBoundToURL(import.meta.env.QUASAR_PWA_FALLBACK_HTML),
    {
      denylist: [
        new RegExp(import.meta.env.QUASAR_PWA_SERVICE_WORKER_REGEX),
        /workbox-(.)*\.js$/,
        agentFilesRE
      ]
    }
  )
)

registerRoute(/^https:\/\/cdn/, new StaleWhileRevalidate())
registerRoute(agentFilesRE, new NetworkOnly())
