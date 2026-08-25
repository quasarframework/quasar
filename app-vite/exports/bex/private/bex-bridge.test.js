import { describe, expect, test, vi } from 'vitest'

/**
 * A minimal in-process mock of the chrome extension messaging API,
 * faithful enough for the bridge: port pairs delivering messages
 * asynchronously, onConnect/onMessage events, one-off runtime/tabs
 * messages and background service worker termination.
 */

class MockChromeEvent {
  #listeners = new Set()

  addListener(fn) {
    this.#listeners.add(fn)
  }

  removeListener(fn) {
    this.#listeners.delete(fn)
  }

  hasListeners() {
    return this.#listeners.size !== 0
  }

  emit(...args) {
    for (const fn of this.#listeners) {
      fn(...args)
    }
  }

  clear() {
    this.#listeners.clear()
  }
}

function createPortPair(name) {
  const makePort = () => ({
    name,
    connected: true,
    onMessage: new MockChromeEvent(),
    onDisconnect: new MockChromeEvent()
  })

  const portA = makePort()
  const portB = makePort()

  const wire = (self, peer) => {
    self.postMessage = message => {
      if (!self.connected) {
        throw new Error('Attempting to use a disconnected port object')
      }

      // the real API structured-clones the message
      const packet = structuredClone(message)
      queueMicrotask(() => {
        if (peer.connected) {
          peer.onMessage.emit(packet, peer)
        }
      })
    }

    self.disconnect = () => {
      if (!self.connected) return
      self.connected = false
      peer.connected = false
      queueMicrotask(() => {
        peer.onDisconnect.emit(peer)
      })
    }
  }

  wire(portA, portB)
  wire(portB, portA)

  return [portA, portB]
}

function createChromeMock() {
  const backgroundPorts = new Set()

  const chromeMock = {
    runtime: {
      lastError: void 0,

      onConnect: new MockChromeEvent(),
      onMessage: new MockChromeEvent(),

      connect({ name }) {
        const [clientPort, backgroundPort] = createPortPair(name)

        queueMicrotask(() => {
          if (chromeMock.runtime.onConnect.hasListeners()) {
            backgroundPorts.add(backgroundPort)
            chromeMock.runtime.onConnect.emit(backgroundPort)
          } else {
            // the real API disconnects the port with a lastError set
            clientPort.connected = false
            backgroundPort.connected = false
            chromeMock.runtime.lastError = {
              message:
                'Could not establish connection. Receiving end does not exist.'
            }
            clientPort.onDisconnect.emit(clientPort)
            chromeMock.runtime.lastError = void 0
          }
        })

        return clientPort
      },

      sendMessage(message) {
        queueMicrotask(() => {
          chromeMock.runtime.onMessage.emit(message)
        })
        return Promise.resolve()
      }
    },

    tabs: {
      query: () => Promise.resolve([{ id: 1 }]),

      sendMessage(_tabId, message) {
        queueMicrotask(() => {
          chromeMock.runtime.onMessage.emit(message)
        })
        return Promise.resolve()
      }
    },

    // simulates the browser terminating the background service worker:
    // its listeners vanish and all of its ports get disconnected
    killBackground() {
      chromeMock.runtime.onConnect.clear()
      for (const port of backgroundPorts) {
        port.disconnect()
      }
      backgroundPorts.clear()
    },

    // makes the revive broadcast of a (re)starting background bridge
    // reach no one, so client-initiated recovery can be tested in isolation
    muteReviveBroadcast() {
      chromeMock.runtime.sendMessage = () => Promise.resolve()
      chromeMock.tabs.query = () => Promise.resolve([])
    }
  }

  return chromeMock
}

// the module captures the chrome global at evaluation time,
// so each test gets a freshly imported module with a fresh mock
async function createEnv() {
  vi.resetModules()
  const chromeMock = createChromeMock()
  globalThis.chrome = chromeMock
  const { BexBridge } = await import('./bex-bridge.js')
  return { chromeMock, BexBridge }
}

// flushes pending microtasks plus one macrotask (fire-and-forget flows)
function flush(times = 2) {
  let promise = Promise.resolve()
  for (let i = 0; i < times; i++) {
    promise = promise.then(
      () =>
        new Promise(resolve => {
          setTimeout(resolve, 0)
        })
    )
  }
  return promise
}

