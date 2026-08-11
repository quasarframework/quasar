/**
 * <DocTree :def="X" /> handler.
 *
 * Renders a nested bullet list from frontmatter[X.split('.')].
 * Node shape: { l: label, e?: explanation, c?: children[], k?: kind }.
 * Reference: docs/src/components/DocTree.vue +
 * docs/src/pages/quasar-cli-vite/directory-structure.md.
 *
 * Walks the dotted `:def=` path through ctx.frontMatter. A missing key or
 * a null terminal value warns and emits nothing instead of crashing inside
 * renderNode.
 */

/** @typedef {import('./walker.js').EmitCtx} EmitCtx */
/** @typedef {import('./walker.js').MarkdownItToken} MarkdownItToken */

/**
 * @typedef {object} TagHandler
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [block]
 * @property {(token: MarkdownItToken, ctx: EmitCtx) => string} [inline]
 */

/**
 * @typedef {object} TreeNode
 * @property {string} l - label
 * @property {string} [e] - explanation
 * @property {string} [k] - kind (e.g. 'directory' for trailing slash)
 * @property {TreeNode[]} [c] - children
 */

const DEF_RE = /:def="([^"]+)"/

/**
 * Recursively render a single tree node into a markdown bullet line plus
 * children. `indent` is the depth-in-list (2 spaces per level).
 *
 * @param {TreeNode} node
 * @param {number} [indent]
 * @returns {string}
 */
function renderNode(node, indent = 0) {
  const padding = '  '.repeat(indent)
  const slash = node.k === 'directory' ? '/' : ''
  let output = `${padding}- **${node.l}${slash}**\n`
  if (node.e) {
    output += `${padding}  _${node.e}_\n`
  }
  if (Array.isArray(node.c)) {
    for (const child of node.c) {
      output += renderNode(child, indent + 1)
    }
  }
  return output
}

/**
 * Build a DocTree tag handler. No constructor options, the frontmatter
 * lookup happens at render time against ctx.frontMatter.
 *
 * @returns {TagHandler}
 */
export function docTreeHandler() {
  return {
    block: (token, ctx) => {
      const matched = token.content.match(DEF_RE)
      if (!matched) {
        ctx.warnings.push(`<DocTree> missing :def= attr in ${ctx.sourcePath}`)
        return ''
      }
      let data = ctx.frontMatter
      for (const key of matched[1].split('.')) {
        if (data && typeof data === 'object' && key in data) {
          data = data[key]
        } else {
          ctx.warnings.push(
            `<DocTree :def="${matched[1]}"> path not in frontmatter (${key} missing) in ${ctx.sourcePath}`
          )
          return ''
        }
      }
      // `key in data` passes even when the value is null, and renderNode
      // would crash on `node.l`. Guard explicitly.
      if (data === null || data === void 0) {
        ctx.warnings.push(
          `<DocTree :def="${matched[1]}"> resolved to null/undefined in ${ctx.sourcePath}`
        )
        return ''
      }
      return renderNode(/** @type {TreeNode} */ (data)) + '\n'
    }
  }
}
