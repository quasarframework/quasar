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
  { name: 'diff' }
]

loadLanguages(langList.map(l => l.name))

const langMatch = langList.map(l => l.aliases || l.name).join('|')

const definitionLineRE = new RegExp(
  '^' +
  `(?<lang>(tabs|${ langMatch }))` + // then a language name
  '(\\s+\\[(?<attrs>.*)\\])?' + // then optional attributes
  '(\\s+(?<title>.+))?' + // then optional title
  '$'
)

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
        `<pre v-pre class="doc-code">${ highlight(props.content.join('\n'), props.attrs) }</pre>` +
        '<copy-button />' +
        '</q-tab-panel>'
      )
    }).join('\n')
  }
}

function highlight (content, attrs) {
  const { lang, numbered } = attrs
  const highlightedText = prism.highlight(content, prism.languages[ lang ], lang)

  if (numbered === true) {
    const lines = highlightedText.split('\n')
    const lineCount = ('' + highlightedText.length).length

    return lines
      .slice(0, lines.length)
      .map((line, index) => `<span class="token line-number">${ ('' + (index + 1)).padStart(lineCount, ' ') }.</span>${ line }`)
      .join('\n')
  }

  return highlightedText
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
          : (
              `<pre v-pre class="doc-code">${ highlight(token.content, attrs) }</pre>` +
              '<copy-button />'
            )
      ) +
      '</doc-prerender>'
  }
}
