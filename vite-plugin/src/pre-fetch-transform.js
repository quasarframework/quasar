
import {
  MagicString,
  addNormalScript,
  generateTransform,
  importHelperFn,
  parseSFC,
  isCallOf
} from '@vue-macros/common'

const DEFINE_PRE_FETCH = 'definePreFetch'

export function definePreFetchTransform (code, id) {
  if (!id.endsWith('.vue') || !code.includes(DEFINE_PRE_FETCH)) return

  const sfc = parseSFC(code, id)
  if (!sfc.scriptSetup) return
  const { scriptSetup, getSetupAst } = sfc
  const setupOffset = scriptSetup.loc.start.offset
  const setupAst = getSetupAst()

  const nodes = filterMacro(setupAst.body)
  if (nodes.length === 0) return
  if (nodes.length > 1) { throw new SyntaxError(`duplicate ${ DEFINE_PRE_FETCH }() call`) }

  const s = new MagicString(code)

  const [ node ] = nodes
  const [ arg ] = node.arguments
  if (arg) {
    const normalScript = addNormalScript(sfc, s)

    const scriptOffset = normalScript.start()

    s.appendLeft(
      scriptOffset,
      `\nexport default /*#__PURE__*/ ${ importHelperFn(
        s,
        scriptOffset,
        'defineComponent'
      ) }(`
    )

    // add add normal script with preFetch
    s.appendLeft(scriptOffset, '{\npreFetch: ')
    s.moveNode(arg, scriptOffset, { offset: setupOffset })

    // removes definePreFetch()
    s.remove(setupOffset + node.start, setupOffset + arg.start)
    s.remove(setupOffset + arg.end, setupOffset + node.end)

    s.appendRight(scriptOffset, '\n});')
    normalScript.end()
  }
  else {
    // removes definePreFetch()
    s.removeNode(node, { offset: setupOffset })
  }

  return generateTransform(s, id)
}

export function filterMacro (stmts) {
  return stmts
    .map((raw) => {
      let node = raw
      if (raw.type === 'ExpressionStatement') node = raw.expression
      return isCallOf(node, DEFINE_PRE_FETCH) ? node : undefined
    })
    .filter((node) => !!node)
}
