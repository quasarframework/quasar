const portNameRE = /^background$|^app$|^content@/
const { runtime, tabs } =
  import.meta.env.QUASAR_TARGET === 'firefox' ? browser : chrome

/**
 * One-off runtime message broadcast by the background script on each of
 * its (re)starts so that previously connected bridges re-establish their
 * ports. Needed because an MV3 background script gets terminated by the
 * browser when idle, taking all of its ports down with it.
 */
const reviveSignature = '@quasar:bex:revive'

/**
 * How long (in ms) send() waits for a not-yet-registered target port
 * before giving up. Covers the small window in which ports re-register
 * after a background script restart.
 */
const waitForPortTimeout = 1000

/**
 * @param {number} max
 * @returns {number}
 */
function getRandomId(max) {
  return Math.floor(Math.random() * max)
}

/**
 * @typedef Message
 * @property {string} from
 * @property {string} to
 * @property {string} event
 * @property {any} payload
 */

export class BexBridge {
  // Public properties
  /** @type {string} */
  portName = null
  /** @type {boolean} */
  isConnected = false
  /** @type {{ type: 'on' | 'once', callback: (message: Message) => void }[]} */
  listeners = {}
  /** @type {{ [portName: string]: chrome.runtime.Port }} */
  portMap = {}
  /** @type {string[]} */
  portList = []
  /** @type {{ [id: string]: { portName: string, resolve: (payload: any) => void, reject: (err: any) => void } }} */
  messageMap = {}
  /** @type {{ [id: string]: { portName: string, number: number, messageType: string, messageProps: any, payload: any[] } }} */
  chunkMap = {}

  // Private properties
  /** @type {'background' | 'content' | 'app'} */
  #type
  /** @type {boolean} */
  #debug = false
  /** @type {string} */
  #banner
  /** @type {boolean} */
  #wasConnected = false
  /** @type {Promise<void> | null} */
  #connectPromise = null
  /** @type {{ portName: string, resolve: (available: boolean) => void, timer: ReturnType<typeof setTimeout> }[]} */
  #portWaiters = []

  /**
   * @param {{ type: 'background' | 'content' | 'app', name?: string, debug?: boolean }} options
   */
  constructor({ type, name = '', debug }) {
    this.portName = type
    this.#type = type

    if (type === 'content') {
      /**
       * There can be multiple instances of the same content script
       * but for different tabs, so we need to differentiate them.
       *
       * Generating an easy to handle id for the content script.
       */
      this.portName = `${type}@${name}-${getRandomId(10_000)}`
    }

    this.#banner = `[QBex|${this.portName}]`
    this.#debug = debug === true

    if (type !== 'background') {
      this.on('@quasar:ports', ({ payload }) => {
        this.portList = payload.portList
        this.#notifyPortWaiters()
        if (payload.removed !== void 0) {
          this.#cleanupPort(payload.removed)
        }
      })

      /**
       * The background script broadcasts this one-off message on each of
       * its (re)starts; if we were connected to a previous background
       * instance, re-establish the connection with the new one.
       */
      runtime.onMessage.addListener(message => {
        if (
          message === reviveSignature &&
          this.#wasConnected &&
          !this.isConnected
        ) {
          this.connectToBackground().catch(err => {
            this.warn('Failed to reconnect to the background script.', err)
          })
        }
      })

      return
    }

    /**
     * Else we're the background script
     */

    this.isConnected = true
    const onPacket = this.#onPacket.bind(this)

    runtime.onConnect.addListener(port => {
      // if it's not a bridge port on the other end,
      // then ignore it
      if (!portNameRE.test(port.name)) return

      if (this.portMap[port.name] !== void 0) {
        this.warn(
          `Connection with "${port.name}" already exists.` +
            ' Disconnecting the previous one and connecting the new one.'
        )
        this.portMap[port.name].disconnect()
        this.#cleanupPort(port.name)
      }

      this.portMap[port.name] = port

      port.onMessage.addListener(onPacket)
      port.onDisconnect.addListener(() => {
        port.onMessage.removeListener(onPacket)
        this.#cleanupPort(port.name)
        this.log(`Closed connection with ${port.name}.`)
        this.#onPortChange({ removed: port.name })
      })

      this.log(`Opened connection with ${port.name}.`)
      this.#onPortChange({ added: port.name })
    })

    /**
     * If this is a background script restart with clients still out
     * there, ask them to re-establish their ports.
     */
    this.#revivePortClients()
  }

