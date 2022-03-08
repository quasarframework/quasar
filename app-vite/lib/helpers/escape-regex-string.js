
/**
 * Escape a string to then be supplied
 * to new RegExp()
 */
module.exports = str => str
  .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
  .replace(/-/g, '\\x2d')
