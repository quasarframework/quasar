import parseArgs from 'minimist'

import { relative, dirname, join } from 'node:path'
import fs from 'node:fs'
import fse from 'fs-extra'

import { log, warn } from '../utils/logger.js'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    f: 'format'
  },
  boolean: ['h'],
  string: ['f']
})

function showHelp(returnCode) {
  console.log(`
  Description
    Quickly scaffold files.

  Usage
    $ quasar new <p|page> [-f <js|ts>] <page_file_name>
    $ quasar new <l|layout> [-f <js|ts>] <layout_file_name>
    $ quasar new <c|component> [-f <js|ts>] <component_file_name>
    $ quasar new <b|boot> [-f <js|ts>] <boot_name>
    $ quasar new <s|store> [-f <js|ts>] <store_module_name>
    $ quasar new ssrmiddleware [-f <js|ts>] <middleware_name>

  Examples
    # Create src/pages/MyNewPage.vue:
    $ quasar new p MyNewPage

    # Create src/pages/MyNewPage.vue and src/pages/OtherPage.vue:
    $ quasar new p MyNewPage OtherPage

    # Create src/layouts/shop/Checkout.vue
    $ quasar new layout shop/Checkout.vue

    # Create src/layouts/shop/Checkout.vue (forcing TypeScript)
    $ quasar new layout -f ts shop/Checkout.vue

    # Create a store with TypeScript (-f ts is optional if tsconfig.json is present)
    $ quasar new store -f ts myStore

  Options
    --help, -h            Displays this message

    --format -f <option>  (optional) Use a supported format for the template.
                          This gets inferred automatically for your project.
                          Possible overriding values:
                             * js - JS template
                             * ts - TS template
  `)
  process.exit(returnCode)
}

function showError(message) {
  console.log()
  warn(message)
  showHelp(1)
}

if (argv.help) {
  showHelp(0)
}

console.log()

if (argv._.length < 2) {
  console.log()
  warn(`Wrong number of parameters (${argv._.length}).`)
  showHelp(1)
  process.exit(1)
}

import { getCtx } from '../utils/get-ctx.js'

const { appPaths, cacheProxy } = getCtx()
const hasTypescript = await cacheProxy.getModule('hasTypescript')

if (!argv.format) {
  argv.format = argv.f = hasTypescript ? 'ts' : 'js'
}

/** @type {string[]} */
const [rawType, ...names] = argv._
/** @type {{ format: 'js'|'ts'}} */
const { format } = argv

const typeAliasMap = {
  p: 'page',
  l: 'layout',
  c: 'component',
  s: 'store',
  b: 'boot'
}

const validAssetTypes = [
  ...Object.entries(typeAliasMap).flat(),
  'ssrmiddleware'
]
if (validAssetTypes.includes(rawType) === false) {
  showError(
    `Invalid asset type: ${rawType} (valid values: ${validAssetTypes.join('|')})`
  )
}

/** @type {'page'|'layout'|'component'|'store'|'boot'|'ssrmiddleware'} */
const type = typeAliasMap[rawType] || rawType

if (['js', 'ts'].includes(format) === false) {
  showError(`Invalid asset format: ${format} (valid values: js|ts)`)
}

function createFile({ targetFile, ext, reference }) {
  const assetRelativePath = relative(appPaths.appDir, targetFile)

  if (fs.existsSync(targetFile)) {
    warn(`${assetRelativePath} already exists.`, 'SKIPPED')
    console.log()
    return
  }

  fse.ensureDir(dirname(targetFile))
  const templatePath = join('templates/app', format, `${type}.${ext}`)

  fse.copy(appPaths.resolve.cli(templatePath), targetFile, err => {
    if (err) {
      console.warn(err)
      warn(`Could not generate ${assetRelativePath}.`, 'FAIL')
      return
    }

    log(`Generated ${type}: ${assetRelativePath}`)
    if (reference) {
      log(`Make sure to reference it in ${reference}`)
    }
    log()
  })
}

async function getAsset(assetType) {
  if (assetType === 'page') {
    return {
      relativePath: 'src/pages',
      ext: 'vue',
      reference: `src/router/routes.${format}`
    }
  }

  if (assetType === 'component') {
    return {
      relativePath: 'src/components',
      ext: 'vue'
    }
  }

  if (assetType === 'boot') {
    return {
      relativePath: 'src/boot',
      ext: format,
      reference: 'quasar.config file > boot'
    }
  }

  if (assetType === 'ssrmiddleware') {
    return {
      relativePath: 'src-ssr/middlewares',
      ext: format,
      reference: 'quasar.config file > ssr > middlewares'
    }
  }

  if (assetType === 'layout') {
    return {
      relativePath: 'src/layouts',
      ext: 'vue',
      reference: `src/router/routes.${format}`
    }
  }

  if (assetType === 'store') {
    const storeProvider = await cacheProxy.getModule('storeProvider')

    const relativePath = `src/${storeProvider.pathKey}`
    const targetFolder = appPaths.resolve.app(relativePath)

    if (!storeProvider.isInstalled) {
      await storeProvider.install()
    }

    if (fs.existsSync(targetFolder) === false) {
      fse.ensureDir(targetFolder)

      try {
        fse.copySync(
          appPaths.resolve.cli(
            `templates/store/${storeProvider.name}/${format}`
          ),
          targetFolder
        )
      } catch (err) {
        console.warn(err)
        warn(`Could not generate ${relativePath}.`, 'FAIL')
        process.exit(1)
      }

      log(`Generated ${relativePath}`)
    }

    return {
      relativePath,
      ext: format
    }
  }
}

async function generate() {
  const { relativePath, ext, reference } = await getAsset(type)
  const fullExt = `.${ext}`

  names.forEach(name => {
    const file = join(
      relativePath,
      name + (name.endsWith(fullExt) ? '' : fullExt)
    )
    const targetFile = appPaths.resolve.app(file)

    createFile({
      targetFile,
      ext,
      reference
    })
  })
}

generate()
