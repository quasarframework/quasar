import readAssociatedJsonFile from '../readAssociatedJsonFile.js'
import {
  testIndent,
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
    testIdToken: 'prop',
    getTestId: name => `[(prop)${ name }]`,
    createTestFn: createPropTest
  },

  methods: {
    categoryId: '[Methods]',
    testIdToken: 'method',
    getTestId: name => `[(method)${ name }]`,
    createTestFn: createMethodTest
  }
}

/**
 * Make sure that the below array is in sync with
 * /ui/src/install-quasar.js > "autoInstalledPlugins"
 */
const autoInstalledPlugins = [
  'Platform',
  'Body',
  'Dark',
  'Screen',
  'History',
  'Lang',
  'IconSet'
]

function getInjectionTest ({ jsonEntry, json, ctx }) {
  const ref = `wrapper.vm.${ jsonEntry }`
  const target = jsonEntry.substring(3) // strip '$q.'

  if (json.props?.[ target ] !== void 0) {
    return getTypeTest({
      jsonEntry: json.props[ target ],
      ref,
      indent: testIndent
    })
  }

  // we're sniffing... we might make a wrong assumption
  if (json.methods?.create !== void 0) {
    return `expect(${ ctx.camelCaseName }.create).toBe(${ ref })`
  }

  return `expect(${ ctx.camelCaseName }).toMatchObject(${ ref })`
}

function createInjection ({ categoryId, jsonEntry, json, ctx }) {
  const typeTest = getInjectionTest({ jsonEntry, json, ctx })

  return `
  describe('${ categoryId }', () => {
    test('is injected into $q', () => {
      const wrapper = mountPlugin()
      ${ typeTest }
    })
  })\n`
}

function getReactivePropTest ({ ref }) {
  return `\n
      test.todo('is reactive', () => {
        mountPlugin()
        const val = clone(${ ref })

        // TODO: trigger something to test reactivity

        expect(${ ref }).not.toStrictEqual(val)
      })`
}

function createPropTest ({
  camelCaseName,
  testId,
  jsonEntry,
  ctx
}) {
  const ref = `${ ctx.camelCaseName }.${ camelCaseName }`

  const typeTest = getTypeTest({
    jsonEntry,
    ref,
    indent: testIndent
  })

  const reactiveTest = jsonEntry.reactive === true
    ? getReactivePropTest({ jsonEntry, ref })
    : ''

  return `
    describe('${ testId }', () => {
      test('is correct type', () => {
        mountPlugin()
        ${ typeTest }
      })${ reactiveTest }
    })\n`
}

function createMethodTest ({
  camelCaseName,
  testId,
  jsonEntry,
  ctx
}) {
  const callTest = getFunctionCallTest({
    jsonEntry: { ...jsonEntry, type: 'Function' },
    ref: `${ ctx.camelCaseName }.${ camelCaseName }`,
    indent: testIndent
  })

  return `
    describe('${ testId }', () => {
      test.todo('should be callable', () => {
        mountPlugin()
        ${ callTest }

        // TODO: test the effect
      })
    })\n`
}

export default {
  identifiers,
  getJson: readAssociatedJsonFile,
  getFileHeader: ({ ctx, json }) => {
    const hasQuasarInstallOverride = (
      autoInstalledPlugins.includes(ctx.camelCaseName) === false
    )

    const acc = [
      'import { describe, test, expect } from \'vitest\'',
      `import { mount${ hasQuasarInstallOverride ? ', config' : '' } } from '@vue/test-utils'`
    ]

    if (
      Object.keys(json.props || [])
        .some(prop => json.props[ prop ].reactive === true)
    ) {
      acc.push(
        'import { clone } from \'quasar\''
      )
    }

    acc.push(
      '',
      `import ${ ctx.camelCaseName } from './${ ctx.localName }'`,
      '',
      'const mountPlugin = () => mount({ template: \'<div />\' })'
    )

    if (hasQuasarInstallOverride === true) {
      acc.push(
        '',
        '// We override Quasar install so it installs this plugin',
        'const quasarVuePlugin = config.global.plugins.find(entry => entry.name === \'Quasar\')',
        'const { install } = quasarVuePlugin',
        `quasarVuePlugin.install = app => install(app, { plugins: { ${ ctx.camelCaseName } } })`
      )
    }

    return acc.join('\n')
  },
  getGenericTest: ({ ctx }) => {
    return `
  describe('[Generic]', () => {
    test('should not throw error when installed', () => {
      const wrapper = mountPlugin()
      expect(wrapper).toBeDefined() // this is here for lint only
    })
  })\n`
  }
}
