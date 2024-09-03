import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index.js'

const langList = [
  { name: 'markup' },
  { name: 'bash', customCopy: true },
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

const customCopyLangList = langList
  .filter(l => l.customCopy === true)
  .map(l => l.name)

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
        getHighlightedContent(props.content.join('\n'), props.attrs) +
        '</q-tab-panel>'
      )
    }).join('\n')
  }
}

const magicCommentList = [ 'highlight', 'rem', 'add' ]
const magicCommentRE = new RegExp(` *\\[\\[! (?<type>(${ magicCommentList.join('|') }))\\]\\] *`)
const magicCommentGlobalRE = new RegExp(magicCommentRE, 'g')

function extractCodeLineProps (lines, attrs) {
  const acc = {}

  for (const type of magicCommentList) {
    acc[ type ] = attrs[ type ] !== void 0
      ? attrs[ type ].split(',')
      : []
  }

  lines.forEach((line, lineIndex) => {
    const match = line.match(magicCommentRE)

    if (match !== null) {
      const { groups: { type } } = match
      acc[ type ].push('' + (lineIndex + 1))
    }
  })

  return acc
}

function parseCodeLine (content, attrs) {
  const lines = content.split('\n')

  const props = extractCodeLineProps(lines, attrs)

  const acc = lines.map(() => ({
    prefix: [],
    classList: []
  }))

  const hasRemOrAdd = props.rem.length !== 0 || props.add.length !== 0

  for (const type of magicCommentList) {
    const target = props[ type ]

    for (const value of target) {
      let [ from, to ] = value.split('-').map(i => parseInt(i, 10))
      if (to === void 0) to = from

      for (let i = from; i <= to; i++) {
        acc[ i - 1 ].classList.push(`c-${ type }`)
      }
    }
  }

  if (attrs.numbered === true) {
    const lineCount = ('' + lines.length).length

    lines.forEach((_, lineIndex) => {
      acc[ lineIndex ].prefix.push(
        ('' + (lineIndex + 1)).padStart(lineCount, ' ')
      )
    })
  }

  hasRemOrAdd === true && lines.forEach((_, lineIndex) => {
    const target = acc[ lineIndex ]

    target.prefix.push(
      target.classList.includes('c-add') === true
        ? '+'
        : (
            target.classList.includes('c-rem') === true
              ? '-'
              : ' '
          )
    )
  })

  return acc
}

function getHighlightedContent (rawContent, attrs) {
  const { lang, maxheight } = attrs

  const content = rawContent.trim()
  const lineList = parseCodeLine(content, attrs)

  const html = prism
    .highlight(content.replace(magicCommentGlobalRE, ''), prism.languages[ lang ], lang)
    .split('\n')
    .map((line, lineIndex) => {
      const target = lineList[ lineIndex ]

      return (
        (
          target.classList.length !== 0
            ? `<span class="c-line ${ target.classList.join(' ') }"></span>`
            : ''
        ) +
        (
          target.prefix.length !== 0
            ? `<span class="c-lpref">${ target.prefix.join(' ') }</span>`
            : ''
        ) +
        line
      )
    }).join('\n')

  const codeClass = lang === 'css'
    ? ' language-css' // we need this class explicitly
    : '' // in all other cases it's useless (it doesn't have special token classes)

  const preAttrs = maxheight !== void 0
    ? ` style="max-height:${ maxheight }"`
    : ''

  const langProp = customCopyLangList.includes(lang) === true
    ? ` lang="${ lang }"`
    : ''

  return `<pre v-pre class="doc-code${ codeClass }"${ preAttrs }><code>${ html }</code></pre><copy-button${ langProp } />`
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

    md.$frontMatter.pageScripts.add('import DocPrerender from \'src/components/DocPrerender.js\'')
    md.$frontMatter.pageScripts.add('import CopyButton from \'src/components/CopyButton.vue\'')

    return `<doc-prerender${ attrs.title !== null ? ` title="${ attrs.title }"` : ''}${ attrs.tabs !== void 0 ? ` :tabs="${ attrs.tabs.param }"` : '' }>` +
      (
        attrs.tabs !== void 0
          ? attrs.tabs.content
          : getHighlightedContent(token.content, attrs)
      ) +
      '</doc-prerender>'
  }
}
