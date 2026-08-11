/**
 * <DocInstall [title] [components] [directives] [plugins] [config] /> handler.
 *
 * Renders an Installation H2 plus a quasar.config.js framework snippet for
 * the listed keys. See spec §"<DocInstallation>".
 *
 * Attribute forms:
 *   components="QInput"
 *   :components="['QInput', 'QInput2']"
 *   (same for directives, plugins, config)
 *   title="Custom Installation"
 *
 * When no list-bearing attribute is present, warn and emit nothing instead
 * of dumping an empty `framework: { }` block.
 */

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [inline]
 */

const ATTR_RE = /(?<bind>:?)(?<name>[\w-]+)="(?<value>[^"]*)"/g

/**
 * Parse a tag's attribute string. The bound form `:name="..."` is decoded as
 * an array literal or a quoted scalar. The plain form `name="..."` is taken
 * as a string.
 *
 * @param {string} content
 * @returns {Record<string, string|string[]>}
 */
function parseAttrs(content) {
  /** @type {Record<string, string|string[]>} */
  const attributes = {}
  ATTR_RE.lastIndex = 0
  let match
  while ((match = ATTR_RE.exec(content))) {
    const { bind, name, value } = /** @type {any} */ (match.groups)
    if (bind !== ':') {
      attributes[name] = value
      continue
    }

    // Naive array parse is enough here. Split on commas, strip quotes.
    const trimmed = value.trim()
    attributes[name] =
      trimmed.startsWith('[') && trimmed.endsWith(']')
        ? trimmed
            .slice(1, -1)
            .split(',')
            .map(item => item.trim().replaceAll(/^['"]|['"]$/g, ''))
            .filter(Boolean)
        : trimmed.replaceAll(/^['"]|['"]$/g, '')
  }
  return attributes
}

/**
 * Normalize a scalar-or-array attribute value into a string[]. Returns null
 * when the attribute was absent so callers can branch on presence.
 *
 * @param {string|string[]|undefined} value
 * @returns {string[]|null}
 */
function toArray(value) {
  if (value === void 0) {
    return null
  }
  return Array.isArray(value) ? value : [value]
}

/**
 * Format a single `key: [ 'a', 'b' ]` block for the framework snippet.
 *
 * @param {string[]} items
 * @param {string} key
 * @returns {string}
 */
function emitList(items, key) {
  return `    ${key}: [\n${items.map(item => `      '${item}'`).join(',\n')}\n    ]`
}

/**
 * Build a DocInstall tag handler.
 *
 * @returns {TagHandler}
 */
export function docInstallationHandler() {
  return {
    block: (token, ctx) => {
      const attributes = parseAttrs(token.content)
      const title =
        typeof attributes.title === 'string' ? attributes.title : 'Installation'
      const components = toArray(/** @type {any} */ (attributes.components))
      const directives = toArray(/** @type {any} */ (attributes.directives))
      const plugins = toArray(/** @type {any} */ (attributes.plugins))
      const config = toArray(/** @type {any} */ (attributes.config))

      const parts = []
      if (components) {
        parts.push(emitList(components, 'components'))
      }
      if (directives) {
        parts.push(emitList(directives, 'directives'))
      }
      if (plugins) {
        parts.push(emitList(plugins, 'plugins'))
      }
      if (config) {
        // framework.config is an object keyed by feature name, unlike the
        // string lists above. Mirrors the live DocInstall.vue rendering.
        const entries = config
          .map(
            item =>
              `      ${item}: { /* look at QuasarConfOptions from the API card */ }`
          )
          .join(',\n')
        parts.push(`    config: {\n${entries}\n    }`)
      }
      if (parts.length === 0) {
        ctx.warnings.push(
          `<DocInstall> in ${ctx.sourcePath} has no components/directives/plugins/config attrs; skipping`
        )
        return ''
      }

      let output = `## ${title}\n\n`
      output += 'Add to `quasar.config.js`:\n\n'
      output += '```js\nframework: {\n'
      output += parts.join(',\n') + '\n}\n```\n\n'
      return output
    }
  }
}
