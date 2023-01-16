const hash = require('hash-sum')

const getPackage = require('../helpers/get-package')

const autoImportData = getPackage('quasar/dist/transforms/auto-import.json')
const importTransformation = getPackage('quasar/dist/transforms/import-transformation.js')
const autoImportRuntimePath = require.resolve('./runtime.auto-import.js')
const injectModuleIdRuntimePath = require.resolve('./runtime.inject-module-id.js')

const compRegex = {
  'kebab': new RegExp(autoImportData.regex.kebabComponents || autoImportData.regex.components, 'g'),
  'pascal': new RegExp(autoImportData.regex.pascalComponents || autoImportData.regex.components, 'g'),
  'combined': new RegExp(autoImportData.regex.components, 'g')
}

const dirRegex = new RegExp(autoImportData.regex.directives, 'g')

function transform (itemArray) {
  return itemArray
    .map(name => `import ${name} from '${importTransformation(name)}';`)
    .join(`\n`)
}

function extract (content, ctx, autoImportCase) {
  let comp = content.match(compRegex[autoImportCase])
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
    if (autoImportCase !== 'pascal') {
      comp = comp.map(name => autoImportData.importName[name])
    }

    if (autoImportCase === 'combined') {
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

  const from = JSON.stringify(ctx.utils.contextify(ctx.context, autoImportRuntimePath))

  // stringifyRequest needed so it doesn't
  // messes up consistency of hashes between builds
  return `
${importStatements}
import qInstall from ${from};
${installStatements}
`
}

function getModuleIdentifierCode (ctx) {
  const id = hash(ctx.request)
  const from = JSON.stringify(ctx.utils.contextify(ctx.context, injectModuleIdRuntimePath))

  return `
import qInject from ${from};
qInject(script, '${id}');
`
}

module.exports = function (content, map) {
  let newContent = content

  if (!this.resourceQuery) {
    const opts = this.getOptions()

    if (opts.isServerBuild === true) {
      newContent = content + getModuleIdentifierCode(this)
    }
    else {
      const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
      const code = extract(file, this, opts.autoImportComponentCase)

      if (code !== void 0) {
        const index = this.mode === 'development'
          ? content.indexOf('/* hot reload */')
          : -1

        newContent = index === -1
          ? content + code
          : content.slice(0, index) + code + content.slice(index)
      }
    }
  }

  return this.callback(null, newContent, map)
}
