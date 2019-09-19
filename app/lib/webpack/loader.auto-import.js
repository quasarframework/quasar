const getDevlandFile = require('../helpers/get-devland-file')

const data = getDevlandFile('quasar/dist/babel-transforms/auto-import.json')

const compRegex = new RegExp(data.regex.components, 'g')
const dirRegex = new RegExp(data.regex.directives, 'g')

function extract (content) {
  const components = content.match(compRegex)
  const directives = content.match(dirRegex)

  return {
    comp: components !== null
      ? Array.from(new Set(components))
        .map(name => data.importName[name])
        .join(',')
      : '',

    dir: directives !== null
      ? Array.from(new Set(directives))
        .map(name => data.importName[name])
        .join(',')
      : ''
  }
}

module.exports = function (content) {
  if (!this.resourceQuery) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const { comp, dir } = extract(file)

    const hasComp = comp !== ''
    const hasDir = dir !== ''

    if (hasComp === true || hasDir === true) {
      const index = this.mode === 'development'
        ? content.indexOf('/* hot reload */')
        : -1

      const code = `\nimport {${comp}${hasComp === true && hasDir === true ? ',' : ''}${dir}} from 'quasar'\n` +
        (hasComp === true
          ? `component.options.components = Object.assign({${comp}}, component.options.components || {})\n`
          : '') +
        (hasDir === true
          ? `component.options.directives = Object.assign({${dir}}, component.options.directives || {})\n`
          : '')

      return index === -1
        ? content + code
        : content.slice(0, index) + code + content.slice(index)
    }
  }

  return content
}
