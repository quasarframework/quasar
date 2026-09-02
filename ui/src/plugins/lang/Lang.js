import { createReactivePlugin } from '../../utils/private.create/create.js'

// oxlint-disable-next-line unicorn/prefer-export-from
import defaultLang from '../../../lang/en-US.js'

// Splits a BCP 47 tag (an underscore separator is accepted too) into its
// subtags, cased the way the standard prints them: "sr_cyrl_rs" gives
// [ "sr", "Cyrl", "RS" ].
function splitTag(tag) {
  return tag
    .split(/[-_]/)
    .map((v, i) =>
      i === 0
        ? v.toLowerCase()
        : i > 1 || v.length < 4
          ? v.toUpperCase()
          : v[0].toUpperCase() + v.slice(1).toLowerCase()
    )
}

function getLocale() {
  if (__QUASAR_SSR_SERVER__) return

  const val =
    Array.isArray(navigator.languages) && navigator.languages.length !== 0
      ? navigator.languages[0]
      : navigator.language

  if (typeof val === 'string') {
    return splitTag(val).join('-')
  }
}

// CLDR "likely subtags" for a tag; undefined when the tag is not
// well-formed (a custom pack can be named anything).
function getLikelySubtags(tag) {
  try {
    const { language, script, region } = new Intl.Locale(tag).maximize()
    return { language, script, region }
  } catch {}
}

function getClosestIsoName(locale, isoNames) {
  if (typeof locale !== 'string' || !Array.isArray(isoNames)) return

  const byKey = new Map()
  for (const tag of isoNames) {
    if (typeof tag !== 'string') continue
    const key = tag.toLowerCase().replaceAll('_', '-')
    if (!byKey.has(key)) byKey.set(key, tag)
  }

  if (byKey.size === 0) return

  const subtags = splitTag(locale)

  // RFC 4647 lookup: the full tag, then progressively fewer subtags. The
  // script is dropped before the region is, as it decides what the pack's
  // text looks like (sr-Latn-RS reads sr-Latn, not sr-RS); a tag with
  // both is also tried without its script, so zh-Hant-TW can reach zh-TW.
  const chain = []
  for (let i = subtags.length; i > 1; i--) {
    chain.push(subtags.slice(0, i).join('-'))
  }
  if (subtags.length > 2 && subtags[1].length === 4) {
    const noScript = [subtags[0], ...subtags.slice(2)]
    for (let i = noScript.length; i > 1; i--) {
      chain.push(noScript.slice(0, i).join('-'))
    }
  }
  chain.push(subtags[0])

  for (const tag of chain) {
    const hit = byKey.get(tag.toLowerCase())
    if (hit !== void 0) return hit
  }

  // No prefix matches: infer what the locale leaves implicit ("zh" is
  // zh-Hans-CN, "pt" is pt-Latn-BR) and pick the same-language pack
  // whose own likely subtags agree best; the language's default region
  // breaks ties, then the least specific pack does.
  const target = getLikelySubtags(subtags.join('-'))
  if (target === void 0) return

  const defaultRegion = getLikelySubtags(target.language).region
  let best

  for (const [key, tag] of byKey) {
    const likely = getLikelySubtags(key)
    if (likely === void 0 || likely.language !== target.language) continue

    const score =
      (likely.script === target.script ? 4 : 0) +
      (likely.region === target.region ? 2 : 0) +
      (likely.region === defaultRegion ? 1 : 0)
    const depth = key.split('-').length

    if (
      best === void 0 ||
      score > best.score ||
      (score === best.score && depth < best.depth)
    ) {
      best = { tag, score, depth }
    }
  }

  return best?.tag
}

const Plugin = /*#__PURE__*/ createReactivePlugin(
  {
    __qLang: {}
  },
  {
    // props: object
    // __langConfig: object

    getLocale,
    getClosestIsoName,

    // oxlint-disable-next-line default-param-last
    set(langObject = defaultLang, ssrContext) {
      const lang = {
        ...langObject,
        rtl: langObject.rtl === true,
        getLocale,
        getClosestIsoName
      }

      if (__QUASAR_SSR_SERVER__) {
        if (ssrContext === void 0) {
          console.error(
            'SSR ERROR: second param required: Lang.set(lang, ssrContext)'
          )
          return
        }

        lang.set = ssrContext.$q.lang.set

        if (
          ssrContext.$q.config.lang === void 0 ||
          !ssrContext.$q.config.lang.noHtmlAttrs
        ) {
          const dir = lang.rtl ? 'rtl' : 'ltr'
          const attrs = `lang=${lang.isoName} dir=${dir}`

          ssrContext._meta.htmlAttrs =
            ssrContext.__qPrevLang !== void 0
              ? ssrContext._meta.htmlAttrs.replace(
                  ssrContext.__qPrevLang,
                  attrs
                )
              : attrs

          ssrContext.__qPrevLang = attrs
        }

        ssrContext.$q.lang = lang
      } else {
        lang.set = Plugin.set

        if (
          Plugin.__langConfig === void 0 ||
          !Plugin.__langConfig.noHtmlAttrs
        ) {
          const el = document.documentElement
          el.setAttribute('dir', lang.rtl ? 'rtl' : 'ltr')
          el.setAttribute('lang', lang.isoName)
        }

        Object.assign(Plugin.__qLang, lang)
      }
    },

    install({ $q, lang, ssrContext }) {
      if (__QUASAR_SSR_SERVER__) {
        const initialLang = lang || defaultLang

        $q.lang = {}
        $q.lang.set = langObject => {
          this.set(langObject, ssrContext)
        }

        $q.lang.set(initialLang)

        // one-time SSR/SSG server operation
        if (
          this.props === void 0 ||
          this.props.isoName !== initialLang.isoName
        ) {
          this.props = { ...initialLang }
        }
      } else {
        $q.lang = Plugin.__qLang
        Plugin.__langConfig = $q.config.lang

        if (this.__installed) {
          if (lang !== void 0) this.set(lang)
        } else {
          this.props = new Proxy(this.__qLang, {
            get: Reflect.get,

            ownKeys(target) {
              return Reflect.ownKeys(target).filter(
                key =>
                  key !== 'set' &&
                  key !== 'getLocale' &&
                  key !== 'getClosestIsoName'
              )
            }
          })

          this.set(lang || defaultLang)
        }
      }
    }
  }
)

export default Plugin
export { defaultLang }
