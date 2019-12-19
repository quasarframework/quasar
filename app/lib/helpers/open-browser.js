const logger = require('./logger')
const log = logger('app:browser')
const warn = logger('app:browser', 'red')

module.exports = function openBrowser({ url, opts, wait = true }) {
  const open = require('open')

  const openDefault = () => {
    log('Opening default browser at ' + url)
    log()
    open(url, {
      wait,
      url: true
    }).catch(() => {
      warn(`⚠️  Failed to open default browser`)
      warn()
    })
  }

  if (opts) {
    log('Opening browser at ' + url + ' with options: ' + opts)
    log()
    open(url, {
      app: opts,
      wait,
      url: true
    }).catch(() => {
      warn(`⚠️  Failed to open specific browser`)
      warn()
      openDefault()
    })
  }
  else {
    openDefault()
  }
}
