import { Parser } from 'acorn'

const astNodeTypes = [
  'ExportNamedDeclaration', 'ExportDefaultDeclaration',
  'VariableDeclaration', 'ClassDeclaration', 'FunctionDeclaration'
]

function getAstAssignmentPattern (node, canComment) {
  const left = canComment ? `/* ${ getAstParam(node.left, false) } */ ` : ''
  const right = getAstParam(node.right, false)

  return left + right
}

function getAstObjectPattern (node, canComment) {
  const body = node.properties
    .map(prop => getAstParam(prop.value, canComment))
    .join(', ')

  return `{ ${ body } }`
}

function getAstMemberExpression (node) {
  const left = node.object.type === 'MemberExpression'
    ? getAstAssignmentPattern(node.object)
    : node.object.name

  const right = node.property.value

  return `${ left }.${ right }`
}

function getAstParam (param, canComment) {
  if (param.type === 'ArrowFunctionExpression') {
    return `(${ getParams(param.params, false) }) => {}`
  }

  if (param.type === 'Identifier') {
    return param.name
  }

  if (param.type === 'Literal') {
    return '' + param.value
  }

  if (param.type === 'NewExpression') {
    return `new ${ param.callee.name }(${ getParams(param.arguments, false) })`
  }

  if (param.type === 'MemberExpression') {
    return getAstMemberExpression(param)
  }

  if (param.type === 'ObjectPattern') {
    return getAstObjectPattern(param, canComment)
  }

  if (param.type === 'ObjectExpression') {
    return '{}'
  }

  if (param.type === 'ArrayExpression') {
    return '[]'
  }

  if (param.type === 'AssignmentPattern') {
    return getAstAssignmentPattern(param, canComment)
  }

  console.error('param:', param)
  throw new Error('astParser - getAstParam(): unknown param case')
}

function getParams (params, canComment = true) {
  if (params === void 0) return ''

  const list = params.map(param => getAstParam(param, canComment))
  return list.join(', ') || ''
}

const rawValueTypeList = [
  { type: 'Number', regex: /^-?\d/ },
  { type: 'String', regex: /^'[^']+'$/ },
  { type: 'Boolean', regex: /^true|false$/ },
  { type: 'RegExp', regex: /^\/.*\/[gimuy]*$/ },
  { type: 'null', regex: /^null$/ },
  { type: 'undefined', regex: /^undefined$/ }
]

function extractVariableType (init, isExported) {
  if (init === void 0 || init === null) return 'undefined'

  if (init.type === 'ArrayExpression') return 'Array'
  if (init.type === 'ObjectExpression') return 'Object'

  if (
    init.type === 'FunctionExpression'
    || init.type === 'ArrowFunctionExpression'
  ) {
    // we ended up with a function instead of variable
    // after a ConditionalExpression
    return parseFunction({
      declaration: init,
      isExported
    })
  }

  if (init.type === 'ClassExpression') {
    // we ended up with a class instead of variable
    // after a ConditionalExpression
    return parseClass({
      declaration: init,
      isExported
    })
  }

  if (init.type === 'ConditionalExpression') {
    const consequentType = extractVariableType(init.consequent, isExported)

    return [ 'null', 'undefined' ].includes(consequentType)
      ? extractVariableType(init.alternate, isExported)
      : consequentType
  }

  const { raw } = init
  if (raw === void 0) return 'undefined'

  for (const { type, regex } of rawValueTypeList) {
    if (regex.test(raw)) return type
  }

  if (
    init.type === 'UnaryExpression'
    && init.operator === 'void'
    && init.argument.raw === '0'
  ) {
    return 'undefined'
  }

  if (
    init.type === 'MemberExpression'
    && init.object.name === 'document'
  ) {
    return 'Element'
  }
}

function extractValueType (raw) {
  for (const { type, regex } of rawValueTypeList) {
    if (regex.test(raw)) return type
  }
  return 'undefined'
}

function parseVar ({ declaration, isExported }) {
  const type = extractVariableType(declaration.init, isExported)

  // we ended up with something else other than a variable...
  if (Object(type) === type) {
    type.def.accessor = declaration.id.name
    return type
  }

  return {
    jsonKey: 'variables',
    isExported,
    def: {
      type,
      accessor: declaration.id.name
    }
  }
}