  /**
   * @returns {Promise<void>}
   */
  async connectToBackground() {
    if (this.#type === 'background') {
      // oxlint-disable-next-line no-throw-literal
      throw 'The background script itself does not need to connect'
    }

    if (this.isConnected) {
      // oxlint-disable-next-line no-throw-literal
      throw 'The bridge is already connected'
    }

    // an already in-progress connection attempt is shared
    this.#connectPromise ||= this.#connectToBackground().finally(() => {
      this.#connectPromise = null
    })

    await this.#connectPromise
  }

  /**
   * @returns {Promise<void>}
   */
  async #connectToBackground() {
    const portToBackground = runtime.connect({ name: this.portName })
    const { promise, resolve, reject } = Promise.withResolvers()

    const onPacket = packet => {
      if (!this.isConnected) {
        /**
         * We rely on the fact that upon connection is established
         * the background script will send a @quasar:ports event
         */
        this.isConnected = true
        this.log('Connected to the background script.')
        this.portMap = { background: portToBackground }
        resolve()
      }

      this.#onPacket(packet)
    }

    const onDisconnect = () => {
      if (
        runtime.lastError?.message?.includes('Could not establish connection')
      ) {
        this.isConnected = false
        portToBackground.onMessage.removeListener(onPacket)
        portToBackground.onDisconnect.removeListener(onDisconnect)
        reject('Could not connect to the background script.')
        return
      }

      this.isConnected = false

      for (const id in this.messageMap) {
        const item = this.messageMap[id]
        item.reject('Connection was closed')
      }

      this.portMap = {}
      this.portList = []
      this.messageMap = {}
      this.chunkMap = {}

      this.log('Closed connection with the background script.')
    }

    portToBackground.onMessage.addListener(onPacket)
    portToBackground.onDisconnect.addListener(onDisconnect)

    await promise
    this.#wasConnected = true
  }

  /**
   * @returns {Promise<void>}
   */
  disconnectFromBackground() {
    if (this.#type === 'background') {
      return Promise.reject('Background script does not need to disconnect')
    }

    if (!this.isConnected) {
      return Promise.reject(
        'Tried to disconnect from the background script but the port was not connected'
      )
    }

    this.portMap.background.disconnect()
    delete this.portMap.background
    this.isConnected = false
    // an explicit disconnect also opts out of the auto-reconnect behavior
    this.#wasConnected = false
    return Promise.resolve()
  }

  /**
   * @param {string} event
   * @param {(message: Message) => void} callback
   */
  on(event, callback) {
    if (!event) {
      this.warn('Tried add listener but no event specified.')
      return
    }

    if (typeof callback !== 'function') {
      this.warn('Tried add listener but no valid callback function specified.')
      return
    }

    const target = (this.listeners[event] ||= [])
    target.push({ type: 'on', callback })
    this.log(`Added a listener for event: "${event}".`)
  }

  /**
   * @param {string} event
   * @param {(message: Message) => void} callback
   */
  once(event, callback) {
    if (!event) {
      this.warn('Tried add listener but no event specified.')
      return
    }

    if (typeof callback !== 'function') {
      this.warn('Tried add listener but no valid callback function specified.')
      return
    }

    const target = (this.listeners[event] ||= [])
    target.push({ type: 'once', callback })
    this.log(`Added a one-time listener for event: "${event}".`)
  }

  /**
   * @param {string} event
   * @param {(message: Message) => void} callback
   */
  off(event, callback) {
    if (!event) {
      this.warn('Tried to remove listeners but no event specified.')
      return
    }

    const list = this.listeners[event]

    if (list === void 0) {
      this.warn(
        `Tried to remove listener for "${event}" event but there is no such listener attached.`
      )
      return
    }

    if (callback === void 0) {
      if (event.startsWith('@quasar:')) {
        // ensure we don't remove internal listeners
        this.listeners[event] = [list[0]]
      } else {
        delete this.listeners[event]
      }

      this.log(`Stopped listening for "${event}".`)
      return
    }

    if (typeof callback !== 'function') {
      this.warn(
        'Tried to remove listener but the callback specified is not a function.'
      )
      return
    }

    const liveEvents = list.filter(entry => entry.callback !== callback)

    if (liveEvents.length !== 0) {
      this.listeners[event] = liveEvents
      this.log(`Removed a listener for: "${event}".`)
    } else {
      delete this.listeners[event]
      this.log(`Stopped listening for: "${event}".`)
    }
  }

  /**
   * @param {{ event: string, to: string, payload: any } | undefined} param
   * @returns {Promise<any>} response payload
   */
  async send({ event, to, payload } = {}) {
    if (!this.isConnected) {
      if (!this.#wasConnected) {
        throw new Error(
          'Tried to send message but the bridge is not connected. Please connect it first.'
        )
      }

      /**
       * The connection was lost without an explicit disconnect (in MV3
       * the background script gets terminated when idle, taking all of
       * its ports down with it), so re-establish it transparently.
       * Connecting also wakes up the background script, which in turn
       * asks all of its other previously connected clients to reconnect.
       */
      await this.connectToBackground()
    }

    if (!event) {
      throw new Error('Tried to send message with no "event" prop specified')
    }

    if (!to) {
      throw new Error('Tried to send message with no "to" prop specified')
    }

    if (
      !this.portList.includes(to) &&
      (await this.#waitForPort(to)) === false
    ) {
      throw new Error(
        this.#type === 'background'
          ? `Tried to send message to "${to}" but there is no such port registered`
          : `Tried to send message to "${to}" but the port to background is not available to send through`
      )
    }

    const id = getRandomId(1_000_000)

    await this.#sendMessage({
      id,
      to,
      payload,
      messageType: 'event-send',
      messageProps: { event }
    })

    if (!this.portList.includes(to)) {
      throw new Error(
        `Connection to "${to}" was closed while waiting for a response`
      )
    }

    const { promise, resolve, reject } = Promise.withResolvers()
    this.messageMap[id] = {
      portName: to,
      resolve: responsePayload => {
        delete this.messageMap[id]
        resolve(responsePayload)
      },
      reject: err => {
        delete this.messageMap[id]
        reject(err)
      }
    }

    return promise
  }

  /**
   * @param {boolean} value
   */
  setDebug(value) {
    this.#debug = value === true
  }

  log(...args) {
    if (this.#debug !== true || args.length === 0) return

    const lastArg = args.at(-1)

    if (lastArg !== void 0 && Object(lastArg) === lastArg) {
      const log = `${this.#banner} ${args.slice(0, -1).join(' ')} (click to expand)`
      console.groupCollapsed(log)
      console.dir(lastArg)
      console.groupEnd(log)
    } else {
      console.log(this.#banner, ...args)
    }
  }

  warn(...args) {
    if (args.length === 0) return

    const lastArg = args.at(-1)

    if (lastArg !== void 0 && Object(lastArg) === lastArg) {
      console.warn(this.#banner, ...args.slice(0, -1))
      const group = 'The above warning details (click to expand)'
      console.groupCollapsed(group)
      console.dir(lastArg)
      console.groupEnd(group)
    } else {
      console.warn(this.#banner, ...args)
    }
  }

  /**
   * Should be used only by the background script
   * @param {{ added?: string } | { removed?: string }} reason
   */
  #onPortChange(reason) {
    this.portList = Object.keys(this.portMap)
    this.#notifyPortWaiters()
    const list = ['background', ...this.portList]

    for (const portName of this.portList) {
      this.send({
        event: '@quasar:ports',
        to: portName,
        payload: {
          portList: list.filter(name => name !== portName),
          ...reason
        }
      }).catch(err => {
        this.warn(`Failed to inform "${portName}" about the port list.`, err)
      })
    }
  }

  /**
   * Should be used only by the background script.
   *
   * The clients cannot be reached through ports (none are available on a
   * fresh background script start), so one-off runtime messages are used.
   */
  async #revivePortClients() {
    // reach the app (popup / devtools / options / extension pages)
    runtime.sendMessage(reviveSignature).catch(() => {
      // no app page is listening
    })

    if (tabs === void 0) return

    let tabList

    try {
      tabList = await tabs.query({})
    } catch (err) {
      this.warn(
        'Failed to query the tabs to revive the content script connections.',
        err
      )
      return
    }

    // reach the content scripts
    for (const { id } of tabList) {
      if (id !== void 0) {
        tabs.sendMessage(id, reviveSignature).catch(() => {
          // no content script is listening on this tab
        })
      }
    }
  }

  /**
   * The requested port might be just about to (re)register itself (e.g.
   * the background script was revived and its clients are re-establishing
   * their ports), so wait a short while for it before giving up.
   *
   * @param {string} portName
   * @returns {Promise<boolean>} whether the port became available
   */
  #waitForPort(portName) {
    const { promise, resolve } = Promise.withResolvers()

    const waiter = {
      portName,
      resolve,
      timer: setTimeout(() => {
        this.#portWaiters = this.#portWaiters.filter(entry => entry !== waiter)
        resolve(false)
      }, waitForPortTimeout)
    }

    this.#portWaiters.push(waiter)
    return promise
  }

  #notifyPortWaiters() {
    if (this.#portWaiters.length === 0) return

    const pendingWaiters = []

    for (const waiter of this.#portWaiters) {
      if (this.portList.includes(waiter.portName)) {
        clearTimeout(waiter.timer)
        waiter.resolve(true)
      } else {
        pendingWaiters.push(waiter)
      }
    }

    this.#portWaiters = pendingWaiters
  }

  /**
   * @param {Message} message
   */
  async #triggerMessageEvent(message) {
    const list = this.listeners[message.event]

    if (list === void 0) return

    const plural = list.length > 1 ? 's' : ''
    this.log(
      `Triggering ${list.length} listener${plural} for event: "${message.event}".`,
      {
        message,
        listeners: list
      }
    )

    let responsePayload
    // oxlint-disable-next-line unicorn/no-useless-spread
    for (const { type, callback } of [...list]) {
      if (type === 'once') {
        this.off(message.event, callback)
      }

      try {
        if (responsePayload === void 0) {
          const value = callback(message)
          responsePayload = value instanceof Promise ? await value : value
        } else {
          callback(message)
        }
      } catch (err) {
        this.warn(
          `Error while triggering listener${plural} for event: "${message.event}".`,
          {
            error: err,
            message,
            listener: { type, callback }
          }
        )

        throw err
      }
    }

    return responsePayload
  }

  /**
   * @param {string} portName
   */
  #cleanupPort(portName) {
    for (const id in this.chunkMap) {
      const packet = this.chunkMap[id]
      if (packet.portName === portName) {
        delete this.chunkMap[id]
      }
    }

    for (const id in this.messageMap) {
      const packet = this.messageMap[id]
      if (packet.portName === portName) {
        packet.reject('Connection was closed')
      }
    }

    delete this.portMap[portName]
  }

  #onPacket(packet) {
    /**
     * if it's not a packet sent by this bridge
     * then ignore it
     */
    if (
      Object(packet) !== packet ||
      packet.id === void 0 ||
      packet.from === void 0 ||
      packet.to === void 0 ||
      packet.type === void 0
    ) {
      this.log(
        'Received a message that does not appear to be emitted by a Quasar bridge or is malformed.',
        packet
      )
      return
    }

    this.log(
      `Received message of type "${packet.type}" from "${packet.from}".`,
      packet
    )

    /**
     * if the packet is not addressed to this bridge
     * then forward it to the target
     */
    if (packet.to !== this.portName) {
      this.#sendPacket(packet).catch(err => {
        this.warn(
          `Failed to forward message of type "${packet.type}" from "${packet.from}" to "${packet.to}".`,
          err
        )

        this.#sendMessage({
          id: packet.id,
          to: packet.from,
          messageType: 'event-response',
          messageProps: {
            error: {
              message: err.message,
              stack: err.stack || 'no stack available'
            },
            quiet: true
          }
        })
      })
      return
    }

    if (packet.type === 'full') {
      this.#onMessage({
        id: packet.id,
        from: packet.from,
        to: packet.to,
        payload: packet.payload,
        type: packet.messageType,
        props: packet.messageProps
      })
      return
    }

    if (packet.type === 'chunk') {
      const chunk = this.chunkMap[packet.id]

      if (chunk === void 0) {
        if (packet.chunkIndex !== void 0) {
          this.warn('Received an unregistered chunk.', packet)
          return
        }

        this.chunkMap[packet.id] = {
          portName: packet.from,
          number: packet.chunksNumber,
          messageType: packet.messageType,
          messageProps: packet.messageProps,
          payload: []
        }
        return
      }

      // if we received an unexpected chunk
      if (packet.chunkIndex !== chunk.payload.length) {
        this.warn('Received an out of order chunk.', packet)

        // free up resources
        delete this.chunkMap[packet.id]
        return
      }

      chunk.payload.push(packet.payload)

      // if we received all chunks...
      if (packet.chunkIndex === chunk.number - 1) {
        delete this.chunkMap[packet.id]

        this.#onMessage({
          id: packet.id,
          from: packet.from,
          to: packet.to,
          payload: chunk.payload,
          type: chunk.messageType,
          props: chunk.messageProps
        })
      }

      return
    }

    if (packet.type === 'chunk-abort') {
      delete this.chunkMap[packet.id]
      return
    }

    this.warn(`Received an unknown message type: "${packet.type}".`)
  }

  #sendPacket(packet) {
    this.log(
      packet.from === this.portName
        ? `Sending message of type "${packet.type}" to "${packet.to}".`
        : `Forwarding message of type "${packet.type}" from "${packet.from}" to "${packet.to}".`,
      packet
    )

    const port =
      this.#type === 'background'
        ? this.portMap[packet.to]
        : this.portMap.background

    if (!this.portList.includes(packet.to)) {
      return Promise.reject(
        `Tried to send message of type "${packet.type}" to "${packet.to}" but there is no such port registered`
      )
    }

    if (port === void 0) {
      return Promise.reject(
        this.#type === 'background'
          ? `Tried to send message of type "${packet.type}" to "${packet.to}" but the port is not available`
          : `Tried to send message of type "${packet.type}" to "${packet.to}" but the port to background is not available to forward through`
      )
    }

    try {
      port.postMessage(packet)
    } catch (err) {
      this.warn(`Failed to send message to "${packet.to}".`, err)
      return Promise.reject(err)
    }

    return Promise.resolve()
  }

  /**
   * @param {{ id?: number, to: string, payload: any, messageType: "event-send" | "event-response", messageProps: any }} param
   */
  #sendMessage({
    id = getRandomId(1_000_000),
    to,
    payload,
    messageType,
    messageProps
  }) {
    if (!Array.isArray(payload)) {
      return this.#sendPacket({
        id,
        from: this.portName,
        to,
        type: 'full',
        payload,
        messageType,
        messageProps
      })
    }

    let promise = this.#sendPacket({
      id,
      from: this.portName,
      to,
      type: 'chunk',
      chunksNumber: payload.length,
      messageType,
      messageProps
    })

    for (let i = 0; i < payload.length; i++) {
      promise = promise.then(() =>
        this.#sendPacket({
          id,
          from: this.portName,
          to,
          type: 'chunk',
          payload: payload[i],
          chunkIndex: i
        })
      )
    }

    return promise.catch(err => {
      // oxlint-disable-next-line promise/no-nesting
      this.#sendPacket({
        id,
        from: this.portName,
        to,
        type: 'chunk-abort'
      }).catch(sendPacketErr => {
        this.warn(
          `Failed to send a chunk-abort message to "${to}".`,
          sendPacketErr
        )
      })

      throw err
    })
  }

  #onMessage(message) {
    if (message.type === 'event-response') {
      const target = this.messageMap[message.id]

      if (target === void 0) {
        if (message.props.quiet !== true) {
          this.warn(
            `Received a response for an unknown message id: "${message.id}".`,
            message
          )
        }
        return
      }

      if (message.props.error !== void 0) {
        target.reject(message.props.error)
      } else {
        target.resolve(message.payload)
      }

      return
    }

    if (message.type === 'event-send') {
      this.#triggerMessageEvent({
        from: message.from,
        to: message.to,
        event: message.props.event,
        payload: message.payload
      })
        .then(returnPayload => {
          this.#sendMessage({
            id: message.id,
            to: message.from,
            payload: returnPayload,
            messageType: 'event-response',
            messageProps: {}
          })
        })
        .catch(err => {
          this.#sendMessage({
            id: message.id,
            to: message.from,
            messageType: 'event-response',
            messageProps: {
              error: {
                message: err.message,
                stack: err.stack || 'no stack available'
              }
            }
          })
        })

      return
    }

    this.warn(
      `Received a message with unknown type: "${message.type}".`,
      message
    )
  }
}
