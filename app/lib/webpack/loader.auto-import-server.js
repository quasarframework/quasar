const stringifyRequest = require('loader-utils/lib/stringifyRequest')
const getDevlandFile = require('../helpers/get-devland-file')

const data = getDevlandFile('quasar/dist/babel-transforms/auto-import.json')
const runtimePath = require.resolve('./runtime.auto-import.js')

const compRegex = {
  '?kebab': new RegExp(data.regex.kebabComponents || data.regex.components, 'g'),
  '?pascal': new RegExp(data.regex.pascalComponents || data.regex.components, 'g'),
  '?combined': new RegExp(data.regex.components, 'g')
}

const dirRegex = new RegExp(data.regex.directives, 'g')

function extract (content, ctx) {
  let comp = content.match(compRegex[ctx.query])
  let dir = content.match(dirRegex)

  if (comp === null && dir === null) {
    return
  }

  let importNames = []
  let installStatements = ''

  if (comp !== null) {
    // avoid duplicates
    comp = Array.from(new Set(comp))

    // map comp names only if not pascal-case already
    if (ctx.query !== '?pascal') {
      comp = comp.map(name => data.importName[name])
    }

    if (ctx.query === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // so avoid duplicates
      comp = Array.from(new Set(comp))
    }

    importNames = importNames.concat(comp)
    installStatements += `qInstall(script, 'components', {${comp.join(',')}});`
  }

  if (dir !== null) {
    dir = Array.from(new Set(dir))
      .map(name => data.importName[name])

    importNames = importNames.concat(dir)
    installStatements += `qInstall(script, 'directives', {${dir.join(',')}});`
  }

  // stringifyRequest needed so it doesn't
  // messes up consistency of hashes between builds
  return `
import {${importNames.join(',')}} from 'quasar';
import qInstall from ${stringifyRequest(ctx, runtimePath)};
${installStatements}
`
}

module.exports = function (content, map) {
  let newContent = content

  if (!this.resourceQuery) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const code = extract(file, this)

    if (code !== void 0) {
      newContent += code
    }
  }

  return this.callback(null, newContent, map)
}
