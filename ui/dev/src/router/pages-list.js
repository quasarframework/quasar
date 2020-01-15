export default require.context('pages/', true, /^\.\/.*\.vue$/, 'lazy')
  .keys()
  .filter(page => page.split('/').length === 3)
  .map(page => page.slice(2))
