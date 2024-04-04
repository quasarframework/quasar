import { Parser } from 'acorn'

const astNodeTypes = [
  'ExportNamedDeclaration', 'ExportDefaultDeclaration',
  'VariableDeclaration', 'ClassDeclaration', 'FunctionDeclaration'
]

function getParams (params, targetContent) {
  const list = params.map(param => {
    const content = targetContent.slice(param.start, param.end)

    if (/^([{[]) .* $1}$/.test(content) === true) {
      return content
    }

    const equalIndex = content.lastIndexOf('=')

    if (equalIndex !== -1) {
      const name = content.substring(0, equalIndex).trim()
      const value = content.substring(equalIndex + 2).trim()

      return `/* ${ name.trim() } */ ${ value.trim() }`
    }

    return content
  })

  return list.join(', ') || ''
}

function parseVar ({ accessor, isExported = false }) {
  return {
    jsonKey: 'variables',
    isExported,
    def: {
      accessor
    }
  }
}

function parseClass ({ declaration, accessor, targetContent, isExported = false }) {
  const constructorEntry = declaration.body.body.find(entry => entry.kind === 'constructor')
  const params = getParams(constructorEntry?.value.params, targetContent)

  return {
    jsonKey: 'classes',
    isExported,
    def: {
      accessor,
      constructorParams: params
    }
  }
}

function parseFunction ({ declaration, accessor, targetContent, isExported = false }) {
  return {
    jsonKey: 'functions',
    isExported,
    def: {
      accessor,
      params: getParams(declaration.params, targetContent)
    }
  }
}

export function getImportStatement ({ ctx, json }) {
  const list = []
  if (json.defaultExport === true) {
    list.push(ctx.pascalName)
  }
  if (json.namedExports.size !== 0) {
    list.push(`{ ${ Array.from(json.namedExports).join(', ') } }`)
  }
  return `import ${ list.join(', ') } from './${ ctx.localName }'`
}

export function readAstJson (ctx) {
  const { targetContent } = ctx

  const { body } = Parser.parse(targetContent, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const nodeList = body.filter(({ type }) => astNodeTypes.includes(type))
  const content = {}

  nodeList.forEach(node => {
    if (node.type === 'ExportNamedDeclaration') {
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
            content[ declaration.id.name ] = parseVar({ isExported: true })
          }
          else if (declaration.type === 'FunctionDeclaration') {
            content[ declaration.id.name ] = parseFunction({
              declaration,
              targetContent,
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
          targetContent,
          isExported: true
        })
      }
      else if (node.declaration.type === 'FunctionDeclaration') {
        content[ node.declaration.id.name ] = parseFunction({
          declaration: node.declaration,
          targetContent,
          isExported: true
        })
      }
    }
    else if (node.type === 'VariableDeclaration') {
      node.declarations.forEach(declaration => {
        content[ declaration.id.name ] = parseVar({})
      })
    }
    else if (node.type === 'FunctionDeclaration') {
      content[ node.id.name ] = parseFunction({ declaration: node, targetContent })
    }
  })

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

    // export { ... }
    if (declaration.type === 'ObjectExpression') {
      declaration.properties.forEach(prop => {
        const { name } = prop.key
        const { name: ref } = (prop.value || prop.key)

        if (content[ ref ] === void 0) {
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

        def.accessor = `${ ctx.pascalName }.${ name }`
        json[ jsonKey ][ name ] = def
        json.defaultExport = true
      })
    }
    // export default function () {}
    else if (
      declaration.type === 'FunctionDeclaration'
      || declaration.type === 'ArrowFunctionExpression'
    ) {
      const { def } = parseFunction({
        declaration,
        accessor: ctx.pascalName,
        targetContent
      })

      json.functions.default = def
      json.defaultExport = true
    }
    // export default class X {}
    else if (declaration.type === 'ClassDeclaration') {
      const { def } = parseClass({
        declaration,
        accessor: ctx.pascalName,
        targetContent
      })

      json.classes.default = def
      json.defaultExport = true
    }
  })

  // is there anything else name exported?
  Object.keys(content).forEach(name => {
    const { jsonKey, isExported, def } = content[ name ]
    if (isExported === true) {
      json[ jsonKey ][ name ] = def
      def.accessor = name
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
