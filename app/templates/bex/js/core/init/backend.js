import Bridge from './bridge'
import attachHooks from '../../backendHooks'

let bridge = null
let listeners = []
const hook = window.__Q_BEX_HOOK__

export function initBackend () {
  buildBridge()

  if (hook.Vue) {
    connect(hook.Vue)
  } else {
    hook.once('init', connect)
  }
}

function buildBridge () {
  bridge = new Bridge({
    listen (fn) {
      const listener = evt => {
        if (evt.data.source === 'q-bex-proxy' && evt.data.payload) {
          fn(evt.data.payload)
        }
      }

      window.addEventListener('message', listener)
      listeners.push(listener)
    },
    send (data) {
      window.postMessage({
        source: 'q-bex-backend',
        payload: data
      }, '*')
    }
  })

  bridge.on('shutdown', () => {
    listeners.forEach(l => {
      window.removeEventListener('message', l)
    })
    listeners = []
  })

  attachHooks(bridge, hook.Vue)
}

function connect (Vue) {
  bridge.log('Backend ready..')
  bridge.send('ready', { v: Vue.version })
}
