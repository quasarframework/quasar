const logger = require('./logger'),
  log = logger('app:browser'),
  warn = logger('app:browser', 'red')

module.exports = function openBrowser(url, opts) {
  const open = require('open')

  const openDefault = () => {
    log('Opening default browser at ' + url)
    log()
    open(url, {
      wait: true,
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
      wait: true,
      url: true
    }).catch(() => {
      warn(`⚠️  Failed to open specific browser`)
      warn()
      openDefault()
    })
  } else {
    openDefault()
  }
}
