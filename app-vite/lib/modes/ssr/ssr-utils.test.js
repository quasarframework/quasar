import { runInThisContext } from 'node:vm'
import { describe, expect, test } from 'vitest'

import { renderStoreState } from './ssr-utils.js'

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
})
