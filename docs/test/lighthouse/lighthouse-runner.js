const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
// const perfConfig = require('lighthouse/lighthouse-core/config/perf-config.js')

module.exports = {}
let Performance = exports.Performance = {
  // https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
  launchChromeAndRunLighthouse: function (url, opts, config = null) {
    return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
      opts.port = chrome.port
      return lighthouse(url, opts, config).then(results => {
        // The gathered artifacts are typically removed as they can be quite large (~50MB+)
        delete results.artifacts
        return chrome.kill().then(() => results)
      })
    })
  }
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = Performance
  }
  exports.Performance = Performance
}
