/**
 * Renderers for API member collections: props, methods, events, slots.
 * All output is Stripe-style indented bullets per spec D1 + D10.
 *
 * Every member kind shares one body (renderFieldBody): the description,
 * the notes, the signature, values, examples, then the nested `params`,
 * `returns` and `definition` trees. Only the head line differs per kind.
 *
 * computedProps has no dedicated renderer. Its shape is a strict subset of
 * props (no required, no default) and renderProps handles it correctly.
 */

/** @typedef {import('./field-rules.js').ApiFieldDef} ApiFieldDef */

import {
  buildHead,
  formatType,
  shouldDropField,
  stripBuildMarker
} from './field-rules.js'

const INLINE_EXAMPLE_LIMIT = 4 // inline if <=4 short examples

/**
 * @param {number} depth
 * @returns {string}
 */
function indentOf(depth) {
  return '  '.repeat(depth)
}

/**
 * Whether a prop type slot is Function-typed. Handles both the scalar
 * `'Function'` and the union `['Function', 'undefined']` shape, which
 * source JSON uses to express "may be omitted" next to the optional flag.
 *
 * @param {string|string[]|undefined} type
 * @returns {boolean}
 */
function isFunctionType(type) {
  if (type === 'Function') {
    return true
  }
  return Array.isArray(type) && type.includes('Function')
}

/**
 * @param {Record<string, ApiFieldDef>|null|undefined} map
 * @returns {boolean}
 */
function hasEntries(map) {
  return (
    map !== null &&
    typeof map === 'object' &&
    !Array.isArray(map) &&
    Object.keys(map).length !== 0
  )
}

/**
 * Build a TS-style `param?: type` list from a params map. Shared by
 * function-prop signatures and method signatures. A rest param is
 * never optional-marked (`...args?` is not TS).
 *
 * @param {Record<string, ApiFieldDef>|null|undefined} params
 * @returns {string}
 */
function buildParamList(params) {
  if (!params) {
    return ''
  }

  return Object.entries(params)
    .map(([paramName, paramDef]) => {
      const optionalMark =
        paramDef.required === true || paramName.startsWith('...') ? '' : '?'
      return `${paramName}${optionalMark}: ${formatType(paramDef.type)}`
    })
    .join(', ')
}

/**
 * The type a `returns` slot renders as. A missing or `null` returns is a
 * void function; a partial `returns` object without `.type` also renders
 * as void, with a warning so the source JSON gets fixed upstream instead
 * of the literal string 'undefined' leaking into output.
 *
 * @param {string} owner
 * @param {ApiFieldDef|null|undefined} returns
 * @returns {string}
 */
function returnTypeOf(owner, returns) {
  if (!returns) {
    return 'void'
  }
  if (!returns.type) {
    console.warn(
      `[mcp] '${owner}' has returns with no type field; treating as void`
    )
    return 'void'
  }
  return formatType(returns.type)
}

/**
 * Build a TS arrow-function signature for a Function-typed field with
 * documented params and/or returns. Per spec D8.
 *
 * @param {string} name
 * @param {ApiFieldDef} field
 * @returns {string}
 */
function renderFunctionSignature(name, field) {
  if (!isFunctionType(field.type)) {
    return ''
  }
  if (!field.params && !field.returns) {
    return ''
  }

  return `(${buildParamList(field.params)}) => ${returnTypeOf(name, field.returns)}`
}

/**
 * @param {Array<string|number>|undefined} examples
 * @param {string} indent
 * @returns {string}
 */
export function renderExamples(examples, indent) {
  if (!examples || examples.length === 0) {
    return ''
  }

  // Inline when short list of short strings (no commas inside)
  const isShortList =
    examples.length <= INLINE_EXAMPLE_LIMIT &&
    examples.every(
      example => typeof example === 'string' && !example.includes(',')
    )
  const stripped = examples.map(stripBuildMarker)
  if (isShortList) {
    return `${indent}Examples: ${stripped.map(example => `\`${example}\``).join(', ')}\n`
  }
  return (
    `${indent}Examples:\n` +
    stripped.map(example => `${indent}  - \`${example}\`\n`).join('')
  )
}

/**
 * @param {string[]|undefined} values
 * @param {string} indent
 * @returns {string}
 */
export function renderValues(values, indent) {
  if (!values || values.length === 0) {
    return ''
  }
  return `${indent}Accepts: ${values.map(value => `\`${value}\``).join(', ')}\n`
}

/**
 * The quasar.config file side of a `quasarConfOptions` entry, where it
 * differs from the UI config one: `null` means the entry has no config
 * file form at all, a type is what the config file takes instead.
 *
 * @param {ApiFieldDef} field
 * @param {string} indent
 * @returns {string}
 */
export function renderConfigFileType(field, indent) {
  if (!Object.hasOwn(field, 'configFileType')) {
    return ''
  }
  if (field.configFileType === null) {
    return `${indent}UI config only; it cannot be set from the quasar.config file.\n`
  }
  return `${indent}quasar.config file type: \`${formatType(field.configFileType)}\`\n`
}

