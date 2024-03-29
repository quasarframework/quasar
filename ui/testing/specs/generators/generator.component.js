/**
 * !!!
 *  Also update /ui/build/build.api.js if
 *  JSON root props change
 * !!!
 */

import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  getDefTesting,
  testIndent,
  getComponentMount,
  filterDefExceptionTypes
} from '../specs.utils.js'

const identifiers = {
  quasarConfOptions: {
    categoryId: '[QuasarConfOptions]',
    createTestFn: createQuasarConfOptions
  },

  props: {
    categoryId: '[Props]',
    getTestId: name => `[(prop)${ name }]`,
    createTestFn: createPropTest
  },

  slots: {
    categoryId: '[Slots]',
    getTestId: name => `[(slot)${ name }]`,
    createTestFn: createSlotTest,
    shouldIgnoreEntry: ({ name }) => (
      name === '...' // example: QBtnToggle
      || name[ 0 ] === '[' // example: QEditor
    )
  },

  events: {
    categoryId: '[Events]',
    getTestId: name => `[(event)${ name }]`,
    createTestFn: createEventTest
  },

  methods: {
    categoryId: '[Methods]',
    getTestId: name => `[(method)${ name }]`,
    createTestFn: createMethodTest
  },

  computedProps: {
    categoryId: '[Computed props]',
    getTestId: name => `[(computedProp)${ name }]`,
    createTestFn: createComputedPropTest
  }
}

function createQuasarConfOptions ({ categoryId, _jsonEntry, _ctx }) {
  // TODO: implement
  return `
  describe('${ categoryId }', () => {
    test('definition', () => {
      //
    })
  })\n`
}

function getPropTest ({ name, jsonEntry, json, ctx }) {
  const type = filterDefExceptionTypes(jsonEntry.type)
  if (type === void 0) return ''

  // example: QTable > props > selection
  if (jsonEntry.values !== void 0) {
    const mountOperation = getComponentMount({ ctx, json, prop: name })
    const eachList = jsonEntry.values.map(val => {
      return `[ ${ val } ]`
    }).join(`,\n${ testIndent }`)

    return `\n
      test.todo.each([
        ${ eachList }
      ])('value %s has effect', propVal => {
        ${ mountOperation }

        // TODO: test the effect of the prop
      })`
  }

  // example: QTable > props > virtual-scroll-slice-size
  if (Array.isArray(type) === true) {
    const mountOperation = getComponentMount({ ctx, json, prop: name })
    const eachIndent = testIndent + '  '
    const eachList = type.map(t => {
      const { createValue } = getDefTesting({ ...jsonEntry, type: t })
      return `[ '${ t }', ${ createValue(eachIndent) } ]`
    }).join(`,\n${ testIndent }`)

    return `\n
      test.todo.each([
        ${ eachList }
      ])('type %s has effect', (_, propVal) => {
        ${ mountOperation }

        // TODO: test the effect of the prop
      })`
  }

  const { createValue } = getDefTesting(jsonEntry)
  const mountOperation = getComponentMount({ ctx, json, prop: name })

  return `\n
      test.todo('type ${ type } has effect', () => {
        ${ jsonEntry.sync === true ? 'let' : 'const' } propVal = ${ createValue() }
        ${ mountOperation }

        // TODO: test the effect of the prop
      })`
}

function createPropTest ({
  name,
  pascalName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const propTest = getPropTest({ name, jsonEntry, json, ctx })

  return `
    describe('${ testId }', () => {
      test('is defined', () => {
        expect(${ ctx.pascalName }.props.${ pascalName }).toBeDefined()
      })${ propTest }
    })\n`
}

function getSlotScope (jsonEntry) {
  if (jsonEntry.scope === void 0) return {
    slotFn: '() => slotContent',
    scopeTests: ''
  }

  const { expectType } = getDefTesting({ type: 'Object', definition: jsonEntry.scope })
  return {
    slotFn: 'scope => {'
      + `\n${ testIndent }      slotScope = scope`
      + `\n${ testIndent }      return slotContent`
      + `\n${ testIndent }    }`,

    scopeTests: (
      `\n\n${ testIndent }`
      + expectType('slotScope')
    )
  }
}

function createSlotTest ({
  name,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const { slotFn, scopeTests } = getSlotScope(jsonEntry)

  return `
    describe('${ testId }', () => {
      test.todo('renders the content', () => {
        ${
          jsonEntry.scope !== void 0
            ? `let slotScope\n${ testIndent }`
            : ''
        }const slotContent = 'some-slot-content'
        ${ getComponentMount({ ctx, json, slot: { name, slotFn } }) }

        expect(wrapper.html()).toContain(slotContent)${ scopeTests }
      })
    })\n`
}

function getEventParamsTest (jsonEntry, varName) {
  const params = Object.keys(jsonEntry.params).join(', ')
  const tests = Object.keys(jsonEntry.params).map(paramName => {
    const { expectType } = getDefTesting(jsonEntry.params[ paramName ])
    return `\n${ testIndent }${ expectType(paramName) }`
  }).join('')

  return `const [ ${ params } ] = ${ varName }${ tests }`
}

function createEventTest ({
  pascalName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const nameAccessor = pascalName.indexOf(':') === -1
    ? `.${ pascalName }`
    : `[ '${ pascalName }' ]` // example: 'update:modelValue'

  const varName = `eventList${ nameAccessor }`
  const paramsTest = jsonEntry.params !== void 0
    ? getEventParamsTest(jsonEntry, `${ varName }[ 0 ]`)
    : `expect(${ varName }[ 0 ]).toHaveLength(0)`

  return `
    describe('${ testId }', () => {
      test('is defined', () => {
        expect(${ ctx.pascalName }.emits).toContain('${ pascalName }')
      })

      test.todo('is emitting', () => {
        ${ getComponentMount({ ctx, json }) }

        // TODO: trigger the event

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('${ pascalName }')
        expect(${ varName }).toHaveLength(1)

        ${ paramsTest }
      })
    })\n`
}

function createMethodTest ({
  pascalName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const { expectType } = getDefTesting({ ...jsonEntry, type: 'Function' })
  const typeTest = expectType(
    `wrapper.vm.${ pascalName }`,
    { withCall: true }
  )

  return `
    describe('${ testId }', () => {
      test.todo('should be callable', () => {
        ${ getComponentMount({ ctx, json }) }

        ${ typeTest }
      })
    })\n`
}

function createComputedPropTest ({
  pascalName,
  testId,
  jsonEntry,
  json,
  ctx
}) {
  const { expectType } = getDefTesting(jsonEntry)
  return `
    describe('${ testId }', () => {
      test.todo('should be exposed', () => {
        ${ getComponentMount({ ctx, json }) }

        ${ expectType('wrapper.vm.' + pascalName) }
      })
    })\n`
}

export default {
  identifiers,
  getJson: readAssociatedJsonFile,
  getFileHeader: ({ ctx }) => {
    return [
      'import { mount } from \'@vue/test-utils\'',
      'import { describe, test, expect } from \'vitest\'',
      '',
      `import ${ ctx.pascalName } from './${ ctx.localName }'`
    ].join('\n')
  }
}
