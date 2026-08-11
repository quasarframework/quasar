import { getAppPaths } from './get-app-paths.js'
import { getPkg } from './get-pkg.js'
import { createCacheProxy } from '../cache/create-cache-proxy.js'
import { createAppExt } from '../app-extension/create-app-ext.js'
import {
  dot,
  error,
  fatal,
  info,
  log,
  progress,
  success,
  tip,
  warn,
  warning
} from './logger.js'

const publicLogger = Object.freeze({
  dot,
  log,
  warn,
  fatal,
  info,
  success,
  error,
  warning,
  tip,
  progress
})

function defineHiddenProp(target, propName, value) {
  Object.defineProperty(target, propName, {
    value,
    configurable: false,
    enumerable: false,
    writable: false
  })
}

/**
 * @returns {import('../../types/configuration/context').InternalQuasarContext}
 */
export function getCtx(opts = {}) {
  const ctx = {
    dev: Boolean(opts.dev),
    prod: Boolean(opts.prod),
    mode: {
      spa: false,
      ssr: false,
      ssg: false,
      pwa: false,
      capacitor: false,
      cordova: false,
      electron: false,
      bex: false
    },
    modeName: opts.mode,
    target: {},
    targetName: opts.target,
    arch: {},
    archName: opts.arch,
    bundler: {},
    bundlerName: opts.bundler,
    debug: Boolean(opts.debug),
    publish: opts.publish,
    vueDevtools: Boolean(opts.vueDevtools)
  }

  if (ctx.dev === ctx.prod) {
    ctx.dev = false
    ctx.prod = true
  }

  ctx.mode[opts.mode] = true

  if (opts.target) {
    ctx.target[opts.target] = true
  }

  if (opts.arch) {
    ctx.arch[opts.arch] = true
  }

  if (opts.bundler) {
    ctx.bundler[opts.bundler] = true
  }

  ctx.appPaths = getAppPaths({
    ctx,
    defineHiddenProp
  })

  ctx.logger = publicLogger

  defineHiddenProp(ctx, 'pkg', getPkg(ctx.appPaths))
  defineHiddenProp(ctx, 'cacheProxy', createCacheProxy(ctx))
  defineHiddenProp(ctx, 'appExt', createAppExt(ctx))

  return Object.freeze(ctx)
}
