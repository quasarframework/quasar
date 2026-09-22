import { describe, expect, test } from 'vitest'

import { filterArgvParams } from './filter-argv-params.js'

describe('filterArgvParams', () => {
  test('drops the aliases, the help flag and the color switch', () => {
    expect(
      filterArgvParams({
        i: 'a.png',
        icon: 'a.png',
        h: true,
        help: true,
        noColor: true,
        quality: '5',
        _: []
      })
    ).toEqual({ icon: 'a.png', quality: '5' })
  })

  test('camel cases kebab keys', () => {
    expect(
      filterArgvParams({
        'theme-color': 'abc',
        'splashscreen-dark-color': '000'
      })
    ).toEqual({ themeColor: 'abc', splashscreenDarkColor: '000' })
  })
})
