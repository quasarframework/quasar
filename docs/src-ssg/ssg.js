import { globSync } from 'tinyglobby'
import { defineSsgGetPages, defineSsgRenderPreloadTag } from '#q-app'

const jsRE = /\.js$/
const cssRE = /\.css$/
const woffRE = /\.woff$/
const woff2RE = /\.woff2$/
const gifRE = /\.gif$/
const jpgRE = /\.jpe?g$/
const pngRE = /\.png$/

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = defineSsgRenderPreloadTag(
  (file /* , { ssrContext } */) => {
    if (jsRE.test(file)) {
      return `<link rel="modulepreload" href="${file}" crossorigin>`
    }

    if (cssRE.test(file)) {
      return `<link rel="stylesheet" href="${file}" crossorigin>`
    }

    if (woffRE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`
    }

    if (woff2RE.test(file)) {
      return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`
    }

    if (gifRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`
    }

    if (jpgRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`
    }

    if (pngRE.test(file)) {
      return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`
    }

    return ''
  }
)

export const getSsgPages = defineSsgGetPages(({ ctx }) => {
  const themeList = ['light', 'dark']

  const themedRouteList = [
    '', // landing page
    ...globSync('**/*.md', { cwd: ctx.appPaths.resolve.app('src/pages') }).map(
      key => {
        const parts = key.slice(0, -3).split('/')
        const len = parts.length
        const _path =
          parts[len - 2] === parts[len - 1] ? parts.slice(0, len - 1) : parts

        return _path.join('/')
      }
    )
  ]

  const lowerCaseRE = /^[a-z]/
  const lightRouteList = [
    'layout-builder',
    ...globSync('*.vue', {
      cwd: ctx.appPaths.resolve.app('src/layouts/gallery')
    })
      .map(entry => entry.slice(0, -4))
      .filter(entry => lowerCaseRE.test(entry))
      .map(entry => 'layout/gallery/' + entry)
  ]

  const acc = []

  for (const theme of themeList) {
    acc.push({
      route: '/get-a-404',
      label: theme,
      dir: '',
      filename: `index-404-${theme}.html`,
      ssrContext: {
        req: {
          headers: {
            cookie: `theme=${theme}`
          }
        }
      }
    })

    for (const _path of themedRouteList) {
      acc.push({
        route: '/' + _path,
        label: theme,
        filename: `index-${theme}.html`,
        ssrContext: {
          req: {
            headers: {
              cookie: `theme=${theme}`
            }
          }
        }
      })
    }
  }

  for (const _path of lightRouteList) {
    acc.push({
      route: '/' + _path,
      label: 'light (only)',
      filename: 'index.html',
      ssrContext: {
        req: {
          headers: {
            cookie: `theme=light`
          }
        }
      }
    })
  }

  return acc
})
