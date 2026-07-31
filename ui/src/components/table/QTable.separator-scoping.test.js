import { afterEach, describe, expect, test } from 'vitest'

// The Quasar stylesheet is loaded into jsdom by testing/vitest.setup.js
// ("import 'quasar/src/css/index.sass'"), so the border widths below are the
// ones that QTable.sass actually produces.

const separatorList = ['horizontal', 'vertical', 'cell', 'none']

// a hand-written table that a user drops into a slot; it carries no Quasar
// class, so it must never pick up the parent's separators
const plainTable =
  '<table>' +
  '<thead><tr><th data-t="slot-th-1"></th><th data-t="slot-th-2"></th></tr></thead>' +
  '<tbody>' +
  '<tr><td data-t="slot-td-1"></td><td data-t="slot-td-2"></td></tr>' +
  '<tr><td></td><td></td></tr>' +
  '</tbody></table>'

// a nested QMarkupTable that asks for its own vertical separators
const nestedMarkupTable =
  '<div class="q-markup-table q-table__container q-table--vertical-separator">' +
  '<table class="q-table"><tbody>' +
  '<tr><td data-t="inner-td-1"></td><td data-t="inner-td-2"></td></tr>' +
  '<tr><td></td><td></td></tr>' +
  '</tbody></table></div>'

function nestedTable(separator) {
  return (
    `<div class="q-table__container q-table--${separator}-separator">` +
    '<div class="q-table__middle"><table class="q-table">' +
    '<thead><tr><th data-t="inner-th-1"></th><th data-t="inner-th-2"></th></tr></thead>' +
    '<tbody>' +
    '<tr><td data-t="inner-td-1"></td><td data-t="inner-td-2"></td></tr>' +
    '<tr><td></td><td></td></tr>' +
    '</tbody></table></div></div>'
  )
}

// QTable renders container > .q-table__middle > table
function createTable(separator, innerHtml = '') {
  return createFixture(
    `<div class="q-table__container q-table--${separator}-separator">` +
      '<div class="q-table__middle"><table class="q-table">' +
      '<thead><tr><th data-t="own-th-1"></th><th data-t="own-th-2"></th></tr></thead>' +
      '<tbody>' +
      '<tr><td data-t="own-td-1"></td><td data-t="own-td-2"></td></tr>' +
      `<tr><td colspan="2">${innerHtml}</td></tr>` +
      '</tbody></table></div></div>'
  )
}

// QMarkupTable renders container > table, without the .q-table__middle wrapper
function createMarkupTable(separator, innerHtml = '') {
  return createFixture(
    '<div class="q-markup-table q-table__container ' +
      `q-table--${separator}-separator"><table class="q-table">` +
      '<thead><tr><th data-t="own-th-1"></th><th data-t="own-th-2"></th></tr></thead>' +
      '<tbody>' +
      '<tr><td data-t="own-td-1"></td><td data-t="own-td-2"></td></tr>' +
      `<tr><td colspan="2">${innerHtml}</td></tr>` +
      '</tbody></table></div>'
  )
}

function createFixture(html) {
  const el = document.createElement('div')
  el.innerHTML = html
  document.body.append(el)

  return {
    // data attributes instead of ids: jsdom resolves "#id" through
    // document.getElementById, which picks the wrong node when a previous
    // fixture is still attached
    border(name, side) {
      const target = el.querySelector(`[data-t="${name}"]`)
      expect(
        target,
        `[data-t="${name}"] is missing from the fixture`
      ).not.toBeNull()
      return getComputedStyle(target)[
        side === 'left' ? 'borderLeftWidth' : 'borderBottomWidth'
      ]
    }
  }
}

// what the component should draw for its own cells
function getOwnExpectation(separator) {
  return {
    thLeft: separator === 'vertical' || separator === 'cell' ? '1px' : '0px',
    // "thead th" for horizontal/cell, "thead tr:last-child th" for vertical
    thBottom: separator === 'none' ? '0px' : '1px',
    tdLeft: separator === 'vertical' || separator === 'cell' ? '1px' : '0px',
    tdBottom: separator === 'horizontal' || separator === 'cell' ? '1px' : '0px'
  }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('[QTable separator scoping]', () => {
  describe('[the separators still reach the component own cells]', () => {
    for (const separator of separatorList) {
      test(`QTable separator="${separator}"`, () => {
        const fixture = createTable(separator)
        const expected = getOwnExpectation(separator)

        expect(fixture.border('own-th-2', 'left')).toBe(expected.thLeft)
        expect(fixture.border('own-th-2', 'bottom')).toBe(expected.thBottom)
        expect(fixture.border('own-td-2', 'left')).toBe(expected.tdLeft)
        expect(fixture.border('own-td-2', 'bottom')).toBe(expected.tdBottom)
        // first column never gets a left border
        expect(fixture.border('own-td-1', 'left')).toBe('0px')
      })

      test(`QMarkupTable separator="${separator}"`, () => {
        const fixture = createMarkupTable(separator)
        const expected = getOwnExpectation(separator)

        expect(fixture.border('own-th-2', 'left')).toBe(expected.thLeft)
        expect(fixture.border('own-th-2', 'bottom')).toBe(expected.thBottom)
        expect(fixture.border('own-td-2', 'left')).toBe(expected.tdLeft)
        expect(fixture.border('own-td-2', 'bottom')).toBe(expected.tdBottom)
        expect(fixture.border('own-td-1', 'left')).toBe('0px')
      })
    }
  })

  describe('[a table in a slot does not inherit the separators]', () => {
    for (const separator of separatorList) {
      test(`QTable separator="${separator}"`, () => {
        const fixture = createTable(separator, plainTable)

        for (const name of ['slot-th-2', 'slot-td-2']) {
          expect(fixture.border(name, 'left')).toBe('0px')
          expect(fixture.border(name, 'bottom')).toBe('0px')
        }
      })

      test(`QMarkupTable separator="${separator}"`, () => {
        const fixture = createMarkupTable(separator, plainTable)

        for (const name of ['slot-th-2', 'slot-td-2']) {
          expect(fixture.border(name, 'left')).toBe('0px')
          expect(fixture.border(name, 'bottom')).toBe('0px')
        }
      })
    }
  })

  describe('[a nested table keeps the separators it asks for]', () => {
    for (const separator of separatorList) {
      test(`QMarkupTable separator="vertical" inside separator="${separator}"`, () => {
        const fixture = createTable(separator, nestedMarkupTable)

        expect(fixture.border('inner-td-2', 'left')).toBe('1px')
        expect(fixture.border('inner-td-2', 'bottom')).toBe('0px')
        expect(fixture.border('inner-td-1', 'left')).toBe('0px')
      })
    }

    test('QTable separator="cell" inside separator="none"', () => {
      const fixture = createTable('none', nestedTable('cell'))

      expect(fixture.border('inner-th-2', 'left')).toBe('1px')
      expect(fixture.border('inner-th-2', 'bottom')).toBe('1px')
      expect(fixture.border('inner-td-2', 'left')).toBe('1px')
      expect(fixture.border('inner-td-2', 'bottom')).toBe('1px')
    })

    test('QTable separator="none" inside separator="cell"', () => {
      const fixture = createTable('cell', nestedTable('none'))

      for (const name of ['inner-th-2', 'inner-td-2']) {
        expect(fixture.border(name, 'left')).toBe('0px')
        expect(fixture.border(name, 'bottom')).toBe('0px')
      }
    })
  })
})