describe('BexBridge', () => {
  test('connects and messages flow between all three parts', async () => {
    const { BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })
    const content = new BexBridge({ type: 'content', name: 'my-script' })
    const app = new BexBridge({ type: 'app' })

    background.on('sum', ({ payload }) => payload.a + payload.b)
    content.on('greet', () => 'hi from content')

    await content.connectToBackground()
    await app.connectToBackground()

    expect(background.portList).toContain(content.portName)
    expect(background.portList).toContain('app')

    await expect(
      content.send({ event: 'sum', to: 'background', payload: { a: 1, b: 2 } })
    ).resolves.toBe(3)

    await expect(
      app.send({ event: 'greet', to: content.portName })
    ).resolves.toBe('hi from content')
  })

  test('background restart revives previously connected clients', async () => {
    const { chromeMock, BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })
    const content = new BexBridge({ type: 'content', name: 'my-script' })
    const app = new BexBridge({ type: 'app' })

    await content.connectToBackground()
    await app.connectToBackground()
    expect(background.portList).toHaveLength(2)

    chromeMock.killBackground()
    await flush()

    expect(content.isConnected).toBe(false)
    expect(app.isConnected).toBe(false)

    const revivedBackground = new BexBridge({ type: 'background' })
    await flush(4)

    expect(content.isConnected).toBe(true)
    expect(app.isConnected).toBe(true)
    expect(revivedBackground.portList).toContain(content.portName)
    expect(revivedBackground.portList).toContain('app')
  })

  test('send() transparently reconnects after the background is gone', async () => {
    const { chromeMock, BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })
    const content = new BexBridge({ type: 'content', name: 'my-script' })
    await content.connectToBackground()
    expect(background.portList).toContain(content.portName)

    chromeMock.killBackground()
    await flush()
    expect(content.isConnected).toBe(false)

    chromeMock.muteReviveBroadcast()
    const revivedBackground = new BexBridge({ type: 'background' })
    revivedBackground.on('ping', () => 'pong')
    await flush()
    expect(content.isConnected).toBe(false)

    await expect(
      content.send({ event: 'ping', to: 'background' })
    ).resolves.toBe('pong')
    expect(content.isConnected).toBe(true)
  })

  test('concurrent send() calls share a single reconnection attempt', async () => {
    const { chromeMock, BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })
    const content = new BexBridge({ type: 'content', name: 'my-script' })
    await content.connectToBackground()
    expect(background.portList).toContain(content.portName)

    chromeMock.killBackground()
    await flush()

    chromeMock.muteReviveBroadcast()
    const revivedBackground = new BexBridge({ type: 'background' })
    revivedBackground.on('ping', () => 'pong')
    await flush()

    const connectSpy = vi.spyOn(chromeMock.runtime, 'connect')
    const results = await Promise.all([
      content.send({ event: 'ping', to: 'background' }),
      content.send({ event: 'ping', to: 'background' })
    ])

    expect(results).toEqual(['pong', 'pong'])
    expect(connectSpy).toHaveBeenCalledTimes(1)
  })

  test('send() waits for the target port to register before giving up', async () => {
    const { BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })
    const content = new BexBridge({ type: 'content', name: 'my-script' })
    const app = new BexBridge({ type: 'app' })

    content.on('greet', () => 'hi from content')
    await app.connectToBackground()
    expect(background.portList).not.toContain(content.portName)

    // the content script connects only a bit later...
    setTimeout(() => {
      content.connectToBackground()
    }, 100)

    // ...but sending to it right away still works
    await expect(
      app.send({ event: 'greet', to: content.portName })
    ).resolves.toBe('hi from content')
  })

  test('send() to a never-registering port rejects after the wait', async () => {
    const { BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })

    await expect(
      background.send({ event: 'greet', to: 'content@ghost-1234' })
    ).rejects.toThrow('no such port registered')
  })

  test('explicitly disconnected bridges are not revived', async () => {
    const { chromeMock, BexBridge } = await createEnv()

    const background = new BexBridge({ type: 'background' })
    const content = new BexBridge({ type: 'content', name: 'my-script' })
    await content.connectToBackground()
    expect(background.portList).toContain(content.portName)
    await content.disconnectFromBackground()

    chromeMock.killBackground()
    await flush()

    const revivedBackground = new BexBridge({ type: 'background' })
    await flush(4)

    expect(content.isConnected).toBe(false)
    expect(revivedBackground.portList).not.toContain(content.portName)
    await expect(
      content.send({ event: 'ping', to: 'background' })
    ).rejects.toThrow('the bridge is not connected')
  })

  test('reports a failed connection when no background bridge exists', async () => {
    const { BexBridge } = await createEnv()

    const content = new BexBridge({ type: 'content', name: 'my-script' })

    await expect(content.connectToBackground()).rejects.toBe(
      'Could not connect to the background script.'
    )
    expect(content.isConnected).toBe(false)
  })
})
