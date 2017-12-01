import i18n from '../i18n'

// Pluralization l10n http://docs.translatehouse.org/projects/localization-guide/en/latest/l10n/pluralforms.html?id=l10n/pluralforms
export function declOfNum (n, titles) {
  switch (i18n.name) {
    case 'ru':
    case 'ua':
      return titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
    default:
      return titles[n !== 1 ? 1 : 0]
  }
}
