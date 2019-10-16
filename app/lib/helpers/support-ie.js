module.exports = function (userValue, ctx) {
  if (
    ctx.mode.electron ||
    ctx.mode.cordova ||
    ctx.mode.capacitor ||
    ctx.mode.capacitor
  ) {
    return false
  }

  return userValue || false
}
