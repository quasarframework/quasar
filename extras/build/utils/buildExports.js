const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

const baseFolder = path.join(__dirname, '../..')

// files and folders to skip
const skips = [
  'build',
  'node_modules',
  'index.js',
  'jsconfig.json',
  'LICENSE',
  'package.json',
  'README.md',
  'yarn.lock',
  'roboto-font',
  'roboto-font-latin-ext'
]

const extensionList = [
  { prop: 'types', ext: '.d.ts' },
  { prop: 'import', ext: '.mjs' },
  { prop: 'require', ext: '.js' }
]

async function readFolders(baseFolder, skips = []) {
  try {
    const files = await fs.promises.readdir(baseFolder)
    const folders = []

    for (const file of files) {
      if (!skips.includes(file) || file.startsWith('.')) {
        const filePath = path.join(baseFolder, file)
        const stats = await fs.promises.stat(filePath)

        if (stats.isDirectory()) {
          folders.push(file)
        }
      }
    }

    return folders
  }
  catch (err) {
    throw new Error('Error reading directory: ' + err)
  }
}

function generateExports(folders) {
  const exports = {
    '.': './index.js'
  }

  for (const folder of folders) {
    // special handling needed for animate folder as it's different from the rest
    if (folder === 'animate') {
      exports['./animate/animate-list.common'] = {
        types: './animate/animate-list.d.ts',
        import: './animate/animate-list.mjs',
        require: './animate/animate-list.common.js'
      }
    }
    else {
      const exportDefinition = extensionList.reduce((acc, { prop, ext }) => {
        const filePath = path.join(baseFolder, folder, `index${ ext }`)
        if (fs.existsSync(filePath)) {
          acc[ prop ] = `./${ folder }/index${ ext }`
        }
        return acc
      }, {})

      if (Object.keys(exportDefinition).length !== 0) {
        exports[ `./${ folder }` ] = exportDefinition
      }
    }
  }

  exports['./*'] = './*'

  return exports
}

async function updatePackageJson(exports) {
  try {
    const packageJsonPath = path.join(baseFolder, 'package.json')
    const packageJson = await fse.readJson(packageJsonPath)
    packageJson.exports = exports
    await fse.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  }
  catch (err) {
    throw new Error('Error updating package.json: ' + err)
  }
}

(async () => {
  try {
    const folders = await readFolders(baseFolder, skips)
    const exports = generateExports(folders)
    await updatePackageJson(exports)
  }
  catch (err) {
    console.error(err)
  }
})()
