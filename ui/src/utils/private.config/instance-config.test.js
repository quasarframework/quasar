import { describe, expect, test } from 'vitest'
import { config, mount } from '@vue/test-utils'
import { h } from 'vue'

import {
  freezeGlobalConfig,
  globalConfig,
  globalConfigIsFrozen
} from './instance-config.js'

// We override Quasar install so we have a custom $q.config
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin

function mountWithConfig(mountConfig) {
  quasarVuePlugin.install = app => install(app, { config: mountConfig })
  mount({ render: () => h('div') })
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
        expect(freezeGlobalConfig()).toBeUndefined()

        expect(globalConfigIsFrozen).toBe(true)
      })
    })
  })
})
