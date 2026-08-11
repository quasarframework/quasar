/**
 * Renderers for API member collections: props, methods, events, slots.
 * All output is Stripe-style indented bullets per spec D1 + D10.
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
 * Build a TS-style `param?: type` list from a params map. Shared by
 * function-prop signatures and method signatures.
 *
 * @param {Record<string, ApiFieldDef>|undefined} params
 * @returns {string}
 */
function buildParamList(params) {
  if (!params) {
    return ''
  }

  return Object.entries(params)
    .map(([paramName, paramDef]) => {
      const optionalMark = paramDef.required === true ? '' : '?'
      return `${paramName}${optionalMark}: ${formatType(paramDef.type)}`
    })
    .join(', ')
}

/**
 * Build a TS arrow-function signature for a Function-typed prop with
 * documented params and/or returns. Per spec D8.
 *
 * @param {ApiFieldDef} field
 * @returns {string}
 */
function renderFunctionSignature(field) {
  if (!isFunctionType(field.type)) {
    return ''
  }
  if (!field.params && !field.returns) {
    return ''
  }

  const params = buildParamList(field.params)
  const returnType = field.returns?.type
    ? formatType(field.returns.type)
    : 'unknown'
  return `(${params}) => ${returnType}`
}

/**
 * @param {Array<string|number>|undefined} examples
 * @param {string} indent
 * @returns {string}
 */
function renderExamples(examples, indent) {
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
function renderValues(values, indent) {
  if (!values || values.length === 0) {
    return ''
  }
  return `${indent}Accepts: ${values.map(value => `\`${value}\``).join(', ')}\n`
}

/**
 * Render a collection of prop-shaped fields as Stripe-style indented bullets.
 * Recursively descends into Object-shaped `definition`.
 *
 * @param {Record<string, ApiFieldDef>} props
 * @param {number} [depth]
 * @returns {string}
 */
export function renderProps(props, depth = 0) {
  const indent = '  '.repeat(depth)
  const childIndent = '  '.repeat(depth + 1)
  let output = ''
  for (const [name, field] of Object.entries(props)) {
    if (shouldDropField(name)) {
      continue
    }

    output += indent + buildHead(name, field) + '\n'

    if (field.desc) {
      output += `${childIndent}${field.desc}\n`
    }
    const functionSignature = renderFunctionSignature(field)
    if (functionSignature) {
      output += `${childIndent}Function signature: \`${functionSignature}\`\n`
    }
    output += renderValues(field.values, childIndent)
    output += renderExamples(field.examples, childIndent)

    if (
      field.definition &&
      typeof field.definition === 'object' &&
      !Array.isArray(field.definition)
    ) {
      output += `${childIndent}Object shape:\n`
      output += renderProps(field.definition, depth + 2)
    } else if (Array.isArray(field.definition)) {
      // definition is documented as an object schema, so an array is a
      // source-JSON authoring bug. Surface it instead of silently rendering
      // Object.entries(array) garbage.
      console.warn(
        `[ai-docs] '${name}' has array definition (expected object); skipping recursion`
      )
    }
  }
  return output
}

/**
 * Shared body for callable members (methods, events): desc line + nested
 * Params: block. Head lines differ per member kind, so callers emit those.
 *
 * @param {ApiFieldDef} member
 * @returns {string}
 */
function renderCallableBody(member) {
  let output = ''
  if (member.desc) {
    output += `  ${member.desc}\n`
  }
  if (member.params && Object.keys(member.params).length !== 0) {
    output += '  Params:\n'
    output += renderProps(member.params, 2)
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
  const params = buildParamList(method.params)
  // A partial `returns` object without `.type` renders as void, with a
  // warning so the source JSON gets fixed upstream instead of the literal
  // string 'undefined' leaking into output.
  const returnType = method.returns?.type
    ? formatType(method.returns.type)
    : 'void'
  if (method.returns && !method.returns.type) {
    console.warn(
      `[ai-docs] method '${name}' has returns with no type field; treating as void`
    )
  }
  return `${name}(${params}): ${returnType}`
}

/**
 * @param {Record<string, ApiFieldDef>} methods
 * @returns {string}
 */
export function renderMethods(methods) {
  let output = ''
  for (const [name, method] of Object.entries(methods)) {
    output += `- \`${buildSignature(name, method)}\`\n`
    output += renderCallableBody(method)
    if (method.returns) {
      const returnDesc = method.returns.desc ? ` — ${method.returns.desc}` : ''
      // Mirror buildSignature's fallback for a partial returns object.
      const returnType = method.returns.type
        ? formatType(method.returns.type)
        : 'void'
      output += `  Returns: \`${returnType}\`${returnDesc}\n`
    }
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
    output += `- \`@${name}\`\n`
    output += renderCallableBody(event)
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
    const hasScope =
      slot.scope &&
      typeof slot.scope === 'object' &&
      Object.keys(slot.scope).length !== 0
    if (hasScope) {
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
    if (slot.scope && Object.keys(slot.scope).length !== 0) {
      output += '  Scope:\n'
      output += renderProps(slot.scope, 2)
    }
  }
  return output
}
