import i18n from '../i18n'

// Pluralization l10n http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms
export function declOfNum (n, titles) {
  switch (i18n.name) {
    case 'ach':
    case 'ak':
    case 'am':
    case 'arn':
    case 'br':
    case 'fa':
    case 'fil':
    case 'fr':
    case 'gun':
    case 'ln':
    case 'mfe':
    case 'mg':
    case 'mi':
    case 'oc':
    case 'pt-br':
    case 'tg':
    case 'ti':
    case 'tr':
    case 'uz':
    case 'wa':
      return titles[n > 1 ? 1 : 0] // 2 plurals
    case 'be':
    case 'bs':
    case 'hr':
    case 'me':
    case 'ru':
    case 'sr':
    case 'uk':
      return titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] // 3 plurals
    case 'cs':
    case 'sk':
      return titles[n === 1 ? 0 : (n >= 2 && n <= 4) ? 1 : 2] // 3 plurals
    case 'ga':
      return titles[n === 1 ? 0 : n === 2 ? 1 : (n > 2 && n < 7) ? 2 : (n > 6 && n < 11) ? 3 : 4] // 5 plurals
    case 'lt':
      return titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] // 3 plurals
    case 'lv':
      return titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2] // 3 plurals
    case 'pl':
      return titles[n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] // 3 plurals
    case 'ro':
      return titles[n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2] // 3 plurals
    case 'sl':
      return titles[n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3] // 4 plurals
    default: // en-uk, en-us, de, nl, sv, da, no, nn, nb, fo, es, pt, it, bg, el, fi, et, he, hi, eo, hu...
      return titles[n !== 1 ? 1 : 0] // 2 plurals
  }
}
