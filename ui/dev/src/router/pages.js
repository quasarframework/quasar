const pagesList = import.meta.glob('../pages/**/*.vue')
const pagesRoutes = Object.keys(pagesList)
  .map(entry => entry.substring(8))
  .filter(page => page.split('/').length === 3)

export { pagesList, pagesRoutes }
