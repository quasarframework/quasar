const stringifyRequest = require('loader-utils/lib/stringifyRequest')
const getDevlandFile = require('../helpers/get-devland-file')

const data = getDevlandFile('quasar/dist/babel-transforms/auto-import.json')
const importTransform = getDevlandFile('quasar/dist/babel-transforms/imports.js')
const runtimePath = require.resolve('./runtime.auto-import.js')

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

function transform (itemArray) {
  return itemArray
    .map(name => `import ${name} from '${importTransform(name)}';`)
    .join(`\n`)
}

function extract (content, ctx) {
  let comp = content.match(compRegex[ctx.query])
  let dir = content.match(dirRegex)

  if (comp === null && dir === null) {
    return
  }

  let importStatements = ''
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

    importStatements += transform(comp)
    installStatements += `qInstall(component, 'components', {${comp.join(',')}});`
  }

  if (dir !== null) {
    dir = Array.from(new Set(dir))
      .map(name => data.importName[name])

    importStatements += transform(dir)
    installStatements += `qInstall(component, 'directives', {${dir.join(',')}});`
  }

    // stringifyRequest needed so it doesn't
  // messes up consistency of hashes between builds
  return `
${importStatements}
import qInstall from ${stringifyRequest(ctx, runtimePath)};
${installStatements}
`
}

module.exports = function (content, map) {
  let newContent = content

  if (!this.resourceQuery && funcCompRegex.test(content) === false) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const code = extract(file, this)

    if (code !== void 0) {
      const index = this.mode === 'development'
        ? content.indexOf('/* hot reload */')
        : -1

      newContent = index === -1
        ? content + code
        : content.slice(0, index) + code + content.slice(index)
    }
  }

  return this.callback(null, newContent, map)
}
