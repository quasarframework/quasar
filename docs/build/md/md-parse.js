import md from './md.js'
import { convertToRelated, flatMenu } from './flat-menu.js'
import { getVueComponent, parseFrontMatter } from './md-parse-utils.js'
import { preprocessDocInstallation } from '../doc-installation/preprocess.js'

const docApiRE = /<DocApi /
const docInstallationRE = /<DocInstallation /
const docTreeRE = /<DocTree /
const scriptRE = /<script doc>\n((.|\n)*?)\n<\/script>/g

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

export default function mdParse(code, id) {
  const { data: frontMatter, content: rawContent } = parseFrontMatter(code)
  const content = preprocessDocInstallation(rawContent)

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
  if (docApiRE.test(code)) {
    frontMatter.pageScripts.add("import DocApi from '@/components/DocApi.vue'")
  }
  if (docInstallationRE.test(code)) {
    frontMatter.pageScripts.add(
      "import DocInstallation from '@/components/DocInstallation.vue'"
    )
  }
  if (docTreeRE.test(code)) {
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
    frontMatter,
    mdContent,
    pageScripts: [...frontMatter.pageScripts, ...userScripts].join('\n')
  })
}
