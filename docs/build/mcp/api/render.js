/**
 * Top-level API renderer and entry point for the <DocApi> transform.
 * Renders a parsed API JSON document as a `## QXxx API` section.
 */

/** @typedef {import('./field-rules.js').ApiFieldDef} ApiFieldDef */

import { formatType } from './field-rules.js'
import {
  partitionSlots,
  renderConfigFileType,
  renderEvents,
  renderExamples,
  renderMethods,
  renderProps,
  renderSlots,
  renderValues
} from './members.js'

/**
 * Fixed section ordering. Each entry maps a JSON key to a renderer +
 * H3 heading wording. Sections nest under the page's wrapping `## QXxx API`
 * h2, so per-section headings live at h3 to preserve outline hierarchy.
 * Skipped when JSON key absent or its value is empty.
 *
 * @type {Array<{ jsonKey: string, heading: string, renderer: (data: any) => string }>}
 */
const SECTIONS = [
  { jsonKey: 'props', heading: '### Props', renderer: renderProps },
  {
    jsonKey: 'computedProps',
    heading: '### Computed Props',
    renderer: renderProps
  },
  { jsonKey: 'methods', heading: '### Methods', renderer: renderMethods },
  { jsonKey: 'events', heading: '### Events', renderer: renderEvents }
]

/**
 * Emit `### Slots` and/or `### Scoped Slots` sections from a partitioned slot map.
 *
 * @param {Record<string, ApiFieldDef>|undefined} slots
 * @returns {string}
 */
function renderSlotSections(slots) {
  if (!slots || Object.keys(slots).length === 0) {
    return ''
  }

  const { regular, scoped } = partitionSlots(slots)
  let output = ''
  if (Object.keys(regular).length !== 0) {
    output += '### Slots\n\n' + renderSlots(regular) + '\n'
  }
  if (Object.keys(scoped).length !== 0) {
    output += '### Scoped Slots\n\n' + renderSlots(scoped) + '\n'
  }
  return output
}

/**
 * The `### quasar.config.js Options` section: the key, its type, the
 * description and the accepted values or examples as paragraphs, then
 * the object shape as the usual bullet list.
 *
 * @param {ApiFieldDef & { propName?: string }} confOptions
 * @returns {string}
 */
function renderQuasarConfOptions(confOptions) {
  let output = '### quasar.config.js Options\n\n'
  if (confOptions.propName) {
    const type = confOptions.type ? ` (${formatType(confOptions.type)})` : ''
    output += `Configuration key: \`framework.config.${confOptions.propName}\`${type}\n\n`
  }
  if (confOptions.desc) {
    output += `${confOptions.desc}\n\n`
  }
  const lines =
    renderConfigFileType(confOptions, '') +
    renderValues(confOptions.values, '') +
    renderExamples(confOptions.examples, '')
  if (lines !== '') {
    output += `${lines}\n`
  }
  if (
    confOptions.definition &&
    Object.keys(confOptions.definition).length !== 0
  ) {
    output += renderProps(confOptions.definition) + '\n'
  }
  return output
}

/**
 * Every part a descriptor can carry, in the order the rendered
 * markdown lays the sections out (SECTIONS, then slots, then the
 * plugin and directive sections). What `get_api` takes as `part`.
 *
 * @type {string[]}
 */
const PARTS = [
  'props',
  'computedProps',
  'methods',
  'events',
  'slots',
  'injection',
  'quasarConfOptions',
  'value',
  'arg',
  'modifiers'
]

/**
 * The parts a descriptor carries, in the order renderApi() writes
 * them, for the pointer the package slices carry instead of the API.
 * An empty object counts as absent, as it does when rendering.
 *
 * @param {Record<string, unknown>} json
 * @returns {string[]}
 */
export function apiParts(json) {
  return PARTS.filter(part => {
    const data = json[part]
    if (!data) {
      return false
    }
    return typeof data !== 'object' || Object.keys(data).length !== 0
  })
}

/**
 * Render an entire API JSON document into Stripe-style Markdown.
 *
 * @param {string} name
 * @param {{
 *   type?: string,
 *   props?: Record<string, ApiFieldDef>,
 *   computedProps?: Record<string, ApiFieldDef>,
 *   methods?: Record<string, ApiFieldDef>,
 *   events?: Record<string, ApiFieldDef>,
 *   slots?: Record<string, ApiFieldDef>,
 *   injection?: string,
 *   quasarConfOptions?: ApiFieldDef & { propName?: string },
 *   value?: ApiFieldDef,
 *   arg?: ApiFieldDef,
 *   modifiers?: Record<string, ApiFieldDef>
 * }} json
 * @returns {string}
 */
export function renderApi(name, json) {
  let output = `## ${name} API\n\n`

  for (const { jsonKey, heading, renderer } of SECTIONS) {
    const data = json[jsonKey]
    if (!data || Object.keys(data).length === 0) {
      continue
    }
    const body = renderer(data)
    if (body.trim() === '') {
      continue
    }
    output += `${heading}\n\n${body}\n`
  }

  output += renderSlotSections(json.slots)

  // Plugin-specific sections nest under the page-level h2 as h3s.
  if (json.injection) {
    const bareKey = json.injection.replace(/^\$q\./, '')
    output += `### Vue Injection\n\nAccessible via \`${json.injection}\` (e.g., \`this.$q.${bareKey}\` in Options API or \`useQuasar().${bareKey}\` in Composition API).\n\n`
  }
  if (json.quasarConfOptions) {
    output += renderQuasarConfOptions(json.quasarConfOptions)
  }

  // Directive-specific sections
  if (json.value) {
    output +=
      '### Directive Value\n\n' + renderProps({ value: json.value }) + '\n'
  }
  if (json.arg) {
    output +=
      '### Directive Argument\n\n' + renderProps({ arg: json.arg }) + '\n'
  }
  if (json.modifiers && Object.keys(json.modifiers).length !== 0) {
    output += '### Directive Modifiers\n\n' + renderProps(json.modifiers) + '\n'
  }

  return output
}
