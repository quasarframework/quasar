/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/
import App from 'app/<%= sourceFiles.rootComponent %>'

<% if (__loadingBar) { %>
import { LoadingBar } from 'quasar'
<% } %>

<% if (!ctx.mode.ssr) { %>
let appPrefetch = typeof App.preFetch === 'function'
<% } %>

function getMatchedComponents (to, router) {
  const route = to
    ? (to.matched ? to : router.resolve(to).route)
    : router.currentRoute

  if (!route) { return [] }
  return [].concat.apply([], route.matched.map(m => {
    return Object.keys(m.components).map(key => {
      return {
        path: m.path,
        c: m.components[key]
      }
    })
  }))
}

export function addPreFetchHooks (router<%= store ? ', store' : '' %>) {
  // Add router hook for handling preFetch.
  // Doing it after initial route is resolved so that we don't double-fetch
  // the data that we already have. Using router.beforeResolve() so that all
  // async components are resolved.
  router.beforeResolve((to, from, next) => {
    const
      matched = getMatchedComponents(to, router),
      prevMatched = getMatchedComponents(from, router)

    let diffed = false
    const components = matched
      .filter((m, i) => {
        return diffed || (diffed = (
          !prevMatched[i] ||
          prevMatched[i].c !== m.c ||
          m.path.indexOf('/:') > -1 // does it has params?
        ))
      })
      .filter(m => m.c && typeof m.c.preFetch === 'function')
      .map(m => m.c)

    <% if (!ctx.mode.ssr) { %>
    if (appPrefetch) {
      appPrefetch = false
      components.unshift(App)
    }
    <% } %>

    if (!components.length) { return next() }

    let routeUnchanged = true
    const redirect = url => {
      routeUnchanged = false
      next(url)
    }
    const proceed = () => {
      <% if (__loadingBar) { %>
      LoadingBar.stop()
      <% } %>
      if (routeUnchanged) { next() }
    }

    <% if (__loadingBar) { %>
    LoadingBar.start()
    <% } %>

    components
    .filter(c => c && c.preFetch)
    .reduce(
      (promise, c) => promise.then(() => routeUnchanged && c.preFetch({
        <% if (store) { %>store,<% } %>
        currentRoute: to,
        previousRoute: from,
        redirect
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
