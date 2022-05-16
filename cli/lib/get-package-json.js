module.exports = function (root) {
  return function (pkgName) {
    try {
      return require(
        require.resolve(`${pkgName}/package.json`, {
          paths: [ root ].concat(module.paths)
        })
      )
    }
    catch (e) {}
  }
}
