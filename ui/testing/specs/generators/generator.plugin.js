import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  getDefTesting,
  getExpectOneOfTypes
} from '../specs.utils.js'

const identifiers = {
  injection: {
    categoryId: '[Injection]',
    createTestFn: createInjection
  },

  props: {
    categoryId: '[Props]',
    getTestId: name => `[(prop)${ name }]`,
    createTestFn: createPropTest
  },

  methods: {
    categoryId: '[Methods]',
    getTestId: name => `[(method)${ name }]`,
    createTestFn: createMethodTest
  }
}

function getInjectionTest ({ jsonEntry, json, ctx }) {
  const target = jsonEntry.substring(3) // strip '$q.'

  if (json.props?.[ target ] !== void 0) {
    return getExpectOneOfTypes({
      jsonEntry: json.props[ target ],
      ref: jsonEntry
    })
  }

  const accessor = json.methods?.create !== void 0
    ? '.create'
    : ''

  return `expect(${ jsonEntry }).toBe(${ ctx.pascalName }${ accessor })`
}

function createInjection ({ categoryId, jsonEntry, json, ctx }) {
  const testType = getInjectionTest({ jsonEntry, json, ctx })

  return `
  describe('${ categoryId }', () => {
    test('is injected into $q', () => {
      let $q

      mount(
        defineComponent({
          template: '<div></div>',
          setup () {
            $q = useQuasar()
            return {}
          }
        })
      )

      ${ testType }
    })
  })\n`
}

function getReactivePropTest ({ jsonEntry, ref }) {
  const expectAction = jsonEntry.type === 'Array'
    ? 'toContainEqual'
    : 'toEqual'

  return `\n
      test.todo('is reactive', () => {
        const val = clone(${ ref })

        // TODO: trigger something to test reactivity

        expect(${ ref }).not.${ expectAction }(val)
      })`
}

function createPropTest ({
  pascalName,
  testId,
  jsonEntry,
  ctx
}) {
  const ref = `${ ctx.pascalName }.${ pascalName }`

  const typeTest = getExpectOneOfTypes({ jsonEntry, ref })
  const reactiveTest = jsonEntry.reactive === true
    ? getReactivePropTest({ jsonEntry, ref })
    : ''

  return `
    describe('${ testId }', () => {
      test('is correct type', () => {
        ${ typeTest }
      })${ reactiveTest }
    })\n`
}

function createMethodTest ({
  pascalName,
  testId,
  jsonEntry,
  ctx
}) {
  const { expectType } = getDefTesting({ ...jsonEntry, type: 'Function' })
  const typeTest = expectType(
    `${ ctx.pascalName }.${ pascalName }`,
    { withCall: true }
  )

  return `
    describe('${ testId }', () => {
      test.todo('should be callable', () => {
        ${ typeTest }

        // TODO: test the effect
      })
    })\n`
}

export default {
  identifiers,
  getJson: readAssociatedJsonFile,
  getFileHeader: ({ ctx, json }) => {
    const acc = [
      'import { describe, test, expect } from \'vitest\'',
      'import { mount } from \'@vue/test-utils\'',
      'import { defineComponent } from \'vue\''
    ]

    const quasarImports = []

    if (json.injection !== void 0) {
      quasarImports.push('useQuasar')
    }

    if (
      Object.keys(json.props || [])
        .some(prop => json.props[ prop ].reactive === true)
    ) {
      quasarImports.push('clone')
    }

    if (quasarImports.length !== 0) {
      acc.push(
        `import { ${ quasarImports.join(', ') } } from 'quasar'`
      )
    }

    acc.push(
      '',
      `import ${ ctx.pascalName } from './${ ctx.localName }'`,
      '',
      '// ensure the Quasar plugin gets installed:',
      'mount(defineComponent({ template: \'<div />\' }))'
    )

    return acc.join('\n')
  }
}