function parseClass ({ declaration, isExported }) {
  const constructorEntry = declaration.body.body.find(
    entry => entry.kind === 'constructor'
  )

  return {
    jsonKey: 'classes',
    isExported,
    def: {
      accessor: declaration.id.name,
      constructorParams: getParams(constructorEntry?.value.params)
    }
  }
}

function parseFunction ({ declaration, isExported }) {
  return {
    jsonKey: 'functions',
    isExported,
    def: {
      accessor: declaration.id?.name,
      params: getParams(declaration.params)
    }
  }
}

function injectVariableDeclaration ({
  content,
  declaration,
  isExported
}) {
  if (declaration.id.type === 'ObjectPattern') {
    // example: const { notPassiveCapture } = listenOpts
    declaration.id.properties.forEach(property => {
      content[ property.key.name ] = parseVar({
        // we fake the declaration to match a "regular" variable one
        declaration: {
          id: { name: property.key.name }
        },
        isExported
      })
    })
  }
  else if (declaration.id.name !== void 0) {
    content[ declaration.id.name ] = parseVar({
      declaration,
      isExported
    })
  }
}

export function getImportStatement ({ ctx, json }) {
  const list = []
  if (json.defaultExport === true) {
    list.push(ctx.camelCaseName)
  }
  if (json.namedExports.size !== 0) {
    list.push(`{ ${ Array.from(json.namedExports).join(', ') } }`)
  }
  return `import ${ list.join(', ') } from './${ ctx.localName }'`
}

