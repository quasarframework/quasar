const exclusions = [ 'QPage' ]
const re = new RegExp(`(?!Q[A-Z][A-Za-z]*\\.js|${exclusions.map(x => `\\b${x}\\b`).join('|')})Q([A-Z][A-Za-z]*)`, 'g')

module.exports.renameComponents = function (componentName) {
  return componentName.replace(re, 'W$1')
}
