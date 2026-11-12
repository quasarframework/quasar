import { createSSRApp } from 'vue'
import { describe, expect, test } from 'vitest'

// the built server bundle (see install.test.js)
import { Quasar } from 'quasar'

const App = { template: '<div />' }

function getEndingHeadTags(config) {
  const ssrContext = { req: { headers: {}, url: '/' }, res: {} }
  createSSRApp(App).use(Quasar, { config }, ssrContext)
  return ssrContext._meta.endingHeadTags
}

const getStyleTag = brand =>
  `<style>:root{${Object.keys(brand)
    .map(key => `--q-${key}:${brand[key]}`)
    .join(';')}}</style>`

describe('[Server bundle] brand style tag', () => {
  test('emits every brand color as a CSS variable', () => {
    const brand = { primary: '#123456', 'my-color': 'rgb(1 2 3)' }

    expect(getEndingHeadTags({ brand })).toBe(getStyleTag(brand))
  })

  test('emits nothing without a brand, even after a brand was rendered', () => {
    expect(getEndingHeadTags({ brand: { primary: '#abcdef' } })).not.toBe('')

    expect(getEndingHeadTags({})).toBe('')
    expect(getEndingHeadTags(void 0)).toBe('')
  })

  test('emits the tag once per request for a shared brand object', () => {
    const config = { brand: { primary: '#111111' } }
    const expected = getStyleTag(config.brand)

    for (let i = 0; i < 3; i++) {
      expect(getEndingHeadTags(config)).toBe(expected)
    }
  })

  test('each request renders the brand it was given', () => {
    const first = { primary: '#111111' }
    const second = { primary: '#222222' }

    expect(getEndingHeadTags({ brand: first })).toBe(getStyleTag(first))
    expect(getEndingHeadTags({ brand: second })).toBe(getStyleTag(second))
    expect(getEndingHeadTags({ brand: first })).toBe(getStyleTag(first))
  })

  describe.each([
    ['closes the rule', 'red}body{display:none'],
    ['adds a declaration', 'red;background:url(//example.com/x)'],
    ['opens a block', 'red{'],
    ['closes the rule with nothing after', 'red}'],
    ['ends in a second semicolon', 'red;'],
    [
      'closes the style element',
      'red</style><script>window.__brandXss=true</script>'
    ],
    [
      'closes the style element, mixed case',
      'red</StYlE \t\n><script>window.__brandXss=true</script>'
    ],
    [
      'closes the style element, self-closing form',
      'red</style/><script>window.__brandXss=true</script>'
    ],
    ['opens a tag', 'red<']
  ])('content that %s', (_, payload) => {
    const safe = { primary: '#123456', secondary: 'rgb(1 2 3 / 50%)' }
    const expected = getStyleTag(safe)

    test('in a brand value drops that color only', () => {
      expect(
        getEndingHeadTags({
          brand: {
            primary: safe.primary,
            accent: payload,
            secondary: safe.secondary
          }
        })
      ).toBe(expected)
    })

    test('in a brand name drops that color only', () => {
      expect(
        getEndingHeadTags({
          brand: {
            primary: safe.primary,
            [payload]: 'red',
            secondary: safe.secondary
          }
        })
      ).toBe(expected)
    })
  })

  test('keeps the CSS color syntaxes, none of which needs <{};', () => {
    const brand = {
      primary: 'color-mix(in srgb, #1976d2 50%, white)',
      secondary: 'light-dark(#fff, #000)',
      accent: 'var(--my-accent, oklch(70% 0.1 200 / 0.5))',
      dark: 'RED'
    }

    expect(getEndingHeadTags({ brand })).toBe(getStyleTag(brand))
  })

  test('renders an empty rule when every color is dropped', () => {
    expect(getEndingHeadTags({ brand: { primary: 'red}' } })).toBe(
      '<style>:root{}</style>'
    )
  })
})
