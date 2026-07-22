/**
 * Shared rendering rules for the API renderer.
 *
 * Per spec D8 (type mapping), D9 (drop tsType), D10 (drop list).
 *
 * @typedef {object} ApiFieldDef
 * @property {string|string[]} [type] - Quasar type name(s), e.g. 'String' or ['String', 'Number']
 * @property {boolean} [required]
 * @property {boolean} [syncable]
 * @property {boolean} [reactive]
 * @property {string} [desc]
 * @property {string|number|boolean} [default]
 * @property {string[]} [values] - closed enum
 * @property {Array<string|number>} [examples] - open-ended examples
 * @property {string} [addedIn]
 * @property {Record<string, ApiFieldDef>} [definition] - nested Object shape
 * @property {Record<string, ApiFieldDef>} [params] - for Function/event/method
 * @property {ApiFieldDef} [returns] - for Function/method
 * @property {Record<string, ApiFieldDef>} [scope] - for scoped slot
 */

const TYPE_MAP = {
  Any: 'any',
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  Object: 'object',
  Array: 'any[]'
}

// Lib types that are valid TS as-is.
const LIB_TYPES_PASS = new Set([
  'Element',
  'Event',
  'Date',
  'RegExp',
  'Promise',
  'Function',
  'null',
  'undefined'
])

/**
 * Map a Quasar API type name (or union array) to a TypeScript-style string.
 *
 * For union arrays, `undefined` and `null` members are stripped because the
 * optional/required modifier already encodes nullability at the field level.
 * Authoring source like `(Function|undefined)` would otherwise render as
 * `Function | undefined`, duplicating the `optional` flag.
 *
 * @param {string|string[]} type
 * @returns {string}
 */
export function formatType(type) {
  if (type === void 0 || type === null) {
    return 'unknown'
  }
  if (Array.isArray(type)) {
    const filtered = type.filter(
      member => member !== 'undefined' && member !== 'null'
    )
    if (filtered.length === 0) {
      return 'undefined'
    }
    return filtered.map(formatType).join(' | ')
  }
  if (type in TYPE_MAP) {
    return TYPE_MAP[type]
  }
  if (LIB_TYPES_PASS.has(type)) {
    return type
  }
  return type // Quasar named alias or unknown, pass through as-is
}

/**
 * Strip the leading "# " build-time marker from string defaults/examples.
 *
 * @template T
 * @param {T} value
 * @returns {T}
 */
export function stripBuildMarker(value) {
  return typeof value === 'string' ? value.replace(/^# /, '') : value
}

/**
 * Build the Stripe-style head line for a field.
 *
 * @param {string} name
 * @param {ApiFieldDef} field
 * @returns {string}
 */
export function buildHead(name, field) {
  const modifiers = [field.required === true ? 'required' : 'optional']
  if (field.syncable) {
    modifiers.push('syncable')
  }
  if (field.reactive) {
    modifiers.push('reactive')
  }

  const type = formatType(field.type)
  let head = `- \`${name}\` (${type}, ${modifiers.join(', ')})`

  if (field.default !== void 0) {
    head += `, default \`${stripBuildMarker(field.default)}\``
  }
  if (field.addedIn) {
    head += ` *(added ${field.addedIn})*`
  }
  return head
}

const DROP_FIELDS = new Set([
  'category',
  'tsType',
  'tsInjectionPoint',
  'autoDefineTsType',
  'transformAssetUrls',
  'configFileType',
  '__runtimeDefault',
  'passthrough'
])

/**
 * Whether a JSON field should be dropped from rendered output.
 *
 * @param {string} fieldName
 * @returns {boolean}
 */
export function shouldDropField(fieldName) {
  return DROP_FIELDS.has(fieldName)
}