/**
 * The `Returns:` block of a callable: the type on its head line, then the
 * same body any field gets (desc, examples, its own params for a function
 * that returns a function, the object shape it returns).
 *
 * @param {string} owner
 * @param {ApiFieldDef|null|undefined} returns
 * @param {number} depth the depth of the callable the block belongs to
 * @returns {string}
 */
function renderReturns(owner, returns, depth) {
  if (!returns) {
    return ''
  }
  return (
    `${indentOf(depth + 1)}Returns: \`${returnTypeOf(owner, returns)}\`\n` +
    renderFieldBody(owner, returns, depth + 1)
  )
}

/**
 * Everything under a member's head line. Lines sit one level under the
 * head, nested trees (params, the returned shape, the object shape) two.
 *
 * @param {string} name
 * @param {ApiFieldDef} field
 * @param {number} depth the depth of the head line
 * @returns {string}
 */
function renderFieldBody(name, field, depth) {
  const childIndent = indentOf(depth + 1)
  let output = ''

  if (field.desc) {
    output += `${childIndent}${field.desc}\n`
  }
  if (field.sync === true) {
    output += `${childIndent}Required to be used with v-model.\n`
  }
  output += renderConfigFileType(field, childIndent)
  const functionSignature = renderFunctionSignature(name, field)
  if (functionSignature) {
    output += `${childIndent}Function signature: \`${functionSignature}\`\n`
  }
  output += renderValues(field.values, childIndent)
  output += renderExamples(field.examples, childIndent)

  if (hasEntries(field.params)) {
    output += `${childIndent}Params:\n`
    output += renderProps(field.params, depth + 2)
  }
  output += renderReturns(name, field.returns, depth)

  if (hasEntries(field.definition)) {
    output += `${childIndent}Object shape:\n`
    output += renderProps(field.definition, depth + 2)
  } else if (Array.isArray(field.definition)) {
    // definition is documented as an object schema, so an array is a
    // source-JSON authoring bug. Surface it instead of silently rendering
    // Object.entries(array) garbage.
    console.warn(
      `[mcp] '${name}' has array definition (expected object); skipping recursion`
    )
  }

  return output
}

/**
 * Render a collection of prop-shaped fields as Stripe-style indented bullets.
 * Recursively descends into Object-shaped `definition`, function `params`
 * and `returns`. Fields flagged `internal` are left out, as on the site.
 *
 * @param {Record<string, ApiFieldDef>} props
 * @param {number} [depth]
 * @returns {string}
 */
export function renderProps(props, depth = 0) {
  const indent = indentOf(depth)
  let output = ''
  for (const [name, field] of Object.entries(props)) {
    if (shouldDropField(name) || field.internal === true) {
      continue
    }

    output += indent + buildHead(name, field) + '\n'
    output += renderFieldBody(name, field, depth)
  }
  return output
}

/**
 * TS-style method signature per spec D8: name(args): returnType.
 *
 * @param {string} name
 * @param {ApiFieldDef} method
 * @returns {string}
 */
function buildSignature(name, method) {
  return `${name}(${buildParamList(method.params)}): ${returnTypeOf(name, method.returns)}`
}

/**
 * @param {Record<string, ApiFieldDef>} methods
 * @returns {string}
 */
export function renderMethods(methods) {
  let output = ''
  for (const [name, method] of Object.entries(methods)) {
    output += `- \`${buildSignature(name, method)}\`\n`
    output += renderFieldBody(name, method, 0)
  }
  return output
}

/**
 * Events use @name prefix per Vue template syntax.
 *
 * @param {Record<string, ApiFieldDef>} events
 * @returns {string}
 */
export function renderEvents(events) {
  let output = ''
  for (const [name, event] of Object.entries(events)) {
    if (event.internal === true) {
      continue
    }
    output += `- \`@${name}\`\n`
    output += renderFieldBody(name, event, 0)
  }
  return output
}

/**
 * Split a slot map into regular and scoped subsets. Used by render-api.js
 * to emit separate ### Slots and ### Scoped Slots sections.
 *
 * @param {Record<string, ApiFieldDef>} slots
 * @returns {{ regular: Record<string, ApiFieldDef>, scoped: Record<string, ApiFieldDef> }}
 */
export function partitionSlots(slots) {
  /** @type {Record<string, ApiFieldDef>} */
  const regular = {}
  /** @type {Record<string, ApiFieldDef>} */
  const scoped = {}
  for (const [name, slot] of Object.entries(slots)) {
    if (slot.internal === true) {
      continue
    }
    if (hasEntries(slot.scope)) {
      scoped[name] = slot
    } else {
      regular[name] = slot
    }
  }
  return { regular, scoped }
}

/**
 * Slots use #name prefix (mirrors Vue v-slot:name). A slot's `scope` object
 * renders as a Scope: heading with nested bullets.
 *
 * @param {Record<string, ApiFieldDef>} slots
 * @returns {string}
 */
export function renderSlots(slots) {
  let output = ''
  for (const [name, slot] of Object.entries(slots)) {
    output += `- \`#${name}\`\n`
    if (slot.desc) {
      output += `  ${slot.desc}\n`
    }
    if (hasEntries(slot.scope)) {
      output += '  Scope:\n'
      output += renderProps(slot.scope, 2)
    }
  }
  return output
}
