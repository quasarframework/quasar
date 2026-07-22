import md from './md.js'
import { convertToRelated, flatMenu } from './flat-menu.js'
import { getVueComponent, parseFrontMatter } from './md-parse-utils.js'

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
 * downstream Vue template never see the marker tags.
 *
 * @param {string} source raw page source (including frontmatter)
 * @returns {string} source with llm-* markers normalized for the HTML pipeline
 */
function applyHtmlContentControl(source) {
  return source
    .replace(LLM_ONLY_RE, '')
    .replace(LLM_EXCLUDE_OPEN_RE, '')
    .replace(LLM_EXCLUDE_CLOSE_RE, '')
}

export default function mdParse(code, id, isProd) {
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

  if (frontMatter.editLink !== false) {
    frontMatter.editLink = id.slice(id.indexOf('src/pages/') + 10, -3)
  }

  md.$frontMatter = null // free up memory

  const { mdContent, userScripts } = splitRenderedContent(mdRenderedContent)

  return getVueComponent({
    isProd,
    frontMatter,
    mdContent,
    pageScripts: [...frontMatter.pageScripts, ...userScripts].join('\n')
  })
}
