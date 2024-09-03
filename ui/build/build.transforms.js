// Partly used with babel-plugin-transform-imports
// and by @quasar/app-* auto-import feature

import path from 'node:path'
import glob from 'fast-glob'

import {
  rootFolder,
  resolveToRoot,
  relativeToRoot,
  writeFile,
  kebabCase,
  filterOutPrivateFiles
} from './build.utils.js'

function relative (name) {
  return relativeToRoot(name).split('\\').join('/')
}

function getWithoutExtension (filename) {
  const insertionPoint = filename.lastIndexOf('.')
  return filename.slice(0, insertionPoint)
}

function lowerCamelCase (name) {
  return name.replace(/-([a-z])/g, g => g[ 1 ].toUpperCase())
}

function addComponents (map, autoImport) {
  glob.sync('src/components/*/Q*.js', { cwd: rootFolder, absolute: true })
    .filter(filterOutPrivateFiles)
    .map(relative)
    .forEach(file => {
      const
        name = getWithoutExtension(path.basename(file)),
        kebab = kebabCase(name)

      map[ name ] = file

      autoImport.kebabComponents.push(kebab)
      autoImport.pascalComponents.push(name)
      autoImport.importName[ name ] = name
      autoImport.importName[ kebab ] = name
    })
}

function addDirectives (map, autoImport) {
  glob.sync('src/directives/*/*.js', { cwd: rootFolder, absolute: true })
    .filter(filterOutPrivateFiles)
    .map(relative)
    .forEach(file => {
      const
        name = getWithoutExtension(path.basename(file)),
        kebab = 'v-' + kebabCase(name)

      map[ name ] = file

      autoImport.directives.push(kebab)
      autoImport.importName[ kebab ] = name
    })
}

function addPlugins (map) {
  glob.sync('src/plugins/*/*.js', { cwd: rootFolder, absolute: true })
    .filter(filterOutPrivateFiles)
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[ name ] = file
    })
}

function addComposables (map) {
  glob.sync('src/composables/*/*.js', { cwd: rootFolder, absolute: true })
    .filter(filterOutPrivateFiles)
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[ lowerCamelCase(name) ] = file
    })
}

function addUtils (map) {
  glob.sync('src/utils/*/*.js', { cwd: rootFolder, absolute: true })
    .filter(filterOutPrivateFiles)
    .map(relative)
    .forEach(file => {
      const name = getWithoutExtension(path.basename(file))
      map[ name === 'open-url' ? 'openURL' : lowerCamelCase(name) ] = file
    })
}

function getAutoImportFile (autoImport, encodeFn) {
  autoImport.kebabComponents.sort((a, b) => (a.length > b.length ? -1 : 1))
  autoImport.pascalComponents.sort((a, b) => (a.length > b.length ? -1 : 1))
  autoImport.components = autoImport.kebabComponents.concat(autoImport.pascalComponents)
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

export function generate ({ compact = false } = {}) {
  const encodeFn = compact === true
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

  writeFile(
    resolveToRoot('dist/transforms/import-map.json'),
    encodeFn(map)
  )

  writeFile(
    resolveToRoot('dist/transforms/auto-import.json'),
    getAutoImportFile(autoImport, encodeFn)
  )
}
