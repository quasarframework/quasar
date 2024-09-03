/**
 * Escape a string to then be supplied
 * to new RegExp()
 */
export function escapeRegexString (str) {
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
}
