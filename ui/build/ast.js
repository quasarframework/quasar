const
  recast = require('recast'),
  parser = require('recast/parsers/babel')

module.exports.evaluate = (source, lookup, callback) => {
  const ast = recast.parse(source, { parser })
  for (const node of ast.program.body) {
    if (node.type === 'ExportDefaultDeclaration') {
      const properties = node.declaration.arguments[0].properties
      for (const property of properties) {
        const propName = property.key.name
        if (lookup.includes(propName)) {
          const innerProps = property.value.properties
          for (const innerProp of innerProps) {
            callback(propName, innerProp.key.name)
          }
        }
      }
    }
  }
}
