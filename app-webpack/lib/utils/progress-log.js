let logLine
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

progressLog.init = function () {
  return logLine !== void 0
    ? Promise.resolve()
    : import('log-update')
      .then(({ createLogUpdate }) => {
        // if it's still the case to create the logLine
        if (logLine === void 0) {
          logLine = createLogUpdate(process.stdout, { showCursor: true })
        }
      })
}

module.exports.progressLog = progressLog
