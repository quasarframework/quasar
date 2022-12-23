
const vendorRE = /node_modules[\\/](vue|@vue|quasar|vue-router)[\\/](.*)\.(m?js|css|sass)$/
const exampleRE = /examples:([a-zA-Z0-9]+)$|src[\\/]examples[\\/]([a-zA-Z0-9-]+)/

module.exports = function manualChunks (id) {
  if (vendorRE.test(id) === true) {
    return 'vendor'
  }

  const examplesMatch = exampleRE.exec(id)
  if (examplesMatch !== null) {
    const name = examplesMatch[ 1 ] || examplesMatch[ 2 ]
    return `e.${ name }`
  }
}
