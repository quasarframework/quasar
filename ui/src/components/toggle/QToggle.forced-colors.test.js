import { describe, expect, test } from 'vitest'

import 'quasar/src/css/index.sass'

const checkedSelector = '.q-toggle__inner--truthy .q-toggle__track'
const specificity = selector => (selector.match(/\.[\w-]+/g) || []).length
const topRules = () =>
  [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])

function forcedColors(selectorRE) {
  const rules = topRules()
  const index = rules.findIndex(
    rule =>
      rule.media !== void 0 &&
      /forced-colors/.test(rule.media.mediaText) === true &&
      [...rule.cssRules].some(
        inner => selectorRE.test(inner.selectorText) === true
      )
  )

  return index === -1
    ? null
    : {
        index,
        rule: [...rules[index].cssRules].find(
          inner => selectorRE.test(inner.selectorText) === true
        )
      }
}

describe('[QToggle forced-colors]', () => {
  test('outlines the track and the thumb', () => {
    const track = forcedColors(/\.q-toggle__track$/)
    const thumb = forcedColors(/\.q-toggle__thumb:after$/)

    expect(track).not.toBeNull()
    expect(thumb).not.toBeNull()
    expect(track.rule.style.border).toBe('1px solid')
    expect(thumb.rule.style.border).toBe('1px solid')
  })

  test('restores full track opacity over the checked-state override', () => {
    const track = forcedColors(/\.q-toggle__track$/)

    expect(track.rule.style.opacity).toBe('1')
    expect(specificity(track.rule.selectorText)).toBeGreaterThanOrEqual(
      specificity(checkedSelector)
    )
    expect(track.index).toBeGreaterThan(
      topRules().findIndex(rule => rule.selectorText === checkedSelector)
    )
  })
})
