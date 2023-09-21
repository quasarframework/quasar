import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'

const langList = [
  { name: 'markup' },
  { name: 'bash' },
  { name: 'javascript', aliases: 'javascript|js' },
  { name: 'typescript', aliases: 'typescript|ts' },
  { name: 'sass' },
  { name: 'scss' },
  { name: 'css' },
  { name: 'json' },
  { name: 'xml' },
  { name: 'nginx' },
  { name: 'html' },

  // special grammars:
  { name: 'diff' }
]

loadLanguages(langList.map(l => l.name))

const langMatch = langList.map(l => l.aliases || l.name).join('|')

/**
 * lang -> one of the supported languages (langList)
 * attrs -> optional attributes:
 *    * numbered - lines are numbered
 *    * highlight="1,2-4,6" - lines are highlighted
 *    * add="1,2-4,6" - lines are added
 *    * rem="1,2-4,6" - lines are removed
 *    * maxheight="300px" - max height of the code block (including CSS unit)
 * title -> optional card title
 */
const definitionLineRE = new RegExp(
  '^' +
  `(?<lang>(tabs|${ langMatch }))` + // then a language name
  '(\\s+\\[(?<attrs>.*)\\])?' + // then optional attributes
  '(\\s+(?<title>.+))?' + // then optional title
  '$'
)

/**
 * <<| lang [attrs] [title] |>>
 * ...content...
 */
const tabsLineRE = new RegExp(
  '^<<\\|\\s+' + // starts with "<<|" + at least one space char
  `(?<lang>${ langMatch })` + // then a language name
  '(\\s+\\[(?<attrs>.*)\\])?' + // then optional attributes
  '(\\s+(?<title>.+))?' + // then optional title
  '\\s*\\|>>$' // then any number of space chars + the ending "|>>"
)

function extractTabs (content) {
  const list = []
  const tabMap = {}

  let currentTabName = null

  for (const line of content.split('\n')) {
    const tabsMatch = line.match(tabsLineRE)

    if (tabsMatch !== null) {
      const { groups: { lang, attrs, title } } = tabsMatch

      currentTabName = title?.trim() || `Tab ${ list.length + 1 }`

      list.push(currentTabName)
      tabMap[ currentTabName ] = {
        attrs: {
          ...parseAttrs(attrs?.trim() || null),
          lang
        },
        content: []
      }
    }
    else if (currentTabName !== null) {
      tabMap[ currentTabName ].content.push(line)
    }
  }

  if (list.length === 0) return

  return {
    param: `[ ${ list.map(tab => `'${ tab }'`).join(', ') } ]`,
    content: list.map(tabName => {
      const props = tabMap[ tabName ]
      return (
        `<q-tab-panel class="q-pa-none" name="${ tabName }">` +
        applyHighlighting(props.content.join('\n'), props.attrs) +
        '</q-tab-panel>'
      )
    }).join('\n')
  }
}

const magicCommentRE = / *\/\/\[! (?<type>[\w-]+)\] */
const magicCommentGlobalRE = new RegExp(magicCommentRE, 'g')

function addLineClasses (config, klass, list) {
  const entries = config.split(',')
  for (const entry of entries) {
    let [ from, to ] = entry.split('-').map(i => parseInt(i, 10))
    if (to === void 0) to = from

    for (let i = from; i <= to; i++) {
      const target = list[ i - 1 ]
      if (target !== void 0 && target.indexOf(klass) === -1) {
        list[ i - 1 ] += ` ${ klass }`
      }
    }
  }
}

function getLineClasses (content, attrs) {
  const lines = content.split('\n')

  const list = lines.map(line => {
    let classList = ''
    const match = line.match(magicCommentRE)

    if (match !== null) {
      const { groups: { type } } = match
      classList += ` c-${ type }`
    }

    return classList
  })

  const { highlight, rem, add } = attrs
  highlight !== void 0 && addLineClasses(highlight, 'c-highlight', list)
  rem !== void 0 && addLineClasses(rem, 'c-rem', list)
  add !== void 0 && addLineClasses(add, 'c-add', list)

  return list
}

function applyHighlighting (rawContent, attrs) {
  const content = rawContent.trim()
  const { lang, numbered } = attrs

  const lineClasses = getLineClasses(content, attrs)
  const lineCount = ('' + lineClasses.length).length

  const html = prism
    .highlight(content.replace(magicCommentGlobalRE, ''), prism.languages[ lang ], lang)
    .split('\n')
    .map((line, lineIndex) => (
      (
        lineClasses[ lineIndex ] !== ''
          ? `<span class="c-line${ lineClasses[ lineIndex ] || '' }"></span>`
          : ''
      ) +
      (
        numbered === true
          ? `<span class="c-lnum">${ ('' + (lineIndex + 1)).padStart(lineCount, ' ') }</span>`
          : ''
      ) +
      line
    )).join('\n')

  const { maxheight } = attrs
  const preAttrs = maxheight !== void 0
    ? ` style="max-height:${ maxheight }"`
    : ''

  return `<pre v-pre class="doc-code"${ preAttrs }><code>${ html }</code></pre><copy-button />`
}

function parseAttrs (rawAttrs) {
  if (rawAttrs === null) return {}

  const acc = {}
  const attrList = rawAttrs.split(/\s+/)

  for (const attr of attrList) {
    const [ key, value ] = attr.split('=')
    acc[ key.trim() ] = value?.trim() || true
  }

  return acc
}

export function parseDefinitionLine (token) {
  const match = token.info.trim().match(definitionLineRE)

  if (match === null) {
    return {
      lang: 'markup',
      title: null
    }
  }

  const { groups: { lang, attrs, title } } = match
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

export default function mdPluginCodeblock (md) {
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[ idx ]
    const attrs = parseDefinitionLine(token)

    md.$data.components.add('src/components/DocPrerender')
    md.$data.components.add('src/components/CopyButton')

    return `<doc-prerender${ attrs.title !== null ? ` title="${ attrs.title }"` : ''}${ attrs.tabs !== void 0 ? ` :tabs="${ attrs.tabs.param }"` : '' }>` +
      (
        attrs.tabs !== void 0
          ? attrs.tabs.content
          : applyHighlighting(token.content, attrs)
      ) +
      '</doc-prerender>'
  }
}
