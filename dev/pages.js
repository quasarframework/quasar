/*
 * Export files list for /dev/components folder
 */

export default require.context('./components', true, /^\.\/.*\.vue$/)
  .keys()
  .filter(page => page.split('/').length === 3)
  .filter(page => page)
  .map(page => {
    return page.slice(2)
  })
