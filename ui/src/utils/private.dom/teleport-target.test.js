import { afterEach, describe, expect, test } from 'vitest'

import { globalConfig } from '../private.config/instance-config.js'
import {
  getTeleportTarget,
  getTeleportTargetElement
} from './teleport-target.js'

afterEach(() => {
  delete globalConfig.teleportTarget
  document.body.innerHTML = ''
})

describe('[teleport target]', () => {
  test('defaults to document.body', () => {
    expect(getTeleportTarget()).toBe(document.body)
  })

  test('resolves a selector', () => {
    const target = document.createElement('div')
    target.id = 'target'
    document.body.append(target)
    globalConfig.teleportTarget = '#target'

    expect(getTeleportTarget()).toBe(target)
  })

  test('returns the host when an element target is required', () => {
    const host = document.createElement('div')
    const shadowRoot = host.attachShadow({ mode: 'open' })
    globalConfig.teleportTarget = shadowRoot

    expect(getTeleportTarget()).toBe(shadowRoot)
    expect(getTeleportTargetElement()).toBe(host)
  })

  test('rejects unresolved selectors and invalid resolver results', () => {
    globalConfig.teleportTarget = '#missing'
    expect(() => getTeleportTarget()).toThrow(TypeError)

    globalConfig.teleportTarget = () => null
    expect(() => getTeleportTarget()).toThrow(TypeError)
  })
})
