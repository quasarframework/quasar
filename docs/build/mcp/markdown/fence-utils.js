/**
 * Pick a backtick fence longer than any backtick run inside the content,
 * so code that itself contains ``` can't close the emitted fence early.
 *
 * @param {string} content fenced block body
 * @returns {string} fence delimiter, at least three backticks
 */
export function fenceFor(content) {
  const runs = content.match(/`{3,}/g)
  const longestRun = runs ? Math.max(...runs.map(run => run.length)) : 0
  return '`'.repeat(Math.max(3, longestRun + 1))
}
