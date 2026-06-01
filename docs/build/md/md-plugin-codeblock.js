import { highlighter } from '#md/highlight/build-highlighter.js'
import { langMatch } from '#md/highlight/build-langs.js'
import { buildFenceTransformers, themeOptions } from '#md/highlight/shared.js'
import { getFenceBuildOnlyTransformers } from '#md/highlight/twoslash.js'

/**
 * lang -> one of the supported languages
 * attrs -> optional attributes:
 *    * numbered - lines are numbered
 *    * highlight="1,2-4,6" - lines are highlighted
 *    * add="1,2-4,6" - lines are marked as added (diff gutter)
 *    * rem="1,2-4,6" - lines are marked as removed (diff gutter)
 * title -> optional card title
 */
const definitionLineRE = new RegExp(
  '^' +
    `(?<lang>(tabs|${langMatch}))` + // then a language name
    String.raw`(\s+\[(?<attrs>.*)\])?` + // then optional attributes
    String.raw`(\s+(?<title>.+))?` + // then optional title
    '$'
)

/**
 * <<| lang [attrs] [title] |>>
 * ...content...
 */
const tabsLineRE = new RegExp(
  String.raw`^<<\|\s+` + // starts with "<<|" + at least one space char
    `(?<lang>${langMatch})` + // then a language name
    String.raw`(\s+\[(?<attrs>.*)\])?` + // then optional attributes
    String.raw`(\s+(?<title>.+))?` + // then optional title
    String.raw`\s*\|>>$` // then any number of space chars + the ending "|>>"
)

const customCopyLangs = new Set(['bash'])

function extractTabs(content) {
  const list = []
  const tabMap = {}

  let currentTabName = null

  for (const line of content.split('\n')) {
    const tabsMatch = line.match(tabsLineRE)

    if (tabsMatch !== null) {
      const {
        groups: { lang, attrs, title }
      } = tabsMatch

      currentTabName = title?.trim() || `Tab ${list.length + 1}`

      list.push(currentTabName)
      tabMap[currentTabName] = {
        attrs: {
          ...parseAttrs(attrs?.trim() || null),
          lang
        },
        content: []
      }
    } else if (currentTabName !== null) {
      tabMap[currentTabName].content.push(line)
    }
  }

  if (list.length === 0) return

  return {
    param: `[ ${list.map(tab => `'${tab}'`).join(', ')} ]`,
    content: list
      .map(tabName => {
        const props = tabMap[tabName]
        return (
          `<q-tab-panel class="q-pa-none" name="${tabName}">` +
          getHighlightedContent(props.content.join('\n'), props.attrs) +
          '</q-tab-panel>'
        )
      })
      .join('\n')
  }
}

function getHighlightedContent(rawContent, attrs) {
  const { lang } = attrs
  const content = rawContent.trim()

  const html = highlighter
    .codeToHtml(content, {
      lang,
      ...themeOptions,
      transformers: buildFenceTransformers(
        attrs,
        getFenceBuildOnlyTransformers(attrs)
      )
    })
    .replace('<pre ', '<pre v-pre ')

  const langProp = customCopyLangs.has(lang) ? ` lang="${lang}"` : ''

  return `${html}<copy-button${langProp} />`
}

function parseAttrs(rawAttrs) {
  if (rawAttrs === null) return {}

  const acc = {}
  const attrList = rawAttrs.split(/\s+/)

  for (const attr of attrList) {
    const [key, value] = attr.split('=')
    acc[key.trim()] = value?.trim() || true
  }

  return acc
}

export function parseDefinitionLine(token) {
  const match = token.info.trim().match(definitionLineRE)

  if (match === null) {
    return {
      lang: 'html',
      title: null
    }
  }

  const {
    groups: { lang, attrs, title }
  } = match
  const acc = {
    ...parseAttrs(attrs?.trim() || null),
    lang,
    title: title?.trim() || null
  }

  if (acc.lang === 'tabs') {
    acc.tabs = extractTabs(token.content)
  }

  return acc
}

export default function mdPluginCodeblock(md) {
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const attrs = parseDefinitionLine(token)

    md.$frontMatter.pageScripts.add(
      "import DocPrerender from '@/components/DocPrerender.js'"
    )
    md.$frontMatter.pageScripts.add(
      "import CopyButton from '@/components/CopyButton.vue'"
    )

    return (
      `<doc-prerender${attrs.title !== null ? ` title="${attrs.title}"` : ''}${attrs.tabs !== void 0 ? ` :tabs="${attrs.tabs.param}"` : ''}>` +
      (attrs.tabs !== void 0
        ? attrs.tabs.content
        : getHighlightedContent(token.content, attrs)) +
      '</doc-prerender>'
    )
  }
}
