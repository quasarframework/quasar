module.exports = function (content) {
  console.log(this.resource)
  return content.indexOf('$') !== -1
    ? `@import '~src/css/quasar.variables.styl'\n@import '~quasar/src/css/variables.styl'\n` +
      content
    : content
}
