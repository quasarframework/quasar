/**
 * Escape a string to then be supplied
 * to new RegExp()
 */
module.exports.escapeRegexString = function escapeRegexString (str) {
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d')
}
