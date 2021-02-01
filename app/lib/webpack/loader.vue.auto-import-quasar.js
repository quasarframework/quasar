const stringifyRequest = require('loader-utils/lib/stringifyRequest')
const getDevlandFile = require('../helpers/get-devland-file')

const autoImportData = getDevlandFile('quasar/dist/transforms/auto-import.json')
const importTransformation = getDevlandFile('quasar/dist/transforms/import-transformation.js')
const runtimePath = require.resolve('./runtime.auto-import.js')

const compRegex = {
  '?kebab': new RegExp(autoImportData.regex.kebabComponents || autoImportData.regex.components, 'g'),
  '?pascal': new RegExp(autoImportData.regex.pascalComponents || autoImportData.regex.components, 'g'),
  '?combined': new RegExp(autoImportData.regex.components, 'g')
}

const dirRegex = new RegExp(autoImportData.regex.directives, 'g')

function transform (itemArray) {
  return itemArray
    .map(name => `import ${name} from '${importTransformation(name)}';`)
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
      comp = comp.map(name => autoImportData.importName[name])
    }

    if (ctx.query === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // so avoid duplicates
      comp = Array.from(new Set(comp))
    }

    importStatements += transform(comp)
    installStatements += `qInstall(script, 'components', {${comp.join(',')}});`
  }

  if (dir !== null) {
    dir = Array.from(new Set(dir))
      .map(name => autoImportData.importName[name])

    importStatements += transform(dir)
    installStatements += `qInstall(script, 'directives', {${dir.join(',')}});`
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

  if (!this.resourceQuery) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const code = extract(file, this)

    if (code !== void 0) {
      const index = this.mode === 'development'
        ? content.indexOf('/* hot reload */')
        : -1

      newContent = index === -1
        ? content + code
        : content.slice(0, index) + code + content.slice(index)

      // TODO vue3 - remove when SSR is ready
      // if (this.resource === '/Users/Razvan/work/test/vue3/src/pages/Index.vue') {
      //   newContent += `\nconsole.log(QToggle)`
      // }
    }
  }

  return this.callback(null, newContent, map)
}
