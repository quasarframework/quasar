import { runInThisContext } from 'node:vm'
import { describe, expect, test } from 'vitest'

import { createSsrManifest, renderStoreState } from './ssr-utils.js'

function renderedState(ssrContext) {
  const html = renderStoreState(ssrContext)
  const expr = html.match(
    /^<script nonce="n">window\.__INITIAL_STATE__=(.*);document\.currentScript\.remove\(\)<\/script>$/
  )[1]
  // the payload is a JS expression evaluated by the inlined script tag
  return runInThisContext(`(${expr})`)
}

describe('[ssr-utils.js]', () => {
  test('renderStoreState round-trips plain JSON state', () => {
    const state = {
      user: { name: 'John', roles: ['admin'], age: 42, active: true }
    }

    expect(
      renderedState({ state, __quasarNonceAttr: ' nonce="n"' })
    ).toStrictEqual(state)
  })

  test('renderStoreState preserves Map, Set, Date and RegExp', () => {
    const state = {
      map: new Map([['a', 1]]),
      set: new Set([1, 2]),
      date: new Date('2021-11-17T10:43:14Z'),
      regexp: /he(ll)o/gi
    }

    const revived = renderedState({ state, __quasarNonceAttr: ' nonce="n"' })

    expect(revived.map).toBeInstanceOf(Map)
    expect(revived.map.get('a')).toBe(1)
    expect(revived.set).toBeInstanceOf(Set)
    expect(revived.set.has(2)).toBe(true)
    expect(revived.date).toBeInstanceOf(Date)
    expect(revived.date.getTime()).toBe(state.date.getTime())
    expect(revived.regexp).toBeInstanceOf(RegExp)
    expect(revived.regexp.source).toBe(state.regexp.source)
  })

  test('renderStoreState escapes HTML-unsafe characters', () => {
    const state = { xss: '</script><script>alert(1)</script>' }
    const html = renderStoreState({ state, __quasarNonceAttr: '' })

    expect(html).not.toContain('</script><script>')
    expect(
      renderedState({ state, __quasarNonceAttr: ' nonce="n"' })
    ).toStrictEqual(state)
  })

  test('strips the query part of the @vitejs/plugin-vue ids', () => {
    const files = ['/assets/Comp-Ct6b1bpV.js', '/assets/Comp-CLKnUPw2.css']

    expect(
      createSsrManifest({
        viteSsrManifest: {
          'src/components/Comp.vue?vue&type=script&setup=true&lang.ts': files,
          'src/components/Comp.vue?vue&type=style&index=0&lang.scss': files
        },
        viteClientManifest: {}
      })
    ).toEqual({
      'src/components/Comp.vue': files
    })
  })

  test('keeps the first entry when multiple ids collapse into one', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/components/Comp.vue?vue&type=script&setup=true&lang.ts': [
          '/assets/first.js'
        ],
        'src/components/Comp.vue?vue&type=style&index=0&lang.scss': [
          '/assets/second.js'
        ]
      },
      viteClientManifest: {}
    })

    expect(manifest['src/components/Comp.vue']).toEqual(['/assets/first.js'])
  })

  test('completes an entry with the CSS of its statically imported chunks', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index-Ct6b1bpV.js']
      },
      viteClientManifest: {
        'src/pages/index.vue': {
          file: 'assets/index-Ct6b1bpV.js',
          imports: ['src/components/SharedStyle.js']
        },
        'src/components/SharedStyle.js': {
          file: 'assets/SharedStyle-DcmLcqDl.js',
          css: ['assets/SharedStyle-q0g_B9Qx.css']
        }
      }
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index-Ct6b1bpV.js',
      '/assets/SharedStyle-q0g_B9Qx.css'
    ])
  })

  test('follows static imports transitively', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js']
      },
      viteClientManifest: {
        'src/pages/index.vue': {
          file: 'assets/index.js',
          imports: ['src/components/First.js']
        },
        'src/components/First.js': {
          file: 'assets/First.js',
          css: ['assets/First.css'],
          imports: ['src/components/Second.js']
        },
        'src/components/Second.js': {
          file: 'assets/Second.js',
          css: ['assets/Second.css']
        }
      }
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index.js',
      '/assets/Second.css',
      '/assets/First.css'
    ])
  })

  test('orders an imported chunk CSS before the importing chunk own CSS', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        // what Vite lists is the chunk's own CSS only
        'src/pages/second.vue': ['/assets/second.js', '/assets/second.css']
      },
      viteClientManifest: {
        'src/pages/second.vue': {
          file: 'assets/second.js',
          css: ['assets/second.css'],
          imports: ['src/components/Shared.js']
        },
        'src/components/Shared.js': {
          file: 'assets/Shared.js',
          css: ['assets/Shared.css']
        }
      }
    })

    // the same order Vite's own preload helper loads them in, so a
    // server-rendered page cascades like a client-side navigated one
    expect(manifest['src/pages/second.vue']).toEqual([
      '/assets/second.js',
      '/assets/Shared.css',
      '/assets/second.css'
    ])
  })

  test('keeps CSS the chunk graph does not account for', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js', '/assets/orphan.css']
      },
      viteClientManifest: {}
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index.js',
      '/assets/orphan.css'
    ])
  })

  test('leaves out the CSS of dynamically imported chunks', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js']
      },
      viteClientManifest: {
        'src/pages/index.vue': {
          file: 'assets/index.js',
          dynamicImports: ['src/pages/other.vue']
        },
        'src/pages/other.vue': {
          file: 'assets/other.js',
          css: ['assets/other.css']
        }
      }
    })

    expect(manifest['src/pages/index.vue']).toEqual(['/assets/index.js'])
  })

  test('survives circular static imports', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js']
      },
      viteClientManifest: {
        'src/pages/index.vue': {
          file: 'assets/index.js',
          imports: ['src/components/First.js']
        },
        'src/components/First.js': {
          file: 'assets/First.js',
          css: ['assets/First.css'],
          imports: ['src/components/Second.js']
        },
        'src/components/Second.js': {
          file: 'assets/Second.js',
          css: ['assets/Second.css'],
          imports: ['src/components/First.js']
        }
      }
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index.js',
      '/assets/Second.css',
      '/assets/First.css'
    ])
  })

  test('accounts for a non-root publicPath', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/app/assets/index.js']
      },
      viteClientManifest: {
        'src/pages/index.vue': {
          file: 'assets/index.js',
          imports: ['src/components/Shared.js']
        },
        'src/components/Shared.js': {
          file: 'assets/Shared.js',
          css: ['assets/Shared.css']
        }
      },
      publicPath: '/app/'
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/app/assets/index.js',
      '/app/assets/Shared.css'
    ])
  })

  test('does not duplicate CSS that the SSR manifest already lists', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js', '/assets/index.css']
      },
      viteClientManifest: {
        'src/pages/index.vue': {
          file: 'assets/index.js',
          css: ['assets/index.css']
        }
      }
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index.js',
      '/assets/index.css'
    ])
  })

  test('leaves out the CSS that the HTML shell already carries', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js']
      },
      viteClientManifest: {
        'index.html': {
          file: 'assets/entry.js',
          isEntry: true,
          css: ['assets/app.css']
        },
        'src/pages/index.vue': {
          file: 'assets/index.js',
          imports: ['index.html', 'src/components/Shared.js']
        },
        'src/components/Shared.js': {
          file: 'assets/Shared.js',
          css: ['assets/Shared.css']
        }
      }
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index.js',
      '/assets/Shared.css'
    ])
  })

  test('ignores files with no matching chunk', () => {
    const manifest = createSsrManifest({
      viteSsrManifest: {
        'src/pages/index.vue': ['/assets/index.js', '/assets/font.woff2']
      },
      viteClientManifest: {}
    })

    expect(manifest['src/pages/index.vue']).toEqual([
      '/assets/index.js',
      '/assets/font.woff2'
    ])
  })
})
