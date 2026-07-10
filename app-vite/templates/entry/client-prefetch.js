/* oxlint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config file > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
<% if (quasarConf.metaConf.hasLoadingBarPlugin) { %>
import { LoadingBar } from 'quasar'
<% } %>

<% if ((!quasarConf.ctx.mode.ssr && !quasarConf.ctx.mode.ssg) || quasarConf.ctx.mode.pwa) { %>
import App from '@/../<%= quasarConf.sourceFiles.rootComponent %>'
let appPrefetch = typeof App.preFetch === 'function'
  ? App.preFetch
  : (
    // Class components return the component options (and the preFetch hook) inside __c property
    App.__c !== void 0 && typeof App.__c.preFetch === 'function'
      ? App.__c.preFetch
      : false
    )
<% } %>

function getMatchedComponents (to, router) {
  const route = to
    ? (to.matched ? to : router.resolve(to).route)
    : router.currentRoute.value

  if (!route) { return [] }

  const matched = route.matched.filter(m => m.components !== void 0)

  if (matched.length === 0) { return [] }

  return Array.prototype.concat.apply([], matched.map(m => {
    return Object.keys(m.components).map(key => {
      const comp = m.components[key]
      return {
        path: m.path,
        c: comp
      }
    })
  }))
}

export function addPreFetchHooks ({ router<%= (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) && quasarConf.ctx.mode.pwa ? ', ssrIsRunningOnClientPWA' : '' %><%= quasarConf.metaConf.hasStore ? ', store' : '' %>, publicPath }) {
  // Add router hook for handling preFetch.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve(async (to, from) => {
    const
      urlPath = window.location.href.replace(window.location.origin, ''),
      matched = getMatchedComponents(to, router),
      prevMatched = getMatchedComponents(from, router)

    let diffed = false
    const preFetchList = matched
      .filter((m, i) => {
        return diffed || (diffed = (
          !prevMatched[i] ||
          prevMatched[i].c !== m.c ||
          m.path.includes('/:') // does it has params?
        ))
      })
      .filter(m => m.c !== void 0 && (
        typeof m.c.preFetch === 'function'
        // Class components return the component options (and the preFetch hook) inside __c property
        || (m.c.__c !== void 0 && typeof m.c.__c.preFetch === 'function')
      ))
      .map(m => m.c.__c !== void 0 ? m.c.__c.preFetch : m.c.preFetch)

    <% if ((!quasarConf.ctx.mode.ssr && !quasarConf.ctx.mode.ssg) || quasarConf.ctx.mode.pwa) { %>
    if (<%= (quasarConf.ctx.mode.ssr || quasarConf.ctx.mode.ssg) && quasarConf.ctx.mode.pwa ? 'ssrIsRunningOnClientPWA && ' : '' %>appPrefetch !== false) {
      preFetchList.unshift(appPrefetch)
      appPrefetch = false
    }
    <% } %>

    if (preFetchList.length === 0) return

    let redirectArg = null
    const redirect = url => { redirectArg = url }

    <% if (quasarConf.metaConf.hasLoadingBarPlugin) { %>
    LoadingBar.start()
    <% } %>

    for (let i = 0; redirectArg === null && i < preFetchList.length; i++) {
      try {
        await preFetchList[i]({
          <% if (quasarConf.metaConf.hasStore) { %>store,<% } %>
          currentRoute: to,
          previousRoute: from,
          redirect,
          urlPath,
          publicPath
        })
      } catch (e) {
        <% if (quasarConf.metaConf.hasLoadingBarPlugin) { %>
        LoadingBar.stop()
        <% } %>
        if (redirectArg !== null) return redirectArg
        console.error(e)
        return
      }
    }

    <% if (quasarConf.metaConf.hasLoadingBarPlugin) { %>
    LoadingBar.stop()
    <% } %>

    if (redirectArg !== null) return redirectArg
  })
}
