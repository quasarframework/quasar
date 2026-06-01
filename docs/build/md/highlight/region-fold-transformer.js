/*
 * Collapses `#region` / `#endregion` blocks into a native <details> so the
 * reader can fold the boring bits. The opening marker is replaced by a
 * placeholder (chevron + the region's label, or `…` if there isn't one), and
 * the closing marker is dropped entirely. Only top-level pairs get folded;
 * nested markers are stripped so they don't leak into the rendered code.
 * Unmatched markers stay put so the author can spot the typo.
 */

const REGION_RE =
  /^(\s*)(?:\/\/|\/\*|<!--)\s*#region\b\s*(.*?)(?:\s*(?:\*\/|-->))?\s*$/
const ENDREGION_RE = /^\s*(?:\/\/|\/\*|<!--)\s*#endregion\b/

function hasClass(node, className) {
  const value = node.properties?.class
  if (typeof value === 'string') {
    return value.split(/\s+/).includes(className)
  }
  if (Array.isArray(value)) {
    return value.includes(className)
  }
  return false
}

function isLine(node) {
  return (
    node.type === 'element' && node.tagName === 'span' && hasClass(node, 'line')
  )
}

// Read the line's source text, skipping any line-number prefix injected by
// the line-decor transformer so the marker regex only sees what the author
// wrote.
function readLineText(lineNode) {
  let text = ''
  const walk = node => {
    if (node.type === 'element' && hasClass(node, 'c-lpref')) {
      return
    }
    if (node.type === 'text') {
      text += node.value
    } else if (node.children !== void 0) {
      node.children.forEach(walk)
    }
  }
  lineNode.children.forEach(walk)
  return text
}

function buildSummaryLine(markerNode, indent, label) {
  // Carry over the line-number prefix (if any) so numbering stays consistent
  // with the source even when the marker text itself is hidden.
  const firstChild = markerNode.children[0]
  const hasLineNumber =
    firstChild !== void 0 &&
    firstChild.type === 'element' &&
    hasClass(firstChild, 'c-lpref')

  return {
    type: 'element',
    tagName: 'span',
    properties: { class: 'line doc-code-fold__placeholder' },
    children: [
      ...(hasLineNumber ? [firstChild] : []),
      { type: 'text', value: indent },
      {
        type: 'element',
        tagName: 'span',
        properties: { class: 'doc-code-fold__chevron' },
        children: [{ type: 'text', value: '▸' }]
      },
      { type: 'text', value: ' ' + (label || '…') }
    ]
  }
}

export function regionFoldTransformer() {
  return {
    name: 'docs:region-fold',
    code(codeNode) {
      const children = codeNode.children
      const lineChildIndex = []
      for (let index = 0; index < children.length; index++) {
        if (isLine(children[index])) {
          lineChildIndex.push(index)
        }
      }
      if (lineChildIndex.length === 0) {
        return
      }

      // First pass: pair every `#region` with its matching `#endregion`.
      // Only the outermost pair becomes a fold; nested pairs are recorded so
      // their markers can be stripped from the rendered output.
      const openStack = []
      const topRegions = []
      const markerLines = new Set()

      for (let lineIndex = 0; lineIndex < lineChildIndex.length; lineIndex++) {
        const sourceText = readLineText(children[lineChildIndex[lineIndex]])
        const startMatch = sourceText.match(REGION_RE)
        if (startMatch !== null) {
          openStack.push({
            lineIndex,
            indent: startMatch[1],
            label: startMatch[2].trim()
          })
          continue
        }
        if (ENDREGION_RE.test(sourceText)) {
          const open = openStack.pop()
          if (open === void 0) {
            continue
          }
          markerLines.add(open.lineIndex)
          markerLines.add(lineIndex)
          if (openStack.length === 0) {
            topRegions.push({
              start: open.lineIndex,
              end: lineIndex,
              indent: open.indent,
              label: open.label
            })
          }
        }
      }

      if (topRegions.length === 0) {
        return
      }

      const regionByStartLine = new Map()
      for (const region of topRegions) {
        regionByStartLine.set(region.start, region)
      }

      // Second pass: walk the original children, advancing one line at a
      // time. Each `cursor` step matches either a line node or the text
      // newline that follows it.
      const rebuilt = []
      const totalChildren = children.length
      let cursor = 0
      let lineIndex = 0

      const skipTrailingNewline = () => {
        if (cursor < totalChildren && children[cursor].type === 'text') {
          cursor++
        }
      }

      const collectInner = (firstLine, lastLine) => {
        const inner = []
        while (lineIndex < lastLine) {
          if (markerLines.has(lineIndex)) {
            cursor++
            lineIndex++
            skipTrailingNewline()
            continue
          }
          inner.push(children[cursor])
          cursor++
          lineIndex++
          if (cursor < totalChildren && children[cursor].type === 'text') {
            inner.push(children[cursor])
            cursor++
          }
        }
        return inner
      }

      while (cursor < totalChildren) {
        if (cursor !== lineChildIndex[lineIndex]) {
          rebuilt.push(children[cursor])
          cursor++
          continue
        }

        const region = regionByStartLine.get(lineIndex)
        if (region !== void 0) {
          const markerNode = children[cursor]
          const summaryLine = buildSummaryLine(
            markerNode,
            region.indent,
            region.label
          )

          // Drop the newline before the fold: the <details> block boundary
          // already inserts one for both rendering and innerText copy, so
          // keeping the literal newline would produce a blank line.
          const previous = rebuilt.at(-1)
          if (previous !== void 0 && previous.type === 'text') {
            rebuilt.pop()
          }

          // Skip the opening marker line + its trailing newline before
          // collecting the inner content; the placeholder takes their place.
          cursor++
          lineIndex++
          skipTrailingNewline()

          const innerChildren = collectInner(region.start + 1, region.end)

          // Drop the trailing newline so the fold body doesn't end with a
          // blank visual line before </details>. The block-level <details>
          // already separates the fold from the next line, both visually
          // and for copy (innerText inserts a break at block boundaries).
          const last = innerChildren.at(-1)
          if (last !== void 0 && last.type === 'text') {
            innerChildren.pop()
          }

          // Skip the closing marker line + its trailing newline for the same
          // reason — the <details> block boundary handles the separation.
          cursor++
          lineIndex++
          skipTrailingNewline()

          rebuilt.push({
            type: 'element',
            tagName: 'details',
            properties: { class: 'doc-code-fold' },
            children: [
              {
                type: 'element',
                tagName: 'summary',
                properties: { class: 'doc-code-fold__summary' },
                children: [summaryLine]
              },
              ...innerChildren
            ]
          })
          continue
        }

        if (markerLines.has(lineIndex)) {
          // Nested marker landing outside a top-level fold — drop the line
          // and its trailing newline.
          cursor++
          lineIndex++
          skipTrailingNewline()
          continue
        }

        rebuilt.push(children[cursor])
        cursor++
        lineIndex++
      }

      codeNode.children = rebuilt
    }
  }
}
