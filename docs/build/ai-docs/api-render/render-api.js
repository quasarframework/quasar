/**
 * Top-level API renderer and entry point for the <DocApi> transform.
 * Renders a parsed API JSON document as a `## QXxx API` section.
 */

/** @typedef {import('./field-rules.js').ApiFieldDef} ApiFieldDef */

import {
  partitionSlots,
  renderEvents,
  renderMethods,
  renderProps,
  renderSlots
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
 *   quasarConfOptions?: { propName?: string, definition?: Record<string, ApiFieldDef> },
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
    const confOptions = json.quasarConfOptions
    output += '### quasar.config.js Options\n\n'
    if (confOptions.propName) {
      output += `Configuration key: \`framework.config.${confOptions.propName}\`\n\n`
    }
    if (
      confOptions.definition &&
      Object.keys(confOptions.definition).length !== 0
    ) {
      output += renderProps(confOptions.definition) + '\n'
    }
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
