import md from './md.js'
import { convertToRelated, flatMenu } from './flat-menu.js'
import { getVueComponent, parseFrontMatter } from './md-parse-utils.js'
import { formatPageIdIssues, reportPageIdIssues } from './page-ids.js'

const docApiRE = /<DocApi /
const docInstallationRE = /<DocInstall /
const docTreeRE = /<DocTree /
const scriptRE = /<script doc>\n((.|\n)*?)\n<\/script>/g

const LLM_ONLY_RE = /<llm-only(?:\s[^>]*)?>[\s\S]*?<\/llm-only>/g
const LLM_EXCLUDE_OPEN_RE = /<llm-exclude(?:\s[^>]*)?>/g
const LLM_EXCLUDE_CLOSE_RE = /<\/llm-exclude>/g

/**
 * Extract the user scripts from the rendered content
 */
function splitRenderedContent(mdPageContent) {
  const userScripts = new Set()

  const mdContent = mdPageContent.replace(scriptRE, (_, p1) => {
    userScripts.add(p1)
    return ''
  })

  return { mdContent, userScripts }
}

/**
 * Inverse of the AI-docs pipeline's applyLlmContentControl: drop
 * `<llm-only>...</llm-only>` content entirely (it's meant ONLY for AI export),
 * and strip `<llm-exclude>...</llm-exclude>` wrappers while keeping their
 * content (the wrapper means "exclude from AI export, keep on live site").
 *
 * Applied at the entry of mdParse so the markdown-it tokenizer and the
 * downstream Vue template never see the marker tags. Exported so that
 * anything rendering a page outside this module (page-ids.test.js sweeps
 * every one of them) starts from the same source the site is built from.
 *
 * @param {string} source raw page source (including frontmatter)
 * @returns {string} source with llm-* markers normalized for the HTML pipeline
 */
export function applyHtmlContentControl(source) {
  return source
    .replace(LLM_ONLY_RE, '')
    .replace(LLM_EXCLUDE_OPEN_RE, '')
    .replace(LLM_EXCLUDE_CLOSE_RE, '')
}

/**
 * @param {string} code the page source
 * @param {string} id the module id
 * @param {boolean} isProd
 * @param {boolean} reportIdIssues false when the caller only wants the
 *   compiled page and not a second round of the same console lines - the HMR
 *   hook parses a page purely to be diffed against
 */
export default function mdParse(code, id, isProd, reportIdIssues = true) {
  const cleanedCode = applyHtmlContentControl(code)
  const { data: frontMatter, content } = parseFrontMatter(cleanedCode)

  frontMatter.id = id
  frontMatter.title ||= 'Generic Page'

  if (frontMatter.related !== void 0) {
    frontMatter.related = frontMatter.related.map(entry =>
      convertToRelated(entry, id)
    )
  }

  frontMatter.toc = []
  frontMatter.pageScripts = new Set()

  // markdown-it counts the body's lines from the end of the front matter,
  // which is not where the author's editor counts from
  const contentAt = cleanedCode.indexOf(content)
  frontMatter.lineOffset =
    contentAt === -1
      ? 0
      : cleanedCode.slice(0, contentAt).split('\n').length - 1

  frontMatter.pageScripts.add(
    "import DocPage from '@/layouts/doc-layout/DocPage.vue'"
  )

  if (frontMatter.examples !== void 0) {
    frontMatter.pageScripts.add(
      "import DocExample from '@/components/DocExample.vue'"
    )
  }
  // Probe cleanedCode, not code. A component living only inside a stripped
  // <llm-only> block must not add a dead import.
  if (docApiRE.test(cleanedCode)) {
    frontMatter.pageScripts.add("import DocApi from '@/components/DocApi.vue'")
  }
  if (docInstallationRE.test(cleanedCode)) {
    frontMatter.pageScripts.add(
      "import DocInstall from '@/components/DocInstall.vue'"
    )
  }
  if (docTreeRE.test(cleanedCode)) {
    frontMatter.pageScripts.add(
      "import DocTree from '@/components/DocTree.vue'"
    )
  }

  if (frontMatter.overline === void 0 && id.includes('quasar-cli-vite')) {
    frontMatter.overline = 'Quasar CLI with Vite - @quasar/app-vite v3'
  }

  const menu = flatMenu[id]

  if (menu !== void 0) {
    const { prev, next } = menu

    if (prev !== void 0 || next !== void 0) {
      frontMatter.nav = []
    }

    if (prev !== void 0) {
      frontMatter.nav.push({ ...prev, classes: 'doc-page__related--left' })
    }
    if (next !== void 0) {
      frontMatter.nav.push({ ...next, classes: 'doc-page__related--right' })
    }
  }

  md.$frontMatter = frontMatter

  const mdRenderedContent = md.render(content)

  // the TOC is collected during the render above, so this is the first
  // moment the page's whole id namespace exists. The terminal hears about it
  // now; getVueComponent puts the same lines on the page itself in dev.
  const idIssues = formatPageIdIssues(mdRenderedContent, frontMatter)
  if (reportIdIssues) reportPageIdIssues(idIssues, id)

  if (frontMatter.editLink !== false) {
    frontMatter.editLink = id.slice(id.indexOf('src/pages/') + 10, -3)
  }

  md.$frontMatter = null // free up memory

  const { mdContent, userScripts } = splitRenderedContent(mdRenderedContent)

  return getVueComponent({
    isProd,
    frontMatter,
    idIssues,
    mdContent,
    pageScripts: [...frontMatter.pageScripts, ...userScripts].join('\n')
  })
}