export function readAstJson (ctx) {
  const { body } = Parser.parse(ctx.targetContent, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const nodeList = body.filter(({ type }) => astNodeTypes.includes(type))
  const content = {}

  nodeList.forEach(node => {
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration === null && node.specifiers !== void 0) {
        // export { ... }

        node.specifiers.forEach(specifier => {
          const target = content[ specifier.exported.name ]

          if (target === void 0) {
            console.error(
              'AST: unregistered ExportNamedDeclaration > specifiers:',
              specifier.exported.name,
              'for:',
              ctx.targetAbsolute
            )
            console.error('specifier', specifier)
            console.error('ctx', ctx)
            throw new Error('readAstJson > unregistered ExportNamedDeclaration > specifiers')
          }

          target.isExported = true
        })

        return
      }

      if (node.declaration?.type === void 0) {
        console.error(
          'AST: unknown ExportNamedDeclaration > declaration for:',
          ctx.targetAbsolute
        )
        console.error('declaration', node.declaration)
        console.error('ctx', ctx)
        throw new Error('readAstJson > unknown ExportNamedDeclaration > declaration')
      }

      if (node.declaration.type === 'VariableDeclaration') {
        node.declaration.declarations.forEach(declaration => {
          if (
            declaration.type === 'VariableDeclaration'
            || declaration.type === 'VariableDeclarator'
          ) {
            injectVariableDeclaration({
              content,
              declaration,
              isExported: true
            })
          }
          else if (declaration.type === 'FunctionDeclaration') {
            content[ declaration.id.name ] = parseFunction({
              declaration,
              isExported: true
            })
          }
          else {
            console.error(
              'AST: unknown ExportNamedDeclaration > VariableDeclaration > type:',
              declaration.type,
              'for:',
              ctx.targetAbsolute
            )
            console.error('declaration', declaration)
            console.error('ctx', ctx)
            throw new Error('readAstJson > unknown ExportNamedDeclaration > VariableDeclaration > type')
          }
        })
      }
      else if (node.declaration.type === 'ClassDeclaration') {
        content[ node.declaration.id.name ] = parseClass({
          declaration: node.declaration,
          isExported: true
        })
      }
      else if (node.declaration.type === 'FunctionDeclaration') {
        content[ node.declaration.id.name ] = parseFunction({
          declaration: node.declaration,
          isExported: true
        })
      }
    }
    else if (node.type === 'VariableDeclaration') {
      node.declarations.forEach(declaration => {
        injectVariableDeclaration({
          content,
          declaration,
          isExported: false
        })
      })
    }
    else if (node.type === 'FunctionDeclaration') {
      content[ node.id.name ] = parseFunction({
        declaration: node,
        isExported: false
      })
    }
  })

  if (
    Object.keys(content).some(
      name => content[ name ].def.accessor === void 0
    )
  ) {
    console.error('AST: missing accessor for:', ctx.targetAbsolute)
    console.error('content', content)
    console.error('ctx', ctx)
    throw new Error('readAstJson > missing accessor')
  }

  const json = {
    defaultExport: void 0,
    namedExports: new Set(),
    variables: {},
    classes: {},
    functions: {}
  }

  // now we fill the json object with the default export stuff
  nodeList.forEach(({ type, declaration }) => {
    if (type !== 'ExportDefaultDeclaration') return

    // export default { ... }
    if (declaration.type === 'ObjectExpression') {
      json.defaultExport = true

      declaration.properties.forEach(prop => {
        const { name } = prop.key
        const { type } = prop.value

        // <key>: 'str' | 123 | true | /regex/ | etc...
        if (type === 'Literal') {
          json.variables[ name ] = {
            // should match parseVar().def
            type: extractValueType(prop.value.raw),
            accessor: `${ ctx.camelCaseName }.${ name }`
          }
          return
        }

        // <key>: []
        if (type === 'ArrayExpression') {
          json.variables[ name ] = {
            // should match parseVar().def
            type: 'Array',
            accessor: `${ ctx.camelCaseName }.${ name }`
          }
          return
        }

        if (type === 'ObjectExpression') {
          json.variables[ name ] = {
            // should match parseVar().def
            type: 'Object',
            accessor: `${ ctx.camelCaseName }.${ name }`
          }
          return
        }

        // <key>: fn () {}
        if (
          type === 'FunctionDeclaration'
          || type === 'ArrowFunctionExpression'
          || type === 'FunctionExpression'
        ) {
          json.functions[ name ] = {
            // should match parseFunction().def
            accessor: `${ ctx.camelCaseName }.${ name }`,
            params: getParams(prop.value.params)
          }

          return
        }

        // <key>: class X {}
        if (type === 'ClassDeclaration') {
          json.classes[ name ] = {
            ...parseClass({
              declaration: prop.value,
              isExported: false
            }).def,

            accessor: ctx.camelCaseName
          }

          return
        }

        const { name: ref } = (prop.value || prop.key)

        if (content[ ref ] === void 0) {
          // <key>: <some_imported_identifier>
          if (type === 'Identifier') {
            json.variables[ name ] = { // should match parseVar().def
              // we can't infer type without significant additional work
              type: 'Any',
              accessor: `${ ctx.camelCaseName }.${ name }`
            }
            return
          }

          console.error(
            'AST: unregistered ExportDefaultDeclaration > ObjectExpression > properties:',
            name,
            'for:', ctx.targetAbsolute
          )
          console.error('prop', prop)
          console.error('ctx', ctx)
          throw new Error('readAstJson > unregistered ExportDefaultDeclaration > ObjectExpression > properties')
        }

        const { jsonKey, def } = content[ ref ]
        delete content[ ref ]

        def.accessor = `${ ctx.camelCaseName }.${ name }`
        json[ jsonKey ][ name ] = def
      })
    }
    // export default function () {}
    else if (
      declaration.type === 'FunctionDeclaration'
      || declaration.type === 'ArrowFunctionExpression'
    ) {
      json.defaultExport = true
      json.functions.default = {
        ...parseFunction({ declaration, isExported: false }).def,
        accessor: ctx.camelCaseName
      }
    }
    // export default class X {}
    else if (declaration.type === 'ClassDeclaration') {
      json.defaultExport = true
      json.classes.default = {
        ...parseClass({ declaration, isExported: false }).def,
        accessor: ctx.camelCaseName
      }
    }
    // export default fn(...)
    else if (declaration.type === 'CallExpression') {
      json.defaultExport = true
      json.variables.default = {
        // we can't infer type without significant additional work
        type: 'Any',
        accessor: ctx.camelCaseName
      }
    }
  })

  // is there anything else name exported?
  Object.keys(content).forEach(name => {
    const { jsonKey, isExported, def } = content[ name ]
    if (isExported === true) {
      json[ jsonKey ][ name ] = def
      json.namedExports.add(name)
    }
  })

  const hasVariables = Object.keys(json.variables).length !== 0
  const hasClasses = Object.keys(json.classes).length !== 0
  const hasFunctions = Object.keys(json.functions).length !== 0

  if (
    hasVariables === false
    && hasClasses === false
    && hasFunctions === false
  ) {
    console.error('AST: no variables, classes or functions found for:', ctx.targetAbsolute)
    console.error('ctx', ctx)
    throw new Error('readAstJson > no variables, classes or functions found')
  }

  if (hasVariables === false) {
    delete json.variables
  }

  if (hasClasses === false) {
    delete json.classes
  }

  if (hasFunctions === false) {
    delete json.functions
  }

  return json
}
