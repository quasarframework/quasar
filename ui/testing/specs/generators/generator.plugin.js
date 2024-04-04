import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  getTypeTest,
  getFunctionCallTest
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
    return getTypeTest({
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
  const typeTest = getInjectionTest({ jsonEntry, json, ctx })

  return `
  describe('${ categoryId }', () => {
    test('is injected into $q', () => {
      let $q

      mount(
        defineComponent({
          template: '<div />',
          setup () {
            $q = useQuasar()
            return {}
          }
        })
      )

      ${ typeTest }
    })
  })\n`
}

function getReactivePropTest ({ ref }) {
  return `\n
      test.todo('is reactive', () => {
        const val = clone(${ ref })

        // TODO: trigger something to test reactivity

        expect(${ ref }).not.toStrictEqual(val)
      })`
}

function createPropTest ({
  pascalName,
  testId,
  jsonEntry,
  ctx
}) {
  const ref = `${ ctx.pascalName }.${ pascalName }`

  const typeTest = getTypeTest({ jsonEntry, ref })
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
  const opts = {
    jsonEntry: { ...jsonEntry, type: 'Function' },
    ref: `${ ctx.pascalName }.${ pascalName }`
  }

  const typeTest = getTypeTest(opts)
  const callTest = getFunctionCallTest(opts)

  return `
    describe('${ testId }', () => {
      test.todo('should be callable', () => {
        ${ typeTest }
        ${ callTest }

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
      'import { mount } from \'@vue/test-utils\''
    ]

    const vueImports = []
    const quasarImports = []

    if (json.injection !== void 0) {
      vueImports.push('defineComponent')
      quasarImports.push('useQuasar')
    }

    if (
      Object.keys(json.props || [])
        .some(prop => json.props[ prop ].reactive === true)
    ) {
      quasarImports.push('clone')
    }

    if (vueImports.length !== 0) {
      acc.push(
        `import { ${ vueImports.join(', ') } } from 'vue'`
      )
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
      'mount({ template: \'<div />\' })'
    )

    return acc.join('\n')
  }
}
