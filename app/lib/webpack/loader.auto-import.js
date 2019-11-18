const getDevlandFile = require('../helpers/get-devland-file')

const data = getDevlandFile('quasar/dist/babel-transforms/auto-import.json')

const compRegex = {
  '?kebab': new RegExp(data.regex.kebabComponents || data.regex.components, 'g'),
  '?pascal': new RegExp(data.regex.pascalComponents || data.regex.components, 'g'),
  '?combined': new RegExp(data.regex.components, 'g')
}

// regex to match functional components
const funcCompRegex = new RegExp(
  'var\\s+component\\s*=\\s*normalizer\\((?:[^,]+,){3}\\s*true,'
)

const dirRegex = new RegExp(data.regex.directives, 'g')

function extract (content, form) {
  let comp = content.match(compRegex[form])
  const directives = content.match(dirRegex)

  if (comp !== null) {
    // avoid duplicates
    comp = Array.from(new Set(comp))

    // map comp names only if not pascal-case already
    if (form !== '?pascal') {
      comp = comp.map(name => data.importName[name])
    }

    if (form === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // so avoid duplicates
      comp = Array.from(new Set(comp))
    }

    comp = comp.join(',')
  }
  else {
    comp = ''
  }

  return {
    comp,

    dir: directives !== null
      ? Array.from(new Set(directives))
        .map(name => data.importName[name])
        .join(',')
      : ''
  }
}

module.exports = function (content) {
  if (!this.resourceQuery && funcCompRegex.test(content) === false) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const { comp, dir } = extract(file, this.query)

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
