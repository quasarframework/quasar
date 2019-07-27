import Bridge from './bridge'
import attachHooks from '../../backendHooks'

let bridge = null
let listeners = []

export function initBackend () {
  const hook = window.__Q_BEX_HOOK__
  buildBridge(hook)
  connect(hook)
}

function buildBridge (hook) {
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

function connect (hook) {
  bridge.log('Backend ready..')
  bridge.send('ready', { v: hook.Vue.version })
}
