import fse from 'fs-extra'
import { Parser } from 'acorn'

const identifiers = {
  variables: {
    categoryId: '[Variables]',
    getTestId: name => `[(variable)${ name }]`,
    createTestFn: createVariableTest
  },

  classes: {
    categoryId: '[Classes]',
    getTestId: name => `[(class)${ name }]`,
    createTestFn: createClassTest
  },

  functions: {
    categoryId: '[Functions]',
    getTestId: name => `[(function)${ name }]`,
    createTestFn: createFunctionTest
  }
}

function createVariableTest ({ testId, jsonEntry }) {
  return `
    describe('${ testId }', () => {
      test.todo('is defined correctly', () => {
        // TODO: do something with ${ jsonEntry.accessor }
      })
    })\n`
}

function createClassTest ({ testId, jsonEntry }) {
  return `
    describe('${ testId }', () => {
      test.todo('can be instantiated', () => {
        const instance = new ${ jsonEntry.accessor }(${ jsonEntry.constructorParams })
        // TODO: do something with "instance"
      })
    })\n`
}

function createFunctionTest ({ testId, jsonEntry }) {
  return `
    describe('${ testId }', () => {
      test.todo('does not error out', () => {
        expect(() => ${ jsonEntry.accessor }(${ jsonEntry.params })).not.toThrow()
      })

      test.todo('has correct return value', () => {
        const result = ${ jsonEntry.accessor }(${ jsonEntry.params })
        expect(result).toBeDefined()
      })
    })\n`
}

const astNodeTypes = [
  'ExportNamedDeclaration', 'ExportDefaultDeclaration',
  'VariableDeclaration', 'ClassDeclaration', 'FunctionDeclaration'
]

function parseVar ({ accessor, isExported = false }) {
  return {
    jsonKey: 'variables',
    isExported,
    def: { accessor }
  }
}

function parseClass ({ declaration, accessor, fileContent, isExported = false }) {
  const constructorEntry = declaration.body.body.find(entry => entry.kind === 'constructor')
  const params = constructorEntry?.value.params
    .map(param => fileContent.slice(param.start, param.end))
    .join(', ')

  return {
    jsonKey: 'classes',
    isExported,
    def: {
      accessor,
      constructorParams: params || ''
    }
  }
}

function parseFunction ({ declaration, accessor, fileContent, isExported = false }) {
  return {
    jsonKey: 'functions',
    isExported,
    def: {
      accessor,
      params: declaration.params
        .map(param => fileContent.slice(param.start, param.end))
        .join(', ')
    }
  }
}

function getImportStatement (json, ctx) {
  const list = []
  if (json.defaultExport === true) {
    list.push(ctx.pascalName)
  }
  if (json.namedExports.size !== 0) {
    list.push(`{ ${ Array.from(json.namedExports).join(', ') } }`)
  }
  return `import ${ list.join(', ') } from './${ ctx.localName }'`
}

function getJson (ctx) {
  const fileContent = fse.readFileSync(ctx.targetAbsolute, 'utf8')

  const { body } = Parser.parse(fileContent, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const nodeList = body.filter(({ type }) => astNodeTypes.includes(type))
  const content = {}

  nodeList.forEach(node => {
    if (node.type === 'ExportNamedDeclaration') {
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
              fileContent,
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
            console.error(declaration)
            process.exit(1)
          }
        })
      }
      else if (node.declaration.type === 'ClassDeclaration') {
        content[ node.declaration.id.name ] = parseClass({
          declaration: node.declaration,
          fileContent,
          isExported: true
        })
      }
      else if (node.declaration.type === 'FunctionDeclaration') {
        content[ node.declaration.id.name ] = parseFunction({
          declaration: node.declaration,
          fileContent,
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
      content[ node.id.name ] = parseFunction({ declaration: node, fileContent })
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
          console.error(prop)
          process.exit(1)
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
        fileContent
      })

      json.functions.default = def
      json.defaultExport = true
    }
    // export default class X {}
    else if (declaration.type === 'ClassDeclaration') {
      const { def } = parseClass({
        declaration,
        accessor: ctx.pascalName,
        fileContent
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
    process.exit(1)
  }

  return {
    importStatement: getImportStatement(json, ctx),
    variables: hasVariables ? json.variables : void 0,
    classes: hasClasses ? json.classes : void 0,
    functions: hasFunctions ? json.functions : void 0
  }
}

export default {
  identifiers,
  getJson,
  getFileHeader: ({ json }) => {
    return [
      'import { describe, test, expect } from \'vitest\'',
      '',
      json.importStatement
    ].join('\n')
  }
}
