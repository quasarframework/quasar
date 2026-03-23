const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

const baseFolder = path.resolve(__dirname, '../..')

// Files and folders to skip
const skips = new Set([
  'build',
  'index.js',
  'jsconfig.json',
  'LICENSE',
  'node_modules',
  'package.json',
  'pnpm-lock.yaml',
  'README.md',
  'roboto-font',
  'roboto-font-latin-ext',
  'yarn.lock'
])

const extensionList = [
  { prop: 'types', ext: '.d.ts' },
  { prop: 'import', ext: '.mjs' },
  { prop: 'require', ext: '.js' }
]

/**
 * Reads directories in the base folder, skipping specified folders.
 * @param {string} folderPath - The path of the base folder.
 * @param {Set<string>} skipSet - Set of folder names to skip.
 * @returns {Promise<string[]>} - List of folder names.
 */
async function readFolders(folderPath, skipSet) {
  try {
    const entries = await fs.promises.readdir(folderPath, {
      withFileTypes: true
    })
    return entries
      .filter(
        entry =>
          entry.isDirectory() &&
          !skipSet.has(entry.name) &&
          !entry.name.startsWith('.')
      )
      .map(entry => entry.name)
  } catch (err) {
    throw new Error(`Error reading directory: ${err.message}`, { cause: err })
  }
}

/**
 * Generates the exports object for the package.json file.
 * @param {string[]} folders - List of folder names.
 * @returns {object} - Exports configuration.
 */
function generateExports(folders) {
  const exports = {
    '.': './index.js'
  }

  for (const folder of folders) {
    if (folder === 'animate') {
      exports['./animate/animate-list.common'] = {
        types: './animate/animate-list.d.ts',
        import: './animate/animate-list.mjs',
        require: './animate/animate-list.common.js'
      }
    } else {
      const exportDefinition = extensionList.reduce((acc, { prop, ext }) => {
        const filePath = path.join(baseFolder, folder, `index${ext}`)
        if (fs.existsSync(filePath)) {
          acc[prop] = `./${folder}/index${ext}`
        }
        return acc
      }, {})

      if (Object.keys(exportDefinition).length) {
        exports[`./${folder}`] = exportDefinition
      }
    }
  }

  exports['./*'] = './*'

  return exports
}

/**
 * Updates the package.json file with the new exports configuration.
 * @param {object} exports - Exports configuration.
 */
async function updatePackageJson(exports) {
  const packageJsonPath = path.join(baseFolder, 'package.json')

  try {
    const packageJson = await fse.readJson(packageJsonPath)
    packageJson.exports = exports
    await fse.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  } catch (err) {
    throw new Error(`Error updating package.json: ${err.message}`, {
      cause: err
    })
  }
}

// Main execution
;(async () => {
  try {
    const folders = await readFolders(baseFolder, skips)
    const exports = generateExports(folders)
    await updatePackageJson(exports)
    console.log('package.json updated successfully!')
  } catch (err) {
    console.error(err.message)
  }
})()
