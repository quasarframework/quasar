const { log, warn } = require('./logger')

module.exports = function openBrowser({ url, opts, wait = true }) {
  const open = require('open')

  const openDefault = () => {
    log('Opening default browser at ' + url + '\n')

    open(url, {
      wait
    }).catch(() => {
      warn(`Failed to open default browser`)
      warn()
    })
  }

  if (opts) {
    log('Opening browser at ' + url + ' with options: ' + JSON.stringify(opts))
    log()
    open(url, {
      ...opts,
      wait
    }).catch(() => {
      warn(`Failed to open specific browser`)
      warn()
      openDefault()
    })
  }
  else {
    openDefault()
  }
}
