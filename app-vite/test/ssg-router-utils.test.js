import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  getParseVueRouterRoutesFn,
  loadFilenameBasedRoutes
} from '../lib/modes/ssg/ssg-builder.js'

function createQuasarConf(clientSideRenderingRoutes = []) {
  return {
    ssg: { clientSideRenderingRoutes }
  }
}

test('parseVueRouterRoutes traverses children of a redirected parent', () => {
  const parseVueRouterRoutes = getParseVueRouterRoutesFn(createQuasarConf())

  const pages = parseVueRouterRoutes({
    routes: [
      {
        path: '/account',
        redirect: '/account/profile',
        children: [{ path: 'profile' }, { path: 'settings' }]
      }
    ]
  })

  assert.deepEqual(pages, [
    { route: '/account/profile' },
    { route: '/account/settings' }
  ])
})

test('parseVueRouterRoutes ignores redirect leaf records', () => {
  const parseVueRouterRoutes = getParseVueRouterRoutesFn(createQuasarConf())

  const pages = parseVueRouterRoutes({
    routes: [{ path: '/', redirect: '/home' }, { path: '/home' }]
  })

  assert.deepEqual(pages, [{ route: '/home' }])
})

test('loadFilenameBasedRoutes closes the Vite server after success', async () => {
  let closeCalled = false
  const routes = [{ path: '/' }]

  const result = await loadFilenameBasedRoutes({}, () => ({
    ssrLoadModule: () => ({ routes }),
    close: () => {
      closeCalled = true
    }
  }))

  assert.equal(result, routes)
  assert.equal(closeCalled, true)
})

test('loadFilenameBasedRoutes closes the Vite server after failure', async () => {
  let closeCalled = false
  const failure = new Error('failed to load routes')

  await assert.rejects(
    loadFilenameBasedRoutes({}, () => ({
      ssrLoadModule: () => {
        throw failure
      },
      close: () => {
        closeCalled = true
      }
    })),
    failure
  )

  assert.equal(closeCalled, true)
})
