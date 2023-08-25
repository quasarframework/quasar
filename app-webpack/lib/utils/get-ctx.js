const { getAppPaths } = require('./get-app-paths.js')
const { getPkg } = require('./get-pkg.js')
const { createCacheProxy } = require('../cache/create-cache-proxy.js')
const { createAppExt } = require('../app-extension/create-app-ext.js')

function defineHiddenProp (target, propName, value) {
  Object.defineProperty(target, propName, {
    value,
    configurable: false,
    enumerable: false,
    writable: false
  })
}

module.exports.getCtx = function getCtx (opts = {}) {
  const ctx = {
    dev: opts.dev || false,
    prod: opts.prod || false,
    mode: {},
    modeName: opts.mode,
    target: {},
    targetName: opts.target,
    emulator: opts.emulator,
    arch: {},
    archName: opts.arch,
    bundler: {},
    bundlerName: opts.bundler,
    debug: opts.debug || false,
    publish: opts.publish,
    vueDevtools: opts.vueDevtools || false
  }

  ctx.mode[ opts.mode ] = true

  if (opts.target) {
    ctx.target[ opts.target ] = true
  }

  if (opts.arch) {
    ctx.arch[ opts.arch ] = true
  }

  if (opts.bundler) {
    ctx.bundler[ opts.bundler ] = true
  }

  ctx.appPaths = getAppPaths({
    ctx,
    rootDir: opts.rootDir || process.cwd(),
    defineHiddenProp
  })

  defineHiddenProp(ctx, 'pkg', getPkg(ctx.appPaths))
  defineHiddenProp(ctx, 'cacheProxy', createCacheProxy(ctx))
  defineHiddenProp(ctx, 'appExt', createAppExt(ctx))

  return Object.freeze(ctx)
}
