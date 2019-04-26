'use strict'

const opts = {
  output: ['json', 'html', 'csv'],
  outputPath: './test/quality/reports',
  disableDeviceEmulation: true,
  disableCpuThrottling: true,
  chromeFlags: ['--show-paint-rects'],
  perf: true,
  view: true
}
module.exports = {
  passes: [{
    recordTrace: true,
    pauseAfterLoadMs: 4000,
    useThrottling: true,
    gatherers: []
  }],
  audits: [
    'first-meaningful-paint',
    'speed-index-metric',
    'estimated-input-latency',
    'first-interactive',
    'consistently-interactive'
  ]
}
