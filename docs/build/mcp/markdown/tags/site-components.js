/**
 * The site's own Vue components inside pages (`<TransitionList />`,
 * `<UmdTags />`, `<ViewProp />`...). The ones that show data write
 * that data out, from the same modules the components render from,
 * so a page reads complete without the site; the purely interactive
 * ones (pickers, playgrounds, galleries) become a pointer at the live
 * page. Handlers cover both token contexts: the components stand on
 * their own line, but a wrapper can put one inline.
 */

import { readFileSync } from 'node:fs'

import { SITE_URL } from '../../site.js'
import { sourceToMenuKey } from '../../pages/routes.js'
import { transitionNames } from '../../../../src/pages/options/transitions/transition-names.js'
import {
  brandColors,
  paletteColors,
  paletteShades
} from '../../../../src/pages/style/color-palette/colors.js'
import {
  headings,
  weights
} from '../../../../src/pages/style/typography/typography-classes.js'
import {
  buildUmdHtml,
  defaultOptions as umdDefaults
} from '../../../../src/pages/start/umd/umd-tags.js'
import {
  buildMainJs,
  buildViteConfigJs,
  sassVariablesFile,
  defaultOptions as viteDefaults
} from '../../../../src/pages/start/vite-plugin/vite-plugin-usage.js'

/** @typedef {import('../walker.js').EmitCtx} EmitCtx */
/** @typedef {import('../walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @param {EmitCtx} ctx
 * @returns {string} The page being extracted, on the live site.
 */
function liveUrl(ctx) {
  const pagePath = ctx?.sourcePath ? `/${sourceToMenuKey(ctx.sourcePath)}` : ''
  return `${SITE_URL}${pagePath}`
}

/**
 * @param {string} what
 * @param {EmitCtx} ctx
 * @returns {string}
 */
function livePage(what, ctx) {
  return `> Visit the [live documentation](${liveUrl(ctx)}) for the interactive ${what}.\n\n`
}

/**
 * @param {string[]} names
 * @returns {string}
 */
function codeList(names) {
  return names.map(name => `- \`${name}\``).join('\n') + '\n\n'
}

/**
 * @param {string} lang
 * @param {string} code
 * @returns {string}
 */
function fence(lang, code) {
  return `\`\`\`${lang}\n${code.trim()}\n\`\`\`\n\n`
}

/**
 * The QLayout `view` matrix as ViewProp.vue draws it: each cell names
 * the letters that can claim it (uppercase makes it fixed).
 */
const VIEW_PROP_GRID = `| | left | center | right |
| --- | --- | --- | --- |
| header | l/h | h/H | r/h |
| middle | l/L | p | r/R |
| footer | l/f | f/F | r/f |

`

/**
 * @param {{ quasarVersion: string, sassVariablesPath: string }} opts The ui
 *   version the UMD tags pin, and the ui `variables.sass` the Sass page
 *   lists.
 * @returns {Record<string, { block: (token: MarkdownItToken, ctx: EmitCtx) => string, inline: (token: MarkdownItToken, ctx: EmitCtx) => string }>}
 */
export function siteComponentHandlers({ quasarVersion, sassVariablesPath }) {
  let sassVariables = null

  /** @type {Record<string, (ctx: EmitCtx) => string>} */
  const renderers = {
    TransitionList: () =>
      `The transitions, by the name the props take (the CSS classes are \`q-transition--<name>\`):\n\n${codeList(transitionNames)}`,

    BrandColors: () => codeList(brandColors),

    ColorList: () =>
      `Each color comes as \`<color>\` plus ${paletteShades} shades, \`<color>-1\` (lightest) to \`<color>-${paletteShades}\` (darkest):\n\n${codeList(paletteColors)}`,

    SassVariables: () => {
      sassVariables ??= readFileSync(sassVariablesPath, 'utf8')
      return fence('sass', sassVariables)
    },

    TypographyHeadings: () =>
      '| Class | HTML equivalent | Sample |\n| --- | --- | --- |\n' +
      headings
        .map(
          ({ cls, equivalent, label }) =>
            `| \`${cls}\` | ${equivalent ? `\`${equivalent}\`` : ''} | ${label} |`
        )
        .join('\n') +
      '\n\n',

    TypographyWeights: () =>
      codeList(weights.map(weight => `text-weight-${weight}`)),

    ViewProp: () => VIEW_PROP_GRID,

    UmdTags: ctx =>
      `With the default pick (Roboto font, Material Icons, minified files, the English language pack and the Material Icons icon set), other picks on the [live page](${liveUrl(ctx)}):\n\n` +
      fence('html', buildUmdHtml({ ...umdDefaults, version: quasarVersion })),

    VitePluginUsage: ctx =>
      `With the default pick (Material Icons, Sass/SCSS variables on, kebab-case auto-import), other picks on the [live page](${liveUrl(ctx)}):\n\n` +
      fence('js', buildMainJs(viteDefaults)) +
      fence('js', buildViteConfigJs(viteDefaults)) +
      fence('sass', sassVariablesFile),

    // The layout playground: the prose around it carries the examples.
    ViewPlay: () => '',

    ThemePicker: ctx => livePage('theme picker', ctx),
    MenuPositioning: ctx => livePage('menu positioning demo', ctx),
    TooltipPositioning: ctx => livePage('tooltip positioning demo', ctx),
    ComponentsListing: ctx => livePage('components index', ctx),
    IntroductionVideo: ctx => livePage('introduction video', ctx),
    QuasarReleases: ctx => livePage('release notes', ctx),

    // Team grid cards. The whole section gets dropped, a stub would be redundant.
    TeamMember: () => '',
    MainMember: () => '',
    SocialMember: () => '',
    RouterMember: () => ''
  }

  return Object.fromEntries(
    Object.entries(renderers).map(([tag, render]) => {
      const handle = (_token, ctx) => render(ctx)
      return [tag, { block: handle, inline: handle }]
    })
  )
}
