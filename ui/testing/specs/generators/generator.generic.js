import { readAstJson, getImportStatement } from '../astParser.js'
import { testIndent, getTypeTest } from '../specs.utils.js'

const identifiers = {
  variables: {
    categoryId: '[Variables]',
    testIdToken: 'variable',
    getTestId: name => `[(variable)${ name }]`,
    createTestFn: createVariableTest
  },

  classes: {
    categoryId: '[Classes]',
    testIdToken: 'class',
    getTestId: name => `[(class)${ name }]`,
    createTestFn: createClassTest
  },

  functions: {
    categoryId: '[Functions]',
    testIdToken: 'function',
    getTestId: name => `[(function)${ name }]`,
    createTestFn: createFunctionTest
  }
}

export function createVariableTest ({ testId, jsonEntry }) {
  const typeTest = getTypeTest({
    jsonEntry: { type: jsonEntry.type },
    ref: jsonEntry.accessor,
    indent: testIndent
  })

  const lengthTest = jsonEntry.type === 'Array'
    ? `\n${ testIndent }expect(${ jsonEntry.accessor }).not.toHaveLength(0)`
    : (
        jsonEntry.type === 'Object'
          ? `\n${ testIndent }expect(Object.keys(${ jsonEntry.accessor })).not.toHaveLength(0)`
          : ''
      )

  return `
    describe('${ testId }', () => {
      test.todo('is defined correctly', () => {
        ${ typeTest }${ lengthTest }
      })
    })\n`
}

export function createClassTest ({ testId, jsonEntry }) {
  return `
    describe('${ testId }', () => {
      test.todo('can be instantiated', () => {
        const instance = new ${ jsonEntry.accessor }(${ jsonEntry.constructorParams })

        // TODO: do something with "instance"
        expect(instance).toBeDefined() // this is here for linting only
      })
    })\n`
}

export function createFunctionTest ({ testId, jsonEntry }) {
  const lint = jsonEntry.params
    ? `// eslint-disable-next-line no-undef\n${ testIndent }`
    : ''

  return `
    describe('${ testId }', () => {
      test.todo('has correct return value', () => {
        ${ lint }const result = ${ jsonEntry.accessor }(${ jsonEntry.params })
        expect(result).toBeDefined()
      })
    })\n`
}

export default {
  identifiers,
  getJson: readAstJson,
  getFileHeader: ({ ctx, json }) => {
    return [
      'import { describe, test, expect } from \'vitest\'',
      '',
      getImportStatement({ ctx, json })
    ].join('\n')
  }
}
