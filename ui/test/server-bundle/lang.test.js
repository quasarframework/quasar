import { readdirSync } from 'node:fs'
import { createSSRApp } from 'vue'
import { describe, expect, test } from 'vitest'

// the built server bundle (see install.test.js)
import { Quasar } from 'quasar'
import langEn from 'quasar/lang/en-US.js'

const App = { template: '<div />' }

function install(options) {
  const ssrContext = { req: { headers: {}, url: '/' }, res: {} }
  createSSRApp(App).use(Quasar, options, ssrContext)
  return ssrContext
}

const getHtmlAttrs = lang => install({ lang })._meta.htmlAttrs

// none of these is shaped like a language tag
const wrongIsoNames = [
  'x><script>window.__langXss=true</script><html y=',
  'x onmouseover=alert(1)',
  'x\tdata-injected=yes',
  'en\n',
  'x" onmouseover="alert(1)',
  "x' onmouseover='alert(1)",
  'x/',
  'en=',
  '&quot;',
  "$& $` $' $$",
  '$&',
  'en_US',
  'en-',
  '-en',
  'en--US',
  'abcdefghi',
  '',
  ' ',
  void 0,
  null,
  7,
  {},
  ['en']
]

describe('[Server bundle] language HTML attributes', () => {
  test('emits the language tag and the text direction', () => {
    expect(getHtmlAttrs(void 0)).toBe('dir=ltr lang=en-US')
    expect(getHtmlAttrs({ ...langEn, isoName: 'he', rtl: true })).toBe(
      'dir=rtl lang=he'
    )
    expect(getHtmlAttrs({ ...langEn, isoName: 'zh-Hant-TW' })).toBe(
      'dir=ltr lang=zh-Hant-TW'
    )
    expect(getHtmlAttrs({ ...langEn, isoName: 'es-419' })).toBe(
      'dir=ltr lang=es-419'
    )
  })

  test('emits the language tag of every shipped language pack', async () => {
    const files = readdirSync(new URL('../../lang', import.meta.url)).filter(
      file => file.endsWith('.js')
    )

    expect(files.length).toBeGreaterThan(0)

    for (const file of files) {
      const { default: lang } = await import(`../../lang/${file}`)

      expect(getHtmlAttrs(lang), file).toBe(
        `dir=${lang.rtl === true ? 'rtl' : 'ltr'} lang=${lang.isoName}`
      )
    }
  })

  test.each(wrongIsoNames)(
    'leaves the lang attribute out for the isoName %j',
    isoName => {
      expect(getHtmlAttrs({ ...langEn, isoName })).toBe('dir=ltr')
      expect(getHtmlAttrs({ ...langEn, isoName, rtl: true })).toBe('dir=rtl')
    }
  )

  test.each(wrongIsoNames)(
    'a later set() with the isoName %j replaces the previous attributes only',
    isoName => {
      const ssrContext = install({
        lang: { ...langEn, isoName: 'he', rtl: true }
      })
      // what another plugin may have added meanwhile
      ssrContext._meta.htmlAttrs += ' data-existing="kept"'

      ssrContext.$q.lang.set({ ...langEn, isoName })
      expect(ssrContext._meta.htmlAttrs).toBe('dir=ltr data-existing="kept"')

      ssrContext.$q.lang.set({ ...langEn, isoName, rtl: true })
      expect(ssrContext._meta.htmlAttrs).toBe('dir=rtl data-existing="kept"')

      ssrContext.$q.lang.set({ ...langEn, isoName: 'de-DE' })
      expect(ssrContext._meta.htmlAttrs).toBe(
        'dir=ltr lang=de-DE data-existing="kept"'
      )
    }
  )

  test('emits nothing with config.lang.noHtmlAttrs', () => {
    const ssrContext = install({ config: { lang: { noHtmlAttrs: true } } })

    expect(ssrContext._meta.htmlAttrs).toBe('')

    ssrContext.$q.lang.set({ ...langEn, isoName: 'he', rtl: true })
    expect(ssrContext._meta.htmlAttrs).toBe('')
  })

  test('a wrong isoName still reaches $q.lang as given', () => {
    const ssrContext = install({ lang: { ...langEn, isoName: 'en_US' } })

    expect(ssrContext.$q.lang.isoName).toBe('en_US')
  })
})
