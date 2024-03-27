/**
 * !!!
 *  Also update /ui/build/build.api.js if
 *  JSON root props change
 * !!!
 */

import {
  toPascalCase,
  getDefTesting,
  testIndent,
  getComponentMount,
  filterDefExceptionTypes
} from '../specs.utils.js'

const identifiers = {
  quasarConfOptions: {
    categoryId: '[QuasarConfOptions]',
    getTestId: name => `[(quasarConfOption)${ name }]`,
    createTestFn: createQuasarConfOption
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

const jsonKeyList = Object.keys(identifiers)
const categoryList = jsonKeyList.map(key => identifiers[ key ].categoryId)

function createQuasarConfOption () {
  return `
    test('definition', () => {
      //
    })
`
}

function getPropTest (name, jsonEntry, ctx) {
  const type = filterDefExceptionTypes(jsonEntry.type)
  if (type === void 0) return ''

  // example: QTable > props > selection
  if (jsonEntry.values !== void 0) {
    const mountOperation = getComponentMount({ ctx, prop: name })
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
    const mountOperation = getComponentMount({ ctx, prop: name })
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
  const mountOperation = getComponentMount({
    ctx,
    prop: name
  })

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
  ctx
}) {
  const propTest = getPropTest(
    name,
    jsonEntry,
    ctx
  )

  return `
    describe('${ testId }', () => {
      test('is defined', () => {
        expect(${ ctx.pascalName }.props.${ pascalName }).toBeDefined()
      })${ propTest }
    })
`
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
        ${ getComponentMount({ ctx, slot: { name, slotFn } }) }

        expect(wrapper.html()).toContain(slotContent)${ scopeTests }
      })
    })
`
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
        ${ getComponentMount({ ctx }) }

        // TODO: trigger the event

        const eventList = wrapper.emitted()
        expect(eventList).toHaveProperty('${ pascalName }')
        expect(${ varName }).toHaveLength(1)

        ${ paramsTest }
      })
    })
`
}

function createMethodTest ({
  pascalName,
  testId,
  jsonEntry,
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
        ${ getComponentMount({ ctx }) }

        ${ typeTest }
      })
    })
`
}

function createComputedPropTest ({
  pascalName,
  testId,
  jsonEntry,
  ctx
}) {
  const { expectType } = getDefTesting(jsonEntry)
  return `
    describe('${ testId }', () => {
      test.todo('should be exposed', () => {
        ${ getComponentMount({ ctx }) }

        ${ expectType('wrapper.vm.' + pascalName) }
      })
    })
`
}

function generateSection (ctx, jsonPath) {
  const { json } = ctx
  if (json === void 0) return null

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
    pascalName: toPascalCase(entryName),
    testId,
    jsonEntry,
    ctx
  })
}

function createTestFileContent (ctx) {
  const { json } = ctx
  let acc = 'import { mount } from \'@vue/test-utils\''
    + '\nimport { describe, test, expect } from \'vitest\''
    + `\n\nimport ${ ctx.pascalName } from './${ ctx.localName }'`
    + `\n\ndescribe('${ ctx.testTreeRootId }', () => {`

  jsonKeyList.forEach(jsonKey => {
    const categoryJson = json[ jsonKey ]
    if (categoryJson === void 0) return

    const { categoryId, getTestId, createTestFn, shouldIgnoreEntry } = identifiers[ jsonKey ]

    acc += `\n  describe('${ categoryId }', () => {`
    Object.keys(categoryJson).forEach(entryName => {
      const testId = getTestId(entryName)
      const jsonEntry = categoryJson[ entryName ]

      if (jsonEntry.internal === true) return

      const scope = {
        name: entryName,
        pascalName: toPascalCase(entryName),
        testId,
        jsonEntry,
        ctx
      }

      if (shouldIgnoreEntry?.(scope) !== true) {
        acc += createTestFn(scope)
      }
    })
    acc += '  })\n'
  })

  return acc + '})\n'
}

function getMissingTests (ctx) {
  const acc = []
  const { json, testFile } = ctx

  jsonKeyList.forEach(jsonKey => {
    const categoryJson = json[ jsonKey ]
    if (categoryJson === void 0) return

    const { categoryId, getTestId, createTestFn, shouldIgnoreEntry } = identifiers[ jsonKey ]

    Object.keys(categoryJson).forEach(entryName => {
      const testId = getTestId(entryName)

      if (testFile.ignoreCommentIds.includes(testId)) return
      if (testFile.testTree[ ctx.testTreeRootId ].children[ categoryId ]?.children[ testId ] !== void 0) return

      const jsonEntry = categoryJson[ entryName ]

      if (jsonEntry.internal === true) return

      const scope = {
        name: entryName,
        pascalName: toPascalCase(entryName),
        testId,
        jsonEntry,
        ctx
      }

      if (shouldIgnoreEntry?.(scope) !== true) {
        acc.push({
          testId,
          categoryId,
          content: createTestFn(scope)
        })
      }
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
