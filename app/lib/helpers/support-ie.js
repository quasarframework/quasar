module.exports = function (userValue, ctx) {
  if (ctx.mode.tauri) {
    return ctx.targetName
      ? ctx.targetName.indexOf('win32') > -1
      : process.platform === 'win32'
  }

  if (ctx.mode.electron || ctx.mode.cordova || ctx.mode.capacitor) {
    return false
  }

  return userValue || false
}

