// Partly used with babel-plugin-transform-imports
// and by @quasar/app-* auto-import feature

import path from 'node:path'
import { readFileSync } from 'node:fs'
import { globSync } from 'tinyglobby'

// single source of truth for the sass variables parsing logic;
// the plugin uses the same parser at runtime as a fallback for
// custom variables files and older Quasar versions
import { parseVariablesFile } from '../../vite-plugin/src/sass-variables-graph.js'

import {
  filterOutPrivateFiles,
  kebabCase,
  relativeToRoot,
  resolveToRoot,
  rootFolder,
  writeFile
} from './build.utils.js'

function relative(name) {
  return relativeToRoot(name).split('\\').join('/')
}

function getWithoutExtension(filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function lowerCamelCase(name) {
  return name.replaceAll(/-([a-z])/g, g => g[1].toUpperCase())
}

function addComponents(map, autoImport) {
  globSync('src/components/*/Q*.js', { cwd: rootFolder, absolute: true })
    .map(relative)
    .filter(filterOutPrivateFiles)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file)),
        kebab = kebabCase(name)

      map[name] = file

      autoImport.kebabComponents.push(kebab)
      autoImport.pascalComponents.push(name)
      autoImport.importName[name] = name
      autoImport.importName[kebab] = name
    })
}

function addDirectives(map, autoImport) {
  globSync('src/directives/*/*.js', { cwd: rootFolder, absolute: true })
    .map(relative)
    .filter(filterOutPrivateFiles)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file)),
        kebab = 'v-' + kebabCase(name)

      map[name] = file

      autoImport.directives.push(kebab)
      autoImport.importName[kebab] = name
    })
}

function addPlugins(map) {
  globSync('src/plugins/*/*.js', { cwd: rootFolder, absolute: true })
    .map(relative)
    .filter(filterOutPrivateFiles)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[name] = file
    })
}

function addComposables(map) {
  globSync('src/composables/*/*.js', { cwd: rootFolder, absolute: true })
    .map(relative)
    .filter(filterOutPrivateFiles)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[lowerCamelCase(name)] = file
    })
}

function addUtils(map) {
  globSync('src/utils/*/*.js', { cwd: rootFolder, absolute: true })
    .map(relative)
    .filter(filterOutPrivateFiles)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[name === 'open-url' ? 'openURL' : lowerCamelCase(name)] = file
    })
}

function getAutoImportFile(autoImport, encodeFn) {
  autoImport.kebabComponents.sort((a, b) => (a.length > b.length ? -1 : 1))
  autoImport.pascalComponents.sort((a, b) => (a.length > b.length ? -1 : 1))
  autoImport.components = [
    ...autoImport.kebabComponents,
    ...autoImport.pascalComponents
  ]
  autoImport.directives.sort((a, b) => (a.length > b.length ? -1 : 1))

  return encodeFn({
    importName: autoImport.importName,
    regex: {
      kebabComponents: '(' + autoImport.kebabComponents.join('|') + ')',
      pascalComponents: '(' + autoImport.pascalComponents.join('|') + ')',
      components: '(' + autoImport.components.join('|') + ')',
      directives: '(' + autoImport.directives.join('|') + ')'
    }
  })
}

export function generate({ compact = false } = {}) {
  const encodeFn = compact
    ? JSON.stringify
    : json => JSON.stringify(json, null, 2)

  const map = {
    Quasar: relative('src/vue-plugin.js')
  }
  const autoImport = {
    kebabComponents: [],
    pascalComponents: [],
    directives: [],
    importName: {}
  }

  addComponents(map, autoImport)
  addDirectives(map, autoImport)
  addPlugins(map)
  addComposables(map)
  addUtils(map)

  writeFile(resolveToRoot('dist/transforms/import-map.json'), encodeFn(map))

  writeFile(
    resolveToRoot('dist/transforms/auto-import.json'),
    getAutoImportFile(autoImport, encodeFn)
  )

  writeFile(
    resolveToRoot('dist/transforms/sass-variables.json'),
    getSassVariablesFile(encodeFn)
  )
}

function getSassVariablesFile(encodeFn) {
  const parsed = parseVariablesFile(
    readFileSync(resolveToRoot('src/css/variables.sass'), 'utf8')
  )

  if (parsed === null) {
    throw new Error(
      'src/css/variables.sass must contain only variable declarations' +
        ' and "@use sass:*" statements (required by the targeted sass' +
        ' variables injection of @quasar/vite-plugin)'
    )
  }

  return encodeFn({
    uses: parsed.uses,
    declarations: parsed.decls
  })
}
