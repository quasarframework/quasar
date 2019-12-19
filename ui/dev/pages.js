/*
 * Export files list for /dev/components folder
 */

export default require.context('./components', true, /^\.\/.*\.vue$/, 'lazy')
  .keys()
  .filter(page => page.split('/').length === 3)
  .map(page => page.slice(2))
