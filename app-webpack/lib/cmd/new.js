const parseArgs = require('minimist')

const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const { log, warn } = require('../helpers/logger')
const appPaths = require('../app-paths')
const storeProvider = require('../helpers/store-provider')
const hasTypescript = require('../helpers/has-typescript')

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    f: 'format'
  },
  boolean: [ 'h' ],
  string: [ 'f' ],
  default: {
    f: hasTypescript ? 'ts-composition' : 'default'
  }
})

function showHelp () {
  console.log(`
  Description
    Quickly scaffold files.

  Usage
    $ quasar new <p|page> [-f <option>] <page_file_name>
    $ quasar new <l|layout> [-f <option>] <layout_file_name>
    $ quasar new <c|component> [-f <option>] <component_file_name>
    $ quasar new <b|boot> [-f ts] <boot_name>
    $ quasar new <s|store> [-f ts] <store_module_name>
    $ quasar new ssrmiddleware [-f ts] <middleware_name>

  Examples
    # Create src/pages/MyNewPage.vue:
    $ quasar new p MyNewPage

    # Create src/pages/MyNewPage.vue and src/pages/OtherPage.vue:
    $ quasar new p MyNewPage OtherPage

    # Create src/layouts/shop/Checkout.vue
    $ quasar new layout shop/Checkout.vue

    # Create src/layouts/shop/Checkout.vue with TypeScript options API
    $ quasar new layout -f ts-options shop/Checkout.vue

    # Create a store with TypeScript (-f ts is optional if tsconfig.json is present)
    $ quasar new store -f ts myStore

  Options
    --help, -h            Displays this message

    --format -f <option>  (optional) Use a supported format for the template
                          Possible values:
                             * default - Default JS template
                             * ts-composition - TS composition API (default if using TS)
                             * ts-composition-setup - TS composition API with <script setup>
                             * ts-options - TS options API
                             * ts-class - [DEPRECATED] TS class style syntax
                             * ts - Plain TS template (for boot, store, and ssrmiddleware files)
  `)
  process.exit(0)
}

function showError (message, param) {
  console.log()
  warn(`${ message }: ${ param }`)
  showHelp()
}

if (argv.help) {
  showHelp()
}

console.log()

if (argv._.length < 2) {
  console.log()
  warn(`Wrong number of parameters (${ argv._.length }).`)
  showHelp()
  process.exit(1)
}

/** @type {string[]} */
const [ rawType, ...names ] = argv._
/** @type {{ format: 'default'|'ts'|'ts-options'|'ts-class'|'ts-composition'|'ts-composition-setup'}} */
let { format } = argv

const typeAliasMap = {
  p: 'page',
  l: 'layout',
  c: 'component',
  s: 'store',
  b: 'boot'
}

if (![ ...Object.entries(typeAliasMap).flat(), 'ssrmiddleware' ].includes(rawType)) {
  showError('Invalid asset type', rawType)
}

/** @type {'page'|'layout'|'component'|'store'|'boot'|'ssrmiddleware'} */
const type = typeAliasMap[ rawType ] || rawType

if (![ 'default', 'ts-options', 'ts-class', 'ts-composition', 'ts-composition-setup', 'ts' ].includes(format)) {
  showError('Invalid asset format', format)
}

const isTypeScript = format === 'ts' || format.startsWith('ts-')

// If using a TS sub-format(e.g. ts-options) and the type is a plain file (e.g. boot) then
// set format to just TS as sub-formats(e.g. Composition API) doesn't matter for plain files.
if (isTypeScript && (type === 'boot' || type === 'store' || type === 'ssrmiddleware')) {
  format = 'ts'
}

function createFile (asset, file) {
  const relativePath = path.relative(appPaths.appDir, file)

  if (fs.existsSync(file)) {
    warn(`${ relativePath } already exists.`, 'SKIPPED')
    console.log()
    return
  }

  fse.ensureDir(path.dirname(file))
  let templatePath = path.join('templates/app', format)

  templatePath = type === 'store'
    ? storeProvider.name === 'pinia'
      ? path.join(templatePath, 'store', 'pinia' + (asset.ext || ''))
      : path.join(templatePath, 'store', storeProvider.name)
    : path.join(templatePath, type + (asset.ext || ''))

  fse.copy(
    appPaths.resolve.cli(templatePath),
    file,
    err => {
      if (err) {
        console.warn(err)
        warn(`Could not generate ${ relativePath }.`, 'FAIL')
        return
      }

      log(`Generated ${ type }: ${ relativePath }`)
      if (asset.reference) {
        log(`Make sure to reference it in ${ asset.reference }`)
      }
      log()
    }
  )
}

const resolveWithExtension = (path) =>
  path + (fs.existsSync(appPaths.resolve.app(path + '.ts')) ? '.ts' : '.js')

const pathList = {
  router: resolveWithExtension('src/router/routes'),
  store: resolveWithExtension(`src/${ storeProvider.pathKey }/index`)
}

const mapping = {
  page: {
    folder: 'src/pages',
    ext: '.vue',
    reference: pathList.router
  },
  layout: {
    folder: 'src/layouts',
    ext: '.vue',
    reference: pathList.router
  },
  component: {
    folder: 'src/components',
    ext: '.vue'
  },
  store: {
    folder: `src/${ storeProvider.pathKey }`,
    install: true,
    // Vuex module template is a folder, Pinia's is a single file
    ext: storeProvider.name === 'vuex' ? '' : isTypeScript ? '.ts' : '.js',
    // Created Vuex modules need to be referenced, but Pinia stores don't.
    reference: storeProvider.name === 'vuex' ? pathList.store : void 0
  },
  boot: {
    folder: 'src/boot',
    ext: isTypeScript ? '.ts' : '.js',
    reference: 'quasar.config.js > boot'
  },
  ssrmiddleware: {
    folder: 'src-ssr/middlewares',
    ext: isTypeScript ? '.ts' : '.js',
    reference: 'quasar.config.js > ssr > middlewares'
  }
}

const asset = mapping[ type ]

if (asset.install) {
  const folder = appPaths.resolve.app(asset.folder)

  if (!storeProvider.isInstalled) {
    storeProvider.install()
  }

  if (!fs.existsSync(folder)) {
    fse.ensureDir(folder)
    fse.copy(
      appPaths.resolve.cli(`templates/store/${ storeProvider.name }/${ format }`),
      folder,
      err => {
        if (err) {
          console.warn(err)
          warn(`Could not generate ${ asset.folder }.`, 'FAIL')
          return
        }

        log(`Generated ${ asset.folder }`)
        log()
      }
    )
  }
}

names.forEach(name => {
  const hasExtension = !asset.ext || (asset.ext && name.endsWith(asset.ext))
  const ext = hasExtension ? '' : asset.ext

  const file = appPaths.resolve.app(path.join(asset.folder, name + ext))

  createFile(asset, file)
})
