/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 **/

import { EventEmitter } from 'events'
import uid from 'quasar/src/utils/uid'

const
  typeSizes = {
    'undefined': () => 0,
    'boolean': () => 4,
    'number': () => 8,
    'string': item => 2 * item.length,
    'object': item => !item ? 0 : Object
      .keys(item)
      .reduce((total, key) => sizeOf(key) + sizeOf(item[key]) + total, 0)
  },
  sizeOf = value => typeSizes[typeof value](value)

export default class Bridge extends EventEmitter {
  constructor (wall) {
    super()

    this.setMaxListeners(Infinity)
    this.wall = wall

    wall.listen(messages => {
      if (Array.isArray(messages)) {
        messages.forEach(message => this._emit(message))
      }
      else {
        this._emit(messages)
      }
    })

    this._sendingQueue = []
    this._sending = false
    this._maxMessageSize = 32 * 1024 * 1024 // 32mb
  }

  /**
   * Send an event.
   *
   * @param event
   * @param payload
   * @returns Promise<>
   */
  send (event, payload) {
    return this._send([{ event, payload }])
  }

  /**
   * Return all registered events
   * @returns {*}
   */
  getEvents () {
    return this._events
  }

  on(eventName, listener) {
    return super.on(eventName, (originalPayload) => {
      listener({
        ...originalPayload,
        // Convenient alternative to the manual usage of `eventResponseKey`
        // We can't send this in `_nextSend` which will then be sent using `port.postMessage()`, which can't serialize functions.
        // So, we hook into the underlying listener and include the function there, which happens after the send operation.
        respond: (payload /* optional */) => this.send(originalPayload.eventResponseKey, payload)
      })
    })
  }

  _emit (message) {
    if (typeof message === 'string') {
      this.emit(message)
    }
    else {
      this.emit(message.event, message.payload)
    }
  }

  _send (messages) {
    this._sendingQueue.push(messages)
    return this._nextSend()
  }

  _nextSend () {
    if (!this._sendingQueue.length || this._sending) return Promise.resolve()
    this._sending = true

    const
      messages = this._sendingQueue.shift(),
      currentMessage = messages[0],
      eventListenerKey = `${currentMessage.event}.${uid()}`,
      eventResponseKey = eventListenerKey + '.result'

    return new Promise((resolve, reject) => {
      let allChunks = []

      const fn = (r) => {
        // If this is a split message then keep listening for the chunks and build a list to resolve
        if (r !== void 0 && r._chunkSplit) {
          const chunkData = r._chunkSplit
          allChunks = [...allChunks, ...r.data]

          // Last chunk received so resolve the promise.
          if (chunkData.lastChunk) {
            this.off(eventResponseKey, fn)
            resolve(allChunks)
          }
        }
        else {
          this.off(eventResponseKey, fn)
          resolve(r)
        }
      }

      this.on(eventResponseKey, fn)

      try {
        // Add an event response key to the payload we're sending so the message knows which channel to respond on.
        const messagesToSend = messages.map(m => {
          return {
            ...m,
            ...{
              payload: {
                data: m.payload,
                eventResponseKey
              }
            }
          }
        })

        this.wall.send(messagesToSend)
      }
      catch (err) {
        const errorMessage = 'Message length exceeded maximum allowed length.'

        if (err.message === errorMessage) {
          // If the payload is an array and too big then split it into chunks and send to the clients bridge
          // the client bridge will then resolve the promise.
          if (!Array.isArray(currentMessage.payload)) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(errorMessage + ' Note: The bridge can deal with this is if the payload is an Array.')
            }
          }
          else {
            const objectSize = sizeOf(currentMessage)

            if (objectSize > this._maxMessageSize) {
              const
                chunksRequired = Math.ceil(objectSize / this._maxMessageSize),
                arrayItemCount = Math.ceil(currentMessage.payload.length / chunksRequired)

              let data = currentMessage.payload
              for (let i = 0; i < chunksRequired; i++) {
                let take = Math.min(data.length, arrayItemCount)

                this.wall.send([{
                  event: currentMessage.event,
                  payload: {
                    _chunkSplit: {
                      count: chunksRequired,
                      lastChunk: i === chunksRequired - 1
                    },
                    data: data.splice(0, take)
                  }
                }])
              }
            }
          }
        }
      }

      this._sending = false
      setTimeout(() => { return this._nextSend() }, 16)
    })
  }
}
