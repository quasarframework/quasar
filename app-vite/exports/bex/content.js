import { BexBridge } from './private/bex-bridge.js'

/**
 * Only run these in development mode and in Chrome.
 * Only Chrome allows the background counterpart initialization
 * to take place in a service worker.
 */
if (process.env.DEV === true && process.env.TARGET === 'chrome') {
  let scriptIsReloading = false

  const scriptName = process.env.__QUASAR_BEX_SCRIPT_NAME__
  const portName = `quasar@hmr/content-script/${scriptName}`
  const banner = `[QBex|HMR] [${scriptName}]`

  const onMessage = message => {
    if (message === 'qbex:hmr:hello') {
      console.log(`${banner} Connected to background`)
      return
    }

    if (message === 'qbex:hmr:reload-content') {
      console.log(`${banner} Reload requested by background...`)
      scriptIsReloading = true

      // reload the page with a small delay,
      // to allow the extension to be also reloaded
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }

  const connect = () => {
    const port = chrome.runtime.connect({ name: portName })

    port.onMessage.addListener(onMessage)
    port.onDisconnect.addListener(() => {
      if (scriptIsReloading === true) return
      port.onMessage.removeListener(onMessage)

      console.log(
        chrome.runtime.lastError?.message?.indexOf(
          'Could not establish connection'
        ) !== -1
          ? `${banner} Could not connect to background`
          : `${banner} Lost connection to background`
      )

      setTimeout(connect, 1000)
    })
  }

  connect()
}

let scriptHasBridge = false

export function createBridge({ debug } = {}) {
  if (scriptHasBridge === true) {
    console.error('Content script Quasar Bridge has already been created.')
    return
  }

  scriptHasBridge = true
  return new BexBridge({
    type: 'content',
    name: process.env.__QUASAR_BEX_SCRIPT_NAME__,
    debug
  })
}
