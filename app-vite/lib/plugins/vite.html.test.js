import { mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, describe, expect, test, vi } from 'vitest'

import {
  attachMarkup,
  entryPointMarkup,
  fastExtractPath,
  getDevSsrTemplateFn,
  getProdSsrRenderTemplateFileContent,
  quasarViteIndexHtmlTransformPlugin,
  transformProdHtmlShell,
  updateHtmlVariables
} from './vite.html.js'

// realpath, so results match what path resolution reports
// (macOS symlinks /var to /private/var)
const rootDir = realpathSync(mkdtempSync(join(tmpdir(), 'app-vite-vite-html-')))

afterAll(() => {
  rmSync(rootDir, { recursive: true, force: true })
})

function makeQuasarConf(mode = {}, buildExtra = {}) {
  return {
    ctx: { prod: false, mode },
    htmlVariables: { title: 'Test App' },
    build: {
      define: {},
      publicPath: '/',
      minify: false,
      htmlMinifyOptions: {},
      ...buildExtra
    },
    metaConf: {
      clientEnvDefineList: {},
      backendEnvDefineList: {},
      entryScript: { tag: '<script type="module" src="/main.js"></script>' }
    }
  }
}

describe('[vite.html.js] updateHtmlVariables()', () => {
  test('exposes htmlVariables plus the importMetaEnv proxy', () => {
    const conf = makeQuasarConf()
    conf.build.define = {
      'import.meta.env.FOO': '"from-define"',
      'import.meta.env.NUM': '42'
    }
    conf.metaConf.clientEnvDefineList = {
      'import.meta.env.FOO': '"from-client"',
      'import.meta.env.CLIENT_ONLY': '"client"'
    }
    conf.metaConf.backendEnvDefineList = {
      'import.meta.env.BACKEND': '"backend"'
    }

    const store = updateHtmlVariables(conf)
    const { importMetaEnv } = store.htmlVariables

    expect(store.htmlVariables.title).toBe('Test App')

    // define entries win over env define lists
    expect(importMetaEnv.FOO).toBe('from-define')
    // JSON-quoted values are unquoted, others returned raw
    expect(importMetaEnv.NUM).toBe('42')
    expect(importMetaEnv.CLIENT_ONLY).toBe('client')
    expect(importMetaEnv.BACKEND).toBe('backend')
    expect(importMetaEnv.MISSING).toBeUndefined()
  })
})

describe('[vite.html.js] quasarViteIndexHtmlTransformPlugin()', () => {
  test('injects the attach markup and entry script for non-SSR builds', async () => {
    const conf = makeQuasarConf()
    updateHtmlVariables(conf)

    const plugin = quasarViteIndexHtmlTransformPlugin(conf)
    expect(plugin.name).toBe('quasar:html')
    expect(plugin.enforce).toBe('pre')

    const html = await plugin.transformIndexHtml.handler(
      `<html><head><title><%= title %></title></head><body>${entryPointMarkup}</body></html>`
    )

    expect(html).toContain('<title>Test App</title>')
    expect(html).toContain(
      `${attachMarkup}<script type="module" src="/main.js"></script>`
    )
    expect(html).not.toContain(entryPointMarkup)
  })

  test('keeps the entry point markup for SSR builds', async () => {
    const conf = makeQuasarConf({ ssr: true })
    updateHtmlVariables(conf)

    const plugin = quasarViteIndexHtmlTransformPlugin(conf)
    const html = await plugin.transformIndexHtml.handler(
      `<html><head></head><body>${entryPointMarkup}</body></html>`
    )

    expect(html).toContain(
      `${entryPointMarkup}<script type="module" src="/main.js"></script>`
    )
    expect(html).not.toContain(attachMarkup)
  })

  test('roots relative href/src values when publicPath is set', async () => {
    const conf = makeQuasarConf()
    updateHtmlVariables(conf)

    const plugin = quasarViteIndexHtmlTransformPlugin(conf)
    const html = await plugin.transformIndexHtml.handler(
      '<html><head><link href="icon.png">' +
        '<script src="https://cdn.example.com/x.js"></script>' +
        '</head><body></body></html>'
    )

    expect(html).toContain('href="/icon.png"')
    expect(html).toContain('src="https://cdn.example.com/x.js"')
  })

  test('leaves relative href/src values untouched without publicPath', async () => {
    const conf = makeQuasarConf({}, { publicPath: '' })
    updateHtmlVariables(conf)

    const plugin = quasarViteIndexHtmlTransformPlugin(conf)
    const html = await plugin.transformIndexHtml.handler(
      '<html><head><link href="icon.png"></head><body></body></html>'
    )

    expect(html).toContain('href="icon.png"')
    expect(html).not.toContain('href="/icon.png"')
  })

  test('minifies non-SSR output when build.minify is set', async () => {
    const conf = makeQuasarConf(
      {},
      { minify: true, htmlMinifyOptions: { collapseWhitespace: true } }
    )
    updateHtmlVariables(conf)

    const plugin = quasarViteIndexHtmlTransformPlugin(conf)
    const html = await plugin.transformIndexHtml.handler(
      '<html><head></head><body>  <div>hi</div>  </body></html>'
    )

    expect(html).toContain('<body><div>hi</div></body>')
  })
})

