/**
 * Shiki "magic comment" handling for fenced code content.
 *
 * The docs site uses Shiki transformer notations inside code blocks:
 *
 *   import routes from './routes' // [!code --]
 *   import { routes } from 'vue-router/auto-routes' // [!code ++]
 *   doSomething() // [!code highlight]
 *
 * These style lines on the live site. For AI output they are noise, and a
 * `--` line would wrongly read as current code. Translation:
 *
 *   - `[!code ++]`  -> strip marker, prefix line with `+ ` (diff added)
 *   - `[!code --]`  -> strip marker, prefix line with `- ` (diff removed)
 *   - anything else (highlight/focus/error/warning/word:...) -> strip marker,
 *     keep line as-is (pure presentation)
 */

const MAGIC_RE = /\s*(?:\/\/|<!--|#)\s*\[!code\s+([^\]]+)\]\s*(?:-->)?\s*$/

/**
 * @param {string} content raw fence content
 * @returns {string} content with magic comments translated/stripped
 */
export function transformMagicComments(content) {
  if (!content.includes('[!code')) {
    return content
  }

  return content
    .split('\n')
    .map(line => {
      const matches = line.match(MAGIC_RE)
      if (!matches) {
        return line
      }

      const stripped = line.slice(0, matches.index)
      const kind = matches[1].trim()
      if (kind === '++') {
        return '+ ' + stripped
      }
      if (kind === '--') {
        return '- ' + stripped
      }
      return stripped
    })
    .join('\n')
}
