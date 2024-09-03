import { describe, test, expect } from 'vitest'
import { mount, config } from '@vue/test-utils'

import { globalConfig, globalConfigIsFrozen, freezeGlobalConfig } from './instance-config.js'

// We override Quasar install so we have a custom $q.config
const quasarVuePlugin = config.global.plugins.find(entry => entry.name === 'Quasar')
const { install } = quasarVuePlugin

function mountWithConfig (config) {
  quasarVuePlugin.install = app => install(app, { config })
  mount({ template: '<div />' })
}

describe('[instanceConfig API]', () => {
  describe('[Variables]', () => {
    describe('[(variable)globalConfig]', () => {
      test('is defined correctly', () => {
        expect(globalConfig).toBeTypeOf('object')
        expect(Object.keys(globalConfig)).toHaveLength(0)
        expect(globalConfigIsFrozen).toBe(false)

        const cfg = { some: 'value' }
        mountWithConfig(cfg)

        expect(globalConfig).toStrictEqual(cfg)
        expect(globalConfigIsFrozen).toBe(true)

        const secondCfg = { other: 'val' }
        mountWithConfig(secondCfg)

        expect(globalConfig).toStrictEqual(cfg)
      })
    })

    describe('[(variable)globalConfigIsFrozen]', () => {
      test('is defined correctly', () => {
        expect(globalConfigIsFrozen).toBeTypeOf('boolean')
      })
    })
  })

  describe('[Functions]', () => {
    describe('[(function)freezeGlobalConfig]', () => {
      test('has correct return value', () => {
        expect(
          freezeGlobalConfig()
        ).toBeUndefined()

        expect(globalConfigIsFrozen).toBe(true)
      })
    })
  })
})
