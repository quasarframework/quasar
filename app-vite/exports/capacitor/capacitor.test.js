import { createRequire } from 'node:module'
import { afterEach, describe, expect, it } from 'vitest'

import { defineCapacitorConfig as defineEsm } from './capacitor.js'

const require = createRequire(import.meta.url)
const { defineCapacitorConfig: defineCjs } = require('./capacitor.cjs')

const runtimeKeys = ['QUASAR_TARGET', 'QUASAR_DEV', 'QUASAR_APP_URL']
const savedEnv = Object.fromEntries(
  runtimeKeys.map(key => [key, process.env[key]])
)

function setRuntime(env) {
  runtimeKeys.forEach(key => {
    delete process.env[key]
  })
  Object.assign(process.env, env)
}

afterEach(() => {
  setRuntime(savedEnv)
})

describe.each([
  ['capacitor.js', defineEsm],
  ['capacitor.cjs', defineCjs]
])('defineCapacitorConfig (%s)', (_, defineCapacitorConfig) => {
  it('applies the standalone defaults without a Quasar runtime', () => {
    setRuntime({})

    const config = defineCapacitorConfig({ appId: 'org.test', appName: 'Test' })

    expect(config).toEqual({
      appId: 'org.test',
      appName: 'Test',
      webDir: 'www',
      plugins: { SplashScreen: { androidScaleType: 'CENTER_CROP' } }
    })
  })

  it('keeps user-set values and the other plugins', () => {
    setRuntime({})

    const config = defineCapacitorConfig({
      webDir: 'dist',
      plugins: {
        SplashScreen: { androidScaleType: 'FIT_XY', launchShowDuration: 0 },
        Keyboard: { resize: 'body' }
      }
    })

    expect(config.webDir).toBe('dist')
    expect(config.plugins).toEqual({
      SplashScreen: { androidScaleType: 'FIT_XY', launchShowDuration: 0 },
      Keyboard: { resize: 'body' }
    })
  })

  it('does not mutate the input object', () => {
    setRuntime({})

    const input = { plugins: { SplashScreen: {} } }
    defineCapacitorConfig(input)

    expect(input.plugins.SplashScreen).toEqual({})
    expect(input.webDir).toBeUndefined()
  })

  it('injects the dev server for Android dev runs', () => {
    setRuntime({
      QUASAR_TARGET: 'android',
      QUASAR_DEV: 'true',
      QUASAR_APP_URL: 'http://192.168.1.2:9000'
    })

    const config = defineCapacitorConfig({ server: { hostname: 'app' } })

    expect(config.server).toEqual({
      hostname: 'app',
      url: 'http://192.168.1.2:9000',
      cleartext: true
    })
  })

  it('leaves the server alone on builds', () => {
    setRuntime({ QUASAR_TARGET: 'ios', QUASAR_DEV: 'false' })

    expect(defineCapacitorConfig({}).server).toBeUndefined()
  })

  it('accepts sync and async factories', async () => {
    setRuntime({})

    expect(defineCapacitorConfig(() => ({ appId: 'sync' }))).toMatchObject({
      appId: 'sync',
      webDir: 'www'
    })

    await expect(
      defineCapacitorConfig(() => Promise.resolve({ appId: 'async' }))
    ).resolves.toMatchObject({ appId: 'async', webDir: 'www' })
  })
})
