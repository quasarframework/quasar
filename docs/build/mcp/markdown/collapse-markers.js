/**
 * Strip `// #region ... // #endregion` blocks from inlined example source.
 *
 * Authors place these around content to omit from AI docs. Thanks to the
 * standard IDE-region convention, the live docs site renders the markers
 * and their content normally. Only the AI extractor strips them.
 *
 * Each region (and any nested regions) collapses to a single placeholder
 * line, preserving the indentation of the opening marker. The placeholder
 * matches the opening marker style: `// ...` for line-comment regions,
 * `<!-- ... -->` for HTML-comment regions.
 *
 * Syntax (JS line-comment form, for <script> blocks):
 *   // #region <optional-label>
 *   ...omitted content...
 *   // #endregion
 *
 * Syntax (HTML-comment form, for <template> blocks in Vue SFCs):
 *   <!-- #region <optional-label> -->
 *   ...omitted content...
 *   <!-- #endregion -->
 *
 * Behavior:
 *   - Plain `// #region` / `<!-- #region -->` (with or without a label) opens
 *   - Plain `// #endregion` / `<!-- #endregion -->` closes
 *   - Marker styles may be mixed in the same source and don't need to match
 *     per pair. The placeholder style follows the OPENING marker.
 *   - Nested regions fold into the outer placeholder
 *   - A missing #endregion preserves the marker line as-is (no silent loss)
 */

const START_RE = /^(\s*)(\/\/|<!--)\s*#region(?:\s.*?)?(?:\s*-->)?\s*$/
const END_RE = /^\s*(?:\/\/|<!--)\s*#endregion\s*(?:-->)?\s*$/
const HTML_MARKER = '<!--'

/**
 * @param {string} source raw .vue or .js text
 * @returns {{ source: string, warnings: string[] }} source with region blocks
 *   replaced by a placeholder line, plus unclosed-marker warnings
 */
export function applyCollapseMarkers(source) {
  const lines = source.split('\n')
  const warnings = []
  const output = []
  let index = 0
  while (index < lines.length) {
    const startMatch = lines[index].match(START_RE)
    if (!startMatch) {
      output.push(lines[index])
      index++
      continue
    }

    // Find the matching #endregion, allowing nested regions.
    const [, indent, markerStyle] = startMatch
    let depth = 1
    let endIndex = index + 1
    while (endIndex < lines.length && depth > 0) {
      if (START_RE.test(lines[endIndex])) {
        depth++
      } else if (END_RE.test(lines[endIndex])) {
        depth--
      }
      if (depth === 0) {
        break
      }
      endIndex++
    }

    if (endIndex >= lines.length) {
      // No matching #endregion. Keep the open marker so nothing is lost,
      // continue parsing, and surface the authoring slip.
      warnings.push(
        `Unclosed region marker at line ${index + 1}: ${lines[index].trim()}`
      )
      output.push(lines[index])
      index++
      continue
    }

    // Replace lines[index..endIndex] inclusive with a single placeholder.
    const placeholder = markerStyle === HTML_MARKER ? '<!-- ... -->' : '// ...'
    output.push(indent + placeholder)
    index = endIndex + 1
  }
  return { source: output.join('\n'), warnings }
}
