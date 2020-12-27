const
  recast = require('recast'),
  parser = require('recast/parsers/babel')

// Analize component JS file
module.exports.evaluate = (source, lookup, callback) => {
  const ast = recast.parse(source, { parser })
  for (const node of ast.program.body) {
    if (node.type === 'ExportDefaultDeclaration') {
      const properties
        = node.declaration.properties // When exporting a plain object (`export default { ... }`)
        || node.declaration.arguments[ 0 ].properties // When exporting a wrapped object (`export default defineComponent({ ... })`)
      for (const property of properties) {
        const propName = property.key.name
        if (lookup.includes(propName)) {
          const innerProps = property.value.properties
          if (innerProps !== void 0) { // TODO vue3 - fix AST
            for (const innerProp of innerProps) {
              let definition = null
              if (propName === 'props' && innerProp.value) {
                definition = getPropDefinition(innerProp)
              }
              innerProp.key !== void 0 && callback(propName, innerProp.key.name, definition)
            }
          }
        }
      }
    }
  }
}

function getPropDefinition (innerProp) {
  let definition = {}
  if (innerProp.value.type === 'Identifier') {
    definition.type = innerProp.value.name
  }
  else if (innerProp.value.type === 'ArrayExpression') {
    definition.type = innerProp.value.elements.map(e => e.name)
  }
  else if (innerProp.value.type !== 'ConditionalExpression') {
    const jsonContent = innerProp.value.properties.map(p => {
      let value
      if (p.value) {
        if (p.value.name || p.value.value) {
          value = `"${ p.value.name || p.value.value }"`
        }
        else if (p.value.type === 'ArrowFunctionExpression') {
          if (p.value.body.type === 'ArrayExpression') {
            value = `[${ p.value.body.elements.map(e => e.extra.raw || e.value).join(', ') }]`
          }
          else if (!p.value.body.callee || !p.value.body.callee.object || !p.value.body.callee.object.elements) {
            return ''
          }
          else {
            value = `[${ p.value.body.callee.object.elements.map(e => e.extra.raw || e.value).join(', ') }]`
          }
        }
        else if (p.value.type === 'FunctionExpression') {
          value = `[${ p.value.body.body.argument.callee.object.elements.map(e => e.extra.raw || e.value).join(', ') }]`
        }
      }
      else {
        return ''
      }
      if (value === void 0) {
        return ''
      }
      return `"${ p.key.name }": ${ value }`
    }).filter(c => !!c).map(c => c.replace(/'/g, '"')).join(', ')
    definition = JSON.parse(`{${ jsonContent }}`)
  }

  return definition
}
