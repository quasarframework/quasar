import Vue from 'vue'

import { isSSR, client } from './Platform.js'
import { listenOpts, noop, prevent, stopAndPrevent } from '../utils/event.js'
import { getTouchTarget } from '../utils/touch.js'

const props = [
  'isKeyboard',
  'isComposing',

  'isPointer',
  'isMouse',
  'isTouch',
  'isDrag',

  'isContext',

  'isPending',

  'event'
]

function getObject () {
  return props.reduce((acc, type) => {
    acc[type] = type === 'event' ? null : false
    return acc
  }, {})
}

const config = getObject()
const events = [
  ['keydown', { ...config, isKeyboard: true, isComposing: ev => ev.isComposing === true, isPending: true }],
  ['keyup', { ...config, isKeyboard: true, isComposing: void 0, isPending: false }],

  ['mousedown', { ...config, isMouse: true, isPointer: true, isPending: true }],
  ['mouseup', { ...config, isMouse: true, isPointer: true, isPending: false }],

  ['dragstart', { isKeyboard: false, isDrag: true, isPending: true }],
  ['dragend', { isKeyboard: false, isDrag: true, isPending: false }],
  ['dragcancel', { isKeyboard: false, isDrag: true, isPending: false }],
  ['drop', { isKeyboard: false, isDrag: true, isPending: false }],

  ['contextmenu', { isContext: true, isPending: false }]
]

const eventsTouch = [
  ['touchstart', { ...config, isTouch: true, isPointer: true, isPending: true }, true],
  ['touchend', { ...config, isTouch: true, isPointer: true, isPending: false }],
  ['touchcancel', { ...config, isTouch: true, isPointer: true, isPending: false }]
]

const eventsCleanClick = ['mousestart', 'touchstart', 'dragstart']

const eventsTouchEnd = eventsTouch.slice(1)

const { passiveCapture, notPassiveCapture } = listenOpts

const preventClickCleanupHandlers = []

function clickCleanup () {
  const { documentElement } = document
  const fns = preventClickCleanupHandlers.slice()

  preventClickCleanupHandlers.length = 0

  fns.forEach(fn => {
    documentElement.removeEventListener('click', fn, notPassiveCapture)
  })
}

const Interaction = {
  install ($q, queues) {
    if (isSSR === true) {
      queues.server.push((q) => {
        q.interaction = getObject()
        q.interaction.preventClick = noop
      })
      return
    }

    Object.assign(this, getObject())

    const self = this

    props.forEach(prop => {
      Vue.util.defineReactive(self, prop, self[prop])
    })
    Vue.util.defineReactive($q, 'interaction', this)

    const fnFactory = (eventType, props, touchLocal) => {
      const setStateFns = Object.keys(props)
        .filter(key => props[key] !== void 0)
        .map(key => {
          const value = props[key]

          if (typeof value === 'function') {
            return event => {
              self[key] = value(event)
            }
          }

          return () => {
            self[key] = value
          }
        })

      const touchLocalFn = typeof touchLocal === 'function'
        ? touchLocal
        : (
          touchLocal === true
            ? event => {
              const target = getTouchTarget(event.target)

              eventsTouchEnd.forEach(setConfig => {
                const fn = fnFactory(setConfig[0], setConfig[1], () => {
                  eventsTouchEnd.forEach(clearConfig => {
                    target.removeEventListener(clearConfig[0], fn, passiveCapture)
                  })
                })
                target.addEventListener(config[0], fn, passiveCapture)
              })
            }
            : noop
        )

      const clickCleanupFn = eventsCleanClick.includes(eventType) === true
        ? clickCleanup
        : noop

      return event => {
        setStateFns.forEach(fn => {
          fn(event)
        })

        self.event = event

        touchLocalFn(event)

        clickCleanupFn()
      }
    }

    const { documentElement } = document
    events.forEach(config => {
      documentElement.addEventListener(config[0], fnFactory.apply(this, config), passiveCapture)
    })

    if (client.has.touch === true) {
      eventsTouch.forEach(config => {
        documentElement.addEventListener(config[0], fnFactory.apply(this, config), passiveCapture)
      })
    }
  },

  preventClick (target, stop) {
    const { documentElement } = document
    const fn = evt => {
      if (target === evt.target) {
        if (stop === true) {
          stopAndPrevent(evt)
        }
        else {
          prevent(evt)
        }
      }
      clickCleanup()
    }

    documentElement.addEventListener('click', fn, notPassiveCapture)

    preventClickCleanupHandlers.push(fn)
  }
}

export default Interaction
