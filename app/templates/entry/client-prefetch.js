/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.conf.js > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
<% if (__loadingBar) { %>
import { LoadingBar } from 'quasar'
<% } %>

<% if (ctx.mode.ssr && ctx.mode.pwa) { %>
import { isRunningOnPWA } from './ssr-pwa'
<% } %>

<% if (!ctx.mode.ssr || ctx.mode.pwa) { %>
import App from 'app/<%= sourceFiles.rootComponent %>'
let appOptions = App.options /* Vue.extend() */ || App
let appPrefetch = typeof appOptions.preFetch === 'function'
<% } %>

function getMatchedComponents (to, router) {
  const route = to
    ? (to.matched ? to : router.resolve(to).route)
    : router.currentRoute

  if (!route) { return [] }

  const matched = route.matched.filter(m => m.components !== void 0)

  if (matched.length === 0) { return [] }

  return Array.prototype.concat.apply([], matched.map(m => {
    return Object.keys(m.components).map(key => {
      const comp = m.components[key]
      return {
        path: m.path,
        c: comp.options /* Vue.extend() */ || comp
      }
    })
  }))
}

export function addPreFetchHooks (router<%= store ? ', store' : '' %>, publicPath) {
  // Add router hook for handling preFetch.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
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
          m.path.indexOf('/:') > -1 // does it has params?
        ))
      })
      .filter(m => m.c && typeof m.c.preFetch === 'function')
      .map(m => m.c.preFetch)

    <% if (!ctx.mode.ssr) { %>
    if (appPrefetch === true) {
      appPrefetch = false
      preFetchList.unshift(appOptions.preFetch)
    }
    <% } else if (ctx.mode.pwa) { %>
    if (isRunningOnPWA === true && appPrefetch === true) {
      appPrefetch = false
      preFetchList.unshift(appOptions.preFetch)
    }
    <% } %>

    if (preFetchList.length === 0) {
      return next()
    }

    let hasRedirected = false
    const redirect = url => {
      hasRedirected = true
      next(url)
    }
    const proceed = () => {
      <% if (__loadingBar) { %>
      LoadingBar.stop()
      <% } %>
      if (hasRedirected === false) { next() }
    }

    <% if (__loadingBar) { %>
    LoadingBar.start()
    <% } %>

    preFetchList.reduce(
      (promise, preFetch) => promise.then(() => hasRedirected === false && preFetch({
        <% if (store) { %>store,<% } %>
        currentRoute: to,
        previousRoute: from,
        redirect,
        urlPath,
        publicPath
      })),
      Promise.resolve()
    )
    .then(proceed)
    .catch(e => {
      console.error(e)
      proceed()
    })
  })
}
