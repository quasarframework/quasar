import { describe, expect, test } from 'vitest'
import { config, mount } from '@vue/test-utils'

import Meta from './Meta.js'

const mountPlugin = () => mount({ template: '<div />' })

// We override Quasar install so it installs this plugin
const quasarVuePlugin = config.global.plugins.find(
  entry => entry.name === 'Quasar'
)
const { install } = quasarVuePlugin
quasarVuePlugin.install = app => install(app, { plugins: { Meta } })

describe('[Meta API]', () => {
  describe('[Generic]', () => {
    test('should not throw error when installed', () => {
      expect(mountPlugin).not.toThrow()
    })
  })
})
