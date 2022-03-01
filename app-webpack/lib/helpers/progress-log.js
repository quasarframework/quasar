const logUpdate = require('log-update')
const logLine = logUpdate.create(process.stdout, { showCursor: true })

let lastLog
let consoleLog, consoleWarn, consoleError

function progressLog (str) {
  lastLog = str
  logLine(str)
}

progressLog.isActive = false

progressLog.start = function () {
  if (progressLog.isActive === true) {
    return
  }

  progressLog.isActive = true

  consoleLog = console.log
  consoleWarn = console.warn
  consoleError = console.error

  console.log = function () {
    logLine.clear()
    consoleLog.apply(console, arguments)
    progressLog(lastLog)
  }

  console.warn = function () {
    logLine.clear()
    consoleWarn.apply(console, arguments)
    progressLog(lastLog)
  }

  console.error = function () {
    logLine.clear()
    consoleError.apply(console, arguments)
    progressLog(lastLog)
  }
}

progressLog.stop = function () {
  if (progressLog.isActive === false) {
    return
  }

  progressLog.isActive = false

  logLine.clear()

  console.log = consoleLog
  console.warn = consoleWarn
  console.error = consoleError
}

module.exports = progressLog
