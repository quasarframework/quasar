import { join } from 'node:path'
import axios from 'axios'
import fse from 'fs-extra'
import fg from 'fast-glob'

axios.defaults.withCredentials = true

const rootFolder = new URL('..', import.meta.url).pathname
const baseUrl = 'http://localhost:3111'
const clientDir = join(rootFolder, 'dist/quasar.dev/client')
const themeList = [ 'light', 'dark' ]

const mdPagesDir = join(rootFolder, 'src/pages')
const mdPagesLen = mdPagesDir.length + 1
const themedRouteList = [
  '', // landing page
  ...(
    fg.sync(join(mdPagesDir, '**/*.md')).map(key => {
      const parts = key.substring(mdPagesLen, key.length - 3).split('/')
      const len = parts.length
      const _path = parts[ len - 2 ] === parts[ len - 1 ]
        ? parts.slice(0, len - 1)
        : parts

      return _path.join('/')
    })
  )
]

const layoutGalleryDir = join(rootFolder, 'src/layouts/gallery')
const layoutGalleryLen = layoutGalleryDir.length + 1
const lowerCaseRE = /^[a-z]/
const lightRouteList = [
  'layout-builder',
  ...(
    fg.sync(join(layoutGalleryDir, '*.vue'))
      .map(entry => entry.substring(layoutGalleryLen, entry.length - 4))
      .filter(entry => lowerCaseRE.test(entry))
      .map(entry => 'layout/gallery/' + entry)
  )
]

async function generate () {
  // start server
  await import('../dist/quasar.dev/index.js')

  for (const theme of themeList) {
    await axios.get(baseUrl + '/get-a-404', {
      headers: { Cookie: `theme=${ theme }` }
    }).catch(error => {
      console.error('[ Quasar SSG ] Failed to render 404 page for theme:', theme)
      console.error(error)
      process.exit(1)
    }).then(res => {
      const file = join(clientDir, `index-404-${ theme }.html`)
      fse.ensureFileSync(file)
      fse.writeFileSync(file, res.data, 'utf8')
      console.log(`[ Quasar SSG ] [ ${ theme } ] Rendered 404 page`)
    })

    for (const _path of themedRouteList) {
      await axios.get(baseUrl + '/' + _path, {
        headers: { Cookie: `theme=${ theme }` }
      }).catch(error => {
        console.error('[ Quasar SSG ] Failed to render:', { theme, path: _path })
        error && console.error(error)
        process.exit(1)
      }).then(res => {
        const file = join(clientDir, _path, `index-${ theme }.html`)
        fse.ensureFileSync(file)
        fse.writeFileSync(file, res.data, 'utf8')
        console.log(`[ Quasar SSG ] [ ${ theme } ] Rendered: ${ _path }`)
      })
    }
  }

  for (const _path of lightRouteList) {
    await axios.get(baseUrl + '/' + _path).catch(error => {
      console.error('[ Quasar SSG ] Failed to render path:', _path)
      error && console.error(error)
      process.exit(1)
    }).then(res => {
      const file = join(clientDir, _path, 'index.html')
      fse.ensureFileSync(file)
      fse.writeFileSync(file, res.data, 'utf8')
      console.log(`[ Quasar SSG ] [ light (only) ] Rendered: ${ _path }`)
    })
  }

  process.exit(0)
}

generate()
