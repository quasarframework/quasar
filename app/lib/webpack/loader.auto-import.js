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
    .map(name => `import ${name} from '${importTransform(name)}'`)
    .join(`\n`)
}

function extract (content, query) {
  let comp = content.match(compRegex[query])
  let dir = content.match(dirRegex)
  let compImport
  let dirImport

  if (comp !== null) {
    // avoid duplicates
    comp = Array.from(new Set(comp))

    // map comp names only if not pascal-case already
    if (query !== '?pascal') {
      comp = comp.map(name => data.importName[name])
    }

    if (query === '?combined') {
      // could have been transformed QIcon and q-icon too,
      // so avoid duplicates
      comp = Array.from(new Set(comp))
    }

    compImport = transform(comp)
    comp = comp.join(',')
  }
  else {
    comp = ''
  }

  if (dir !== null) {
    dir = Array.from(new Set(dir))
      .map(name => data.importName[name])

    dirImport = transform(dir)
    dir = dir.join(',')
  }
  else {
    dir = ''
  }

  return {
    comp,
    compImport,
    dir,
    dirImport
  }
}

module.exports = function (content) {
  if (!this.resourceQuery && funcCompRegex.test(content) === false) {
    const file = this.fs.readFileSync(this.resource, 'utf-8').toString()
    const { comp, dir, compImport, dirImport } = extract(file, this.query)

    const hasComp = comp !== ''
    const hasDir = dir !== ''

    if (hasComp === true || hasDir === true) {
      const index = this.mode === 'development'
        ? content.indexOf('/* hot reload */')
        : -1

      // stringifyRequest needed so it doesn't
      // messes up consistency of hashes between builds
      const code = `\nimport qInstall from ${stringifyRequest(this, runtimePath)}` +
        (hasComp === true
          ? `\n${compImport}\nqInstall(component, 'components', {${comp}})\n`
          : '') +
        (hasDir === true
          ? `\n${dirImport}\nqInstall(component, 'directives', {${dir}})\n`
          : '')

      return index === -1
        ? content + code
        : content.slice(0, index) + code + content.slice(index)
    }
  }

  return content
}
