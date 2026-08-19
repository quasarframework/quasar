import { describe, expect, test } from 'vitest'
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc'

import { createQuasarNodeTransform } from '../../../src/vue-ast-transform.js'
import {
  loadQuasarImportMap,
  residualQuasarImportRegex
} from '../../../src/js-transform.js'
import { quasar } from '../../../src/index.js'

loadQuasarImportMap()

function compile(
  source,
  { componentCase = 'combined', treeshaking = true } = {}
) {
  return compileTemplate({
    id: 'test',
    filename: 'test.vue',
    source,
    compilerOptions: {
      nodeTransforms: [createQuasarNodeTransform(componentCase, treeshaking)]
    }
  })
}

describe('vue ast transform', () => {
  test('resolves kebab components into direct imports', () => {
    const { code, errors } = compile('<q-btn label="ok" />')

    expect(errors.length).toBe(0)
    expect(code).toContain(
      "import _component_q_btn from 'quasar/src/components/btn/QBtn.js'"
    )
    expect(code).not.toContain('_resolveComponent(')
  })

  test('resolves pascal components into direct imports', () => {
    const { code } = compile('<QBtn label="ok" />')

    expect(code).toContain(
      "import _component_QBtn from 'quasar/src/components/btn/QBtn.js'"
    )
    expect(code).not.toContain('_resolveComponent(')
  })

  test('respects the autoImportComponentCase option', () => {
    const { code } = compile('<QBtn label="ok" />', { componentCase: 'kebab' })

    expect(code).not.toContain("from 'quasar/src/components/btn/QBtn.js'")
    expect(code).toContain('_resolveComponent("QBtn")')
  })

  test('resolves directives into direct imports', () => {
    const { code } = compile('<div v-ripple />')

    expect(code).toContain(
      "import _directive_ripple from 'quasar/src/directives/ripple/Ripple.js'"
    )
    expect(code).not.toContain('_resolveDirective(')
  })

  test('leaves unknown components to runtime resolution', () => {
    const { code } = compile('<my-comp><q-btn /></my-comp>')

    expect(code).toContain('_resolveComponent("my-comp")')
    expect(code).toContain(
      "import _component_q_btn from 'quasar/src/components/btn/QBtn.js'"
    )
  })

  test('imports from the quasar package while in dev mode', () => {
    const { code } = compile('<q-btn />', { treeshaking: false })

    expect(code).toContain("import { QBtn as _component_q_btn } from 'quasar'")
    expect(code).not.toContain('_resolveComponent(')
  })

  test('user script-setup imports win over auto-import and get mapped too', () => {
    // wire up the script plugin exactly like a real Vite config resolution:
    // its configResolved() injects the nodeTransform into the vue plugin
    const scriptPlugin = quasar({ autoImportComponentCase: 'combined' }).find(
      ({ name }) => name === 'vite:quasar:script'
    )
    const fakeVuePlugin = { name: 'vite:vue', api: { options: {} } }
    scriptPlugin.configResolved({
      isProduction: true,
      plugins: [fakeVuePlugin]
    })

    const { nodeTransforms } =
      fakeVuePlugin.api.options.template.compilerOptions
    expect(nodeTransforms.length).toBe(1)

    const { descriptor } = parse(
      '<template>\n' +
        '  <q-card><q-btn label="ok" /></q-card>\n' +
        '</template>\n' +
        '<script setup>\n' +
        "import { QBtn } from 'quasar'\n" +
        'console.log(QBtn)\n' +
        '</script>\n',
      { filename: 'test.vue' }
    )

    const { content } = compileScript(descriptor, {
      id: 'test',
      inlineTemplate: true,
      templateOptions: { compilerOptions: { nodeTransforms } }
    })

    // template compile stage: the q-btn tag resolves through the user's
    // setup binding (no duplicate auto-import of QBtn), while the
    // unimported q-card still gets auto-imported
    expect(content).not.toContain('QBtn.js')
    expect(content).toContain(
      "import _component_q_card from 'quasar/src/components/card/QCard.js'"
    )
    expect(content).not.toContain('_resolveComponent(')

    // script transform stage: the user's own import gets mapped to its
    // per-file path as well - nothing is left importing from "quasar"
    const result = scriptPlugin.transform.handler(content, '/src/Test.vue')

    expect(result.code).toContain(
      "import QBtn from 'quasar/src/components/btn/QBtn.js'"
    )
    expect(residualQuasarImportRegex.test(result.code)).toBe(false)
  })

  test('coalesces all dev mode names into a single import statement', () => {
    const { code } = compile('<q-card v-ripple><q-btn label="ok" /></q-card>', {
      treeshaking: false
    })

    const quasarImports = code.match(/from ['"]quasar['"]/g)
    expect(quasarImports.length).toBe(1)

    expect(code).toContain('QCard as _component_q_card')
    expect(code).toContain('QBtn as _component_q_btn')
    expect(code).toContain('Ripple as _directive_ripple')
    expect(code).not.toContain('_resolveComponent(')
    expect(code).not.toContain('_resolveDirective(')
  })
})
