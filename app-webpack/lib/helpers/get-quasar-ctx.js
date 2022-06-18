module.exports = function (opts) {
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

  return ctx
}
