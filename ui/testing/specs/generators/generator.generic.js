import { readAstJson, getImportStatement } from '../astParser.js'
import { testIndent } from '../specs.utils.js'

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
        expect(${ jsonEntry.accessor }).toBeDefined()

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
        expect(instance).toBeDefined() // this is here for linting only
      })
    })\n`
}

function createFunctionTest ({ testId, jsonEntry }) {
  const lint = jsonEntry.params
    ? `// eslint-disable-next-line\n${ testIndent }`
    : ''

  return `
    describe('${ testId }', () => {
      test.todo('does not error out', () => {
        ${ lint }expect(() => ${ jsonEntry.accessor }(${ jsonEntry.params })).not.toThrow()
      })

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
