import fse from 'fs-extra'
import { Parser } from 'acorn'

const identifiers = {
  variables: {
    categoryId: '[Variables]',
    getTestId: name => `[(variable)${ name }]`,
    createTestFn: createVariableTest
  },

  functions: {
    categoryId: '[Functions]',
    getTestId: name => `[(function)${ name }]`,
    createTestFn: createFunctionTest
  }
}

const jsonKeyList = Object.keys(identifiers)
const categoryList = jsonKeyList.map(key => identifiers[ key ].categoryId)

function createVariableTest ({ name, testId, ctx }) {
  return `
    describe('${ testId }', () => {
      test.todo('is defined correctly', () => {
        // TODO: do something with ${ ctx.pascalName }.${ name }
      })
    })
`
}

function createFunctionTest ({ name, testId, jsonEntry, ctx }) {
  const callName = jsonEntry.name === 'default'
    ? ctx.pascalName
    : `${ ctx.pascalName }.${ name }`

  const callParams = jsonEntry.params

  return `
    describe('${ testId }', () => {
      test.todo('does not error out', () => {
        expect(() => ${ callName }(${ callParams })).not.toThrow()
      })

      test.todo('has correct return value', () => {
        const result = ${ callName }(${ callParams })
        expect(result).toBeDefined()
      })
    })
`
}

const astNodeTypes = [
  'ExportNamedDeclaration', 'ExportDefaultDeclaration',
  'VariableDeclaration', 'FunctionDeclaration'
]

function injectVar (declaration, acc) {
  const { name } = declaration.id

  acc[ name ] = {
    injectInto: 'variables',
    def: { name }
  }
}

function injectFunction (declaration, acc, content) {
  const { name } = declaration.id

  acc[ name ] = {
    injectInto: 'functions',
    def: {
      name,
      params: declaration.params
        .map(param => content.slice(param.start, param.end))
        .join(', ')
    }
  }
}

function getJson (ctx) {
  /**
   * We expect the content to default export something,
   * be that an Object (with references to variables or functions)
   * or directly a function.
   */
  const content = fse.readFileSync(ctx.targetAbsolute, 'utf8')

  const { body } = Parser.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  })

  const nodeList = body.filter(({ type }) => astNodeTypes.includes(type))

  const acc = {}

  nodeList.forEach(node => {
    if (node.type === 'ExportNamedDeclaration') {
      if (node.declaration.type === 'VariableDeclaration') {
        node.declaration.declarations.forEach(declaration => {
          if (
            declaration.type === 'VariableDeclaration'
            || declaration.type === 'VariableDeclarator'
          ) {
            injectVar(declaration, acc)
          }
          else if (declaration.type === 'FunctionDeclaration') {
            injectFunction(declaration, acc, content)
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
      else if (node.declaration.type === 'FunctionDeclaration') {
        injectFunction(node.declaration, acc, content)
      }
    }
    else if (node.type === 'VariableDeclaration') {
      node.declarations.forEach(declaration => {
        injectVar(declaration, acc)
      })
    }
    else if (node.type === 'FunctionDeclaration') {
      injectFunction(node, acc, content)
    }
  })

  const json = {
    variables: {},
    functions: {}
  }

  // now we fill the json object
  nodeList.forEach(({ type, declaration }) => {
    if (type !== 'ExportDefaultDeclaration') return

    // export { ... }
    if (declaration.type === 'ObjectExpression') {
      declaration.properties.forEach(prop => {
        const { name } = prop.key

        if (acc[ name ] === void 0) {
          console.error(
            'AST: unregistered ExportDefaultDeclaration > ObjectExpression > properties:',
            name,
            'for:', ctx.targetAbsolute
          )
          console.error(prop)
          process.exit(1)
        }

        const { injectInto, def } = acc[ name ]

        json[ injectInto ][ name ] = def
      })
    }
    // export default function () {}
    else if (
      declaration.type === 'FunctionDeclaration'
      || declaration.type === 'ArrowFunctionExpression'
    ) {
      json.functions.default = {
        name: 'default',
        params: declaration.params
          .map(param => content.slice(param.start, param.end))
          .join(', ')
      }
    }
  })

  const hasVariables = Object.keys(json.variables).length !== 0
  const hasFunctions = Object.keys(json.functions).length !== 0

  if (hasVariables === false && hasFunctions === false) {
    console.error('AST: no variables or functions found for:', ctx.targetAbsolute)
    process.exit(1)
  }

  return {
    variables: hasVariables ? json.variables : void 0,
    functions: hasFunctions ? json.functions : void 0
  }
}

function generateSection (ctx, jsonPath) {
  const json = getJson(ctx)

  const [ jsonKey, entryName ] = jsonPath.split('.')
  if (jsonKey === void 0 || entryName === void 0) return null

  const categoryJson = json[ jsonKey ]
  if (categoryJson === void 0) return null

  const jsonEntry = categoryJson[ entryName ]
  if (jsonEntry === void 0) return null

  const { getTestId, createTestFn } = identifiers[ jsonKey ]
  const testId = getTestId(entryName)

  return createTestFn({
    name: entryName,
    testId,
    jsonEntry,
    ctx
  })
}

function createTestFileContent (ctx) {
  const json = getJson(ctx)
  let acc = 'import { describe, test, expect } from \'vitest\''
    + `\n\nimport ${ ctx.pascalName } from './${ ctx.localName }'`
    + `\n\ndescribe('${ ctx.testTreeRootId }', () => {`

  jsonKeyList.forEach(jsonKey => {
    const categoryJson = json[ jsonKey ]
    if (categoryJson === void 0) return

    const { categoryId, getTestId, createTestFn } = identifiers[ jsonKey ]

    acc += `\n  describe('${ categoryId }', () => {`
    Object.keys(categoryJson).forEach(entryName => {
      const testId = getTestId(entryName)
      const jsonEntry = categoryJson[ entryName ]

      acc += createTestFn({
        name: entryName,
        testId,
        jsonEntry,
        ctx
      })
    })
    acc += '  })\n'
  })

  return acc + '})\n'
}

function getMissingTests (ctx) {
  const acc = []
  const json = getJson(ctx)
  const { testFile } = ctx

  jsonKeyList.forEach(jsonKey => {
    const categoryJson = json[ jsonKey ]
    if (categoryJson === void 0) return

    const { categoryId, getTestId, createTestFn } = identifiers[ jsonKey ]

    Object.keys(categoryJson).forEach(entryName => {
      const testId = getTestId(entryName)

      if (testFile.ignoreCommentIds.includes(testId)) return
      if (testFile.testTree[ ctx.testTreeRootId ].children[ categoryId ]?.children[ testId ] !== void 0) return

      const jsonEntry = categoryJson[ entryName ]

      acc.push({
        testId,
        categoryId,
        content: createTestFn({
          name: entryName,
          testId,
          jsonEntry,
          ctx
        })
      })
    })
  })

  return acc.length !== 0
    ? acc
    : null
}

export default {
  categoryList,

  generateSection,
  createTestFileContent,
  getMissingTests
}
