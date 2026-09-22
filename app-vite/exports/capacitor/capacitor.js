/**
 * See `capacitor.cjs` for more information.
 */

function applyDefaults(base) {
  // Quasar-internal coupling: Vite always builds to src-capacitor/www. Filled in
  // even when there's no runtime env (unlike server.url below), so standalone
  // `cap` invocations get the right value. User-set webDir always wins just in case.
  if (base.webDir === void 0) {
    base.webDir = 'www'
  }

  // The splash screen plugin stretches its drawables (FIT_XY) when the app
  // calls show(); Icon Genie composes them icon-centered on a covering
  // background, which is what CENTER_CROP keeps intact. User-set value wins.
  const plugins = { ...base.plugins }
  const splashScreen = { ...plugins.SplashScreen }

  if (splashScreen.androidScaleType === void 0) {
    splashScreen.androidScaleType = 'CENTER_CROP'
  }

  plugins.SplashScreen = splashScreen
  base.plugins = plugins

  // If this does not exist, then this is loaded outside Quasar CLI, e.g. a direct `cap` call, skip
  const target = process.env.QUASAR_TARGET
  if (!target) {
    return base
  }

  const isDev = process.env.QUASAR_DEV === 'true'
  const devUrl = process.env.QUASAR_APP_URL

  if (isDev && devUrl) {
    const server = { ...base.server }

    if (server.url === void 0) {
      server.url = devUrl
    }

    if (target === 'android' && server.cleartext === void 0) {
      server.cleartext = true
    }

    base.server = server
  }

  return base
}

export function defineCapacitorConfig(input) {
  if (typeof input === 'function') {
    const result = input()
    if (result && typeof result.then === 'function') {
      return result.then(applyDefaults)
    }

    return applyDefaults(result)
  }

  return applyDefaults(structuredClone(input))
}
