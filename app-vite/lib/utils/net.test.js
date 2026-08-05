import net from 'node:net'
import { describe, expect, test } from 'vitest'

import {
  findClosestOpenPort,
  getExternalNetworkInterface,
  getIPs,
  isPortAvailable,
  localHostList
} from './net.js'

describe('[net.js]', () => {
  const ipv4RE = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/

  function occupyPort() {
    const { promise, resolve: resolvePromise } = Promise.withResolvers()
    const server = net.createServer()
    server.listen(0, '127.0.0.1', () => {
      resolvePromise(server)
    })
    return promise
  }

  function closeServer(server) {
    const { promise, resolve: resolvePromise } = Promise.withResolvers()
    server.close(resolvePromise)
    return promise
  }

  test('localHostList holds the local host aliases', () => {
    expect(localHostList).toEqual(['0.0.0.0', 'localhost', '127.0.0.1', '::1'])
  })

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

  test('isPortAvailable() reflects the port state', async () => {
    const server = await occupyPort()
    const { port } = server.address()

    await expect(isPortAvailable(port, '127.0.0.1')).resolves.toBe(false)

    await closeServer(server)

    await expect(isPortAvailable(port, '127.0.0.1')).resolves.toBe(true)
  })

  test('findClosestOpenPort() keeps a free port', async () => {
    const server = await occupyPort()
    const { port } = server.address()
    await closeServer(server)

    await expect(findClosestOpenPort(port, '127.0.0.1')).resolves.toBe(port)
  })

  test('findClosestOpenPort() skips a busy port', async () => {
    const server = await occupyPort()
    const { port } = server.address()

    const found = await findClosestOpenPort(port, '127.0.0.1')

    expect(found).toBeGreaterThan(port)
    await expect(isPortAvailable(found, '127.0.0.1')).resolves.toBe(true)

    await closeServer(server)
  })
})