describe('[vite.html.js] transformProdHtmlShell()', () => {
  test('replaces the entry point markup with the attach markup', async () => {
    const html = await transformProdHtmlShell(
      `<html><body>${entryPointMarkup}</body></html>`,
      { build: { minify: false } }
    )

    expect(html).toBe(`<html><body>${attachMarkup}</body></html>`)
  })

  test('minifies when build.minify is set', async () => {
    const html = await transformProdHtmlShell(
      `<html><head></head><body>  ${entryPointMarkup}  </body></html>`,
      {
        build: { minify: true, htmlMinifyOptions: { collapseWhitespace: true } }
      }
    )

    expect(html).toContain(`<body>${attachMarkup}</body>`)
  })
})

describe('[vite.html.js] getDevSsrTemplateFn()', () => {
  test('compiles a template with runtime SSR interpolations', () => {
    const template = [
      '<html lang="en" dir="ltr">',
      '<head><title><%= title %></title></head>',
      '<body class="app-body">',
      `<img src="logo.png">${entryPointMarkup}`,
      '</body>',
      '</html>'
    ].join('\n')

    const fn = getDevSsrTemplateFn(template, { title: 'Dev SSR' })
    expect(fn).toBeTypeOf('function')

    const html = fn({
      _meta: {
        htmlAttrs: 'lang="ro"',
        headTags: '<meta name="x">',
        endingHeadTags: '<style>.s{}</style>',
        bodyClasses: 'body--dark',
        bodyAttrs: 'data-server="true"',
        bodyTags: '<div id="portal"></div>'
      }
    })

    // static html attributes are replaced by the runtime ones
    expect(html).toContain('<html lang="ro">')
    expect(html).not.toContain('lang="en"')
    expect(html).not.toContain('dir="ltr"')

    // compile-time variables are interpolated
    expect(html).toContain('<title>Dev SSR</title>')

    // head runtime injections
    expect(html).toContain('<head><meta name="x">')
    expect(html).toContain('<style>.s{}</style></head>')

    // body class merging + runtime injections
    expect(html).toContain(
      '<body class="body--dark app-body" data-server="true"><div id="portal"></div>'
    )

    // publicPath handling + preserved runtime entry point
    expect(html).toContain('src="/logo.png"')
    expect(html).toContain(entryPointMarkup)
  })

  test('returns an error page renderer for a broken template', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const fn = getDevSsrTemplateFn('<html><body><%= ( %></body></html>', {})
    const html = fn({})

    warnSpy.mockRestore()

    expect(html).toContain('HTML template compilation error')
  })
})

describe('[vite.html.js] getProdSsrRenderTemplateFileContent()', () => {
  test('produces an importable render function file', async () => {
    const content = await getProdSsrRenderTemplateFileContent(
      `<html><head></head><body>${entryPointMarkup}</body></html>`,
      { build: { minify: false } }
    )

    expect(content).toContain('export default')

    const filePath = join(rootDir, 'prod-ssr-template.mjs')
    writeFileSync(filePath, content)

    const mod = await import(pathToFileURL(filePath))
    const html = mod.default({
      _meta: {
        htmlAttrs: '',
        headTags: '',
        endingHeadTags: '',
        bodyClasses: '',
        bodyAttrs: '',
        bodyTags: '',
        runtimePageContent: '<p>rendered</p>'
      }
    })

    expect(html).toContain('<div id="q-app"><p>rendered</p></div>')
  })

  test('minifies while preserving the runtime interpolations', async () => {
    const content = await getProdSsrRenderTemplateFileContent(
      `<html><head></head><body>  ${entryPointMarkup}  </body></html>`,
      {
        build: { minify: true, htmlMinifyOptions: { collapseWhitespace: true } }
      }
    )

    expect(content).toContain('ssrContext._meta.runtimePageContent')
  })
})

describe('[vite.html.js] fastExtractPath()', () => {
  test('extracts the path of absolute http(s) urls', () => {
    expect(fastExtractPath('https://example.com/a/b')).toBe('/a/b')
    expect(fastExtractPath('http://example.com')).toBe('/')
  })

  test('extracts the path of protocol-relative urls', () => {
    expect(fastExtractPath('//cdn.example.com/lib.js')).toBe('/lib.js')
    expect(fastExtractPath('//host')).toBe('/')
  })

  test('strips query and hash', () => {
    expect(fastExtractPath('https://example.com/a/b?x=1#h')).toBe('/a/b')
    expect(fastExtractPath('/path/to?x')).toBe('/path/to')
    expect(fastExtractPath('/p#h?q')).toBe('/p')
  })

  test('roots relative paths', () => {
    expect(fastExtractPath('relative/page#frag')).toBe('/relative/page')
    expect(fastExtractPath('')).toBe('/')
  })

  test('keeps absolute paths as-is', () => {
    expect(fastExtractPath('/already/rooted')).toBe('/already/rooted')
  })
})
