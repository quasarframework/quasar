const re = /(?!Q[A-Z][A-Za-z]*\.js)Q([A-Z][A-Za-z]*)/g

module.exports.renameComponents = function (componentName) {
  return componentName.replace(re, 'W$1')
}
