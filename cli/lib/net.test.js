import { describe, expect, test } from 'vitest'

import { getExternalNetworkInterface, getIPs } from './net.js'

const ipv4RE = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/

describe('[net.js]', () => {
  test('getIPs() returns IPv4 addresses', () => {
    const list = getIPs()

    expect(Array.isArray(list)).toBe(true)
    for (const ip of list) {
      expect(ip).toMatch(ipv4RE)
    }
  })

  test('getExternalNetworkInterface() returns external IPv4 devices', () => {
    const devices = getExternalNetworkInterface()

    expect(Array.isArray(devices)).toBe(true)
    for (const device of devices) {
      expect(device.deviceName).toBeTypeOf('string')
      expect(device.address).toMatch(ipv4RE)
      expect(device.family).toBe('IPv4')
      expect(device.internal).toBe(false)
    }
  })
})
