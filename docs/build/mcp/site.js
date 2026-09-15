/**
 * The live site, for what a generated page can only point at: the
 * interactive demos, and, in a package slice, every root-relative
 * href or src (`/img/x.svg`, `/layout-builder`, a page the slice does
 * not carry). The site form keeps those root-relative, the `.md`
 * siblings are served next to the pages they came from.
 */

export const SITE_URL = 'https://quasar.dev'

/**
 * A root-relative href, made absolute when the run writes a package
 * slice (`ctx.siteUrl` set). Anything else is returned untouched.
 *
 * @param {string} href
 * @param {{ siteUrl?: string | null }} ctx
 * @returns {string}
 */
export function siteHref(href, ctx) {
  return ctx.siteUrl && href.startsWith('/') && !href.startsWith('//')
    ? `${ctx.siteUrl}${href}`
    : href
}
