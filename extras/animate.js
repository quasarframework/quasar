function requireAll (r) { r.keys().forEach(r) }
requireAll(
  require.context('./animate/', true, /^\.\/.*\.css$/)
)
