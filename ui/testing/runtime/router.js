import { createRouter, createWebHistory } from 'vue-router'

const routeComponent = { template: '<div />' }

function getRouteEntry (path, children = []) {
  return { path, component: routeComponent, children }
}

/**
 * Examples:
 *   getRoutes('/my/route')
 *   getRoutes([ '/my/route' ])
 *   getRoutes([ '/my/route', '/other/route' ])
 *   getRoutes({ '/my': 'route' })
 *   getRoutes({ '/my': 'route', '/other': 'route' })
 *   getRoutes({ '/my': [ 'route', 'otherRoute' ] })
 *   getRoutes({ '/my': { 'route': true, otherRoute: 'subRoute' } })
 *   getRoutes({ '/my': { 'route': { subRoute: 'final' } } })
 *   getRoutes([ { '/my': 'route' }, { '/other': { route: 'subRoute' } } ])
 *
 * @param {*} entry
 * @returns RouteConfig[]
 */
function getRoutes (entry) {
  if (entry === true) {
    return []
  }

  if (typeof entry === 'string') {
    return [ getRouteEntry(entry) ]
  }

  if (Array.isArray(entry) === true) {
    return entry.reduce((acc, route) => {
      acc.push(...getRoutes(route))
      return acc
    }, [])
  }

  if (typeof entry === 'object') {
    return Object.keys(entry)
      .map(key => getRouteEntry(key, getRoutes(entry[ key ])))
  }

  throw new Error('Invalid route node: ' + JSON.stringify(entry))
}

export async function getRouter (routes) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: routeComponent },
      ...getRoutes(routes)
    ]
  })

  router.push('/')
  await router.isReady()

  return router
}
