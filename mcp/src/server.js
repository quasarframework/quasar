import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import {
  API_PARTS,
  MEMBER_PARTS,
  findApiMembers,
  listApi,
  readApi,
  readApiMarkdown,
  readApiMembersMarkdown,
  resolveApiName,
  similarApiMembers,
  similarApiNames
} from './api.js'
import {
  extractSection,
  listHeadings,
  loadDocs,
  normalizeRoute,
  readPage,
  searchDocs,
  similarRoutes
} from './docs.js'
import { BUNDLED_DOCS_SINCE, DOCS_PACKAGES } from './project.js'
import { checkUpdates as defaultCheckUpdates } from './updates.js'
import { version } from './version.js'

const SITE_URL = 'https://quasar.dev'

/**
 * @param {string} text
 * @returns {{ content: Array<{ type: 'text', text: string }> }}
 */
function text(value) {
  return { content: [{ type: 'text', text: value }] }
}

/**
 * @param {string} message
 * @returns {{ content: Array<{ type: 'text', text: string }>, isError: true }}
 */
function failure(message) {
  return { content: [{ type: 'text', text: message }], isError: true }
}

/**
 * @param {import('./updates.js').UpdateState[]} updates
 * @returns {string[]}
 */
function updateLines(updates) {
  return updates
    .filter(update => update.latest !== void 0)
    .map(
      update =>
        `${update.name} ${update.latest} is available (installed: ${update.version}).`
    )
}

/**
 * What the model reads at session start: which packages and versions
 * the answers describe, what is missing, and how to use the tools.
 *
 * @param {import('./project.js').Project} project
 * @param {import('./docs.js').Docs} docs
 * @param {import('./updates.js').UpdateState[]} updates
 * @returns {string}
 */
/**
 * The packages whose pages this server cannot serve, and why, for a
 * miss that may be one of theirs. Empty when every package is served.
 *
 * @param {import('./project.js').Project} project
 * @param {import('./docs.js').Docs} docs
 * @returns {string}
 */
function unservedPackages(project, docs) {
  const gaps = []
  for (const name of DOCS_PACKAGES) {
    if (docs.sources.some(source => source.name === name)) {
      continue
    }
    const pkg = project.packages.find(installed => installed.name === name)
    gaps.push(
      pkg === void 0
        ? `${name} is not installed in this project`
        : `${name} ${pkg.version} bundles no documentation (bundled since ${BUNDLED_DOCS_SINCE[name]}), upgrade it`
    )
  }
  return gaps.length === 0 ? '' : ` Not available offline: ${gaps.join('; ')}.`
}

export function buildInstructions(project, docs, updates) {
  const lines = [
    `Quasar Framework documentation and API, served from the packages installed in ${project.dir}.`,
    'Prefer these tools over memory or the web: the pages match the installed versions exactly.',
    ''
  ]

  for (const name of DOCS_PACKAGES) {
    const pkg = project.packages.find(installed => installed.name === name)
    if (pkg === void 0) {
      lines.push(`- ${name}: not installed in this project.`)
    } else if (pkg.docsDir === null) {
      lines.push(
        `- ${name} ${pkg.version}: installed, but this release bundles no documentation ` +
          `(bundled since ${BUNDLED_DOCS_SINCE[name]}); suggest upgrading it to get the docs pages offline.`
      )
    } else {
      const source = docs.sources.find(entry => entry.name === name)
      lines.push(
        `- ${name} ${pkg.version}: ${source?.pageCount ?? 0} documentation pages.`
      )
    }
  }

  const quasar = project.packages.find(pkg => pkg.name === 'quasar')
  if (quasar?.apiDir) {
    lines.push(
      `- quasar ${quasar.version} API descriptors (components, plugins, directives, composables): get_api / list_api.`
    )
  }

  lines.push(
    '',
    'Workflow: search_docs to find pages (each hit names the sections where the terms occur), get_page with section to read just that part (outline lists the sections; a whole component page can run to 25k tokens), get_api for the exact props, slots, events and methods of a component, plugin or directive.',
    `Pages are routes of ${SITE_URL} (e.g. vue-components/button). Links inside pages are either .md siblings relative to the page's route or ${SITE_URL} URLs: get_page takes both as they appear.`
  )

  const available = updateLines(updates)
  if (available.length !== 0) {
    lines.push(
      '',
      'Updates available, tell the user (they upgrade with their package manager; for @quasar/mcp restart the server):',
      ...available.map(line => `- ${line}`)
    )
  }

  return lines.join('\n')
}

/**
 * @param {{ project: import('./project.js').Project, checkUpdates?: typeof defaultCheckUpdates }} opts
 * @returns {Promise<McpServer>}
 */
export async function createServer({
  project,
  checkUpdates = defaultCheckUpdates
}) {
  const docs = loadDocs(project.packages)
  const quasar = project.packages.find(pkg => pkg.name === 'quasar')
  const apiDir = quasar?.apiDir ?? null
  const apiDocsDir = quasar?.docsDir ?? null
  const updates = await checkUpdates(project)

  const server = new McpServer(
    { name: 'quasar', version },
    { instructions: buildInstructions(project, docs, updates) }
  )

  const packageEnum = z.enum(DOCS_PACKAGES)

  server.registerTool(
    'list_pages',
    {
      title: 'List documentation pages',
      description:
        'Every documentation page available offline, as route and title, grouped by the installed package that ships it. Prefer search_docs to find a page; this is the full index.',
      inputSchema: {
        package: packageEnum
          .optional()
          .describe('Only the pages shipped by this package'),
        descriptions: z
          .boolean()
          .optional()
          .describe(
            "Add each page's one-line description (doubles the size of the listing)"
          )
      }
    },
    ({ package: packageName, descriptions = false }) => {
      const lines = []
      for (const source of docs.sources) {
        if (packageName !== void 0 && source.name !== packageName) {
          continue
        }
        lines.push(`# ${source.name} ${source.version}`, '')
        for (const page of docs.pages.values()) {
          if (page.packageName === source.name) {
            lines.push(
              `- ${page.route}: ${page.title}${descriptions && page.desc ? ` (${page.desc})` : ''}`
            )
          }
        }
        lines.push('')
      }
      if (lines.length === 0) {
        return failure(
          'No documentation pages are installed. ' +
            `The pages ship with quasar (since ${BUNDLED_DOCS_SINCE.quasar}) and @quasar/app-vite (since ${BUNDLED_DOCS_SINCE['@quasar/app-vite']}).`
        )
      }
      return text(lines.join('\n').trim())
    }
  )

  server.registerTool(
    'search_docs',
    {
      title: 'Search the documentation',
      description:
        "Find documentation pages by keywords (component names, props, features, config options). Each hit names the sections where the keywords occur: pass one as get_page's section to read only that part.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe('Keywords, e.g. "table pagination" or "boot files"'),
        package: packageEnum
          .optional()
          .describe("Only search this package's pages"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe('Maximum hits (default 5)')
      }
    },
    ({ query, package: packageName, limit }) => {
      const hits = searchDocs(docs, query, { limit, packageName })
      if (hits.length === 0) {
        return text(
          docs.pages.size === 0
            ? 'No documentation pages are installed, nothing to search.'
            : `No page matches "${query}". Try fewer or different keywords, or list_pages.`
        )
      }
      return text(
        hits
          .map(({ page, sections }) => {
            const lines = [`- ${page.route}: ${page.title}`]
            if (page.desc) lines.push(`  ${page.desc}`)
            if (sections.length !== 0) {
              lines.push(`  sections: ${sections.join(' | ')}`)
            }
            return lines.join('\n')
          })
          .join('\n')
      )
    }
  )

  server.registerTool(
    'get_page',
    {
      title: 'Read a documentation page',
      description:
        'The markdown of one documentation page, by route (as listed by list_pages or search_docs, or a quasar.dev URL). Pass a heading to get only that section, or outline to get the headings and pick one: whole component pages are long.',
      inputSchema: {
        route: z
          .string()
          .min(1)
          .describe('Page route, e.g. vue-components/button'),
        section: z
          .string()
          .optional()
          .describe(
            'A heading of the page, to return only that section; omit for the whole page'
          ),
        outline: z
          .boolean()
          .optional()
          .describe(
            'Only the title and headings of the page, to pick a section'
          )
      }
    },
    ({ route: input, section, outline = false }) => {
      const route = normalizeRoute(input)
      const page = docs.pages.get(route)
      if (page === void 0) {
        const similar = similarRoutes(docs, route)
        return failure(
          `No page at "${route}".` +
            (similar.length !== 0
              ? ` Similar routes: ${similar.join(', ')}.`
              : ' Use search_docs or list_pages to find the route.') +
            unservedPackages(project, docs)
        )
      }
      const markdown = readPage(page)
      if (outline) {
        return text(
          [
            `# ${page.title}`,
            ...listHeadings(markdown).map(
              heading => `${'#'.repeat(heading.level)} ${heading.text}`
            )
          ].join('\n')
        )
      }
      if (section === void 0) {
        return text(markdown)
      }
      const extracted = extractSection(markdown, section)
      if (extracted === null) {
        return failure(
          `No section "${section}" in ${route}. Its headings: ${listHeadings(
            markdown
          )
            .map(heading => heading.text)
            .join(' | ')}`
        )
      }
      return text(extracted)
    }
  )

  server.registerTool(
    'list_api',
    {
      title: 'List API descriptors',
      description:
        'The names every get_api call accepts: Quasar components (QBtn, QTable, ...), plugins (Notify, Dialog, ...), directives (Ripple, ...) and utilities.',
      inputSchema: {}
    },
    () => {
      if (apiDir === null) {
        return failure(
          'quasar is not installed in this project, so there is no API to list.'
        )
      }
      return text(listApi(apiDir).join('\n'))
    }
  )

  server.registerTool(
    'get_api',
    {
      title: 'Get an API descriptor',
      description:
        'The exact API of a Quasar component, plugin or directive as installed: props, slots, events, methods (with types, defaults and descriptions), as the documentation site presents it. Pass part for one section, member for one prop, slot, event or method (the cheapest call by far), format "json" for the raw descriptor.',
      inputSchema: {
        name: z
          .string()
          .min(1)
          .describe('Descriptor name, e.g. QBtn, Notify, Ripple'),
        part: z
          .enum(API_PARTS)
          .optional()
          .describe('One section of the descriptor; omit for all of it'),
        member: z
          .string()
          .optional()
          .describe(
            'One prop, slot, event or method by name (pagination, body-cell, update:model-value, toggleFullscreen; case and punctuation do not matter); with part when the name exists in several'
          ),
        format: z
          .enum(['markdown', 'json'])
          .optional()
          .describe(
            'markdown (default): the compact form the documentation site inlines; json: the raw descriptor'
          )
      }
    },
    ({ name: input, part, member, format = 'markdown' }) => {
      if (apiDir === null) {
        return failure(
          'quasar is not installed in this project, so there is no API to serve.'
        )
      }
      const name = resolveApiName(apiDir, input)
      if (name === null) {
        const similar = similarApiNames(apiDir, input)
        return failure(
          `No API descriptor named "${input}".` +
            (similar.length !== 0
              ? ` Similar names: ${similar.join(', ')}.`
              : ' Use list_api for the available names.')
        )
      }
      const api = readApi(apiDir, name)
      if (api === null) {
        return failure(`The ${name} descriptor could not be read.`)
      }
      if (part !== void 0 && api[part] === void 0) {
        const parts = API_PARTS.filter(known => api[known] !== void 0)
        return failure(`${name} has no "${part}". It has: ${parts.join(', ')}.`)
      }
      if (member !== void 0) {
        if (part !== void 0 && !MEMBER_PARTS.includes(part)) {
          return failure(
            `"${part}" has no named members; member goes with ${MEMBER_PARTS.join(', ')}.`
          )
        }
        const members = findApiMembers(api, member, part)
        if (members.length === 0) {
          const similar = similarApiMembers(api, member, part)
          return failure(
            `${name} has no member named "${member}"${part === void 0 ? '' : ` in ${part}`}.` +
              (similar.length !== 0
                ? ` Similar: ${similar.join(', ')}.`
                : ' Pass part for the full list of a section.')
          )
        }
        const markdown =
          format === 'markdown' && apiDocsDir !== null
            ? readApiMembersMarkdown(apiDocsDir, name, members)
            : null
        if (markdown !== null) {
          return text(markdown)
        }
        const picked = { name }
        for (const found of members) {
          picked[found.part] ??= {}
          picked[found.part][found.name] = api[found.part][found.name]
        }
        return text(JSON.stringify(picked, null, 1))
      }
      // The rendered form ships with the docs slice (quasar v2.33+); a
      // release without it, or a part the renderer leaves out when
      // empty, gets the JSON.
      const markdown =
        format === 'markdown' && apiDocsDir !== null
          ? readApiMarkdown(apiDocsDir, name, part)
          : null
      if (markdown !== null) {
        return text(markdown)
      }
      return text(
        JSON.stringify(
          part === void 0 ? { name, ...api } : { name, [part]: api[part] },
          null,
          1
        )
      )
    }
  )

  server.registerTool(
    'check_updates',
    {
      title: 'Check for updates',
      description:
        'Whether newer releases of quasar, @quasar/app-vite or this server exist, by querying the npm registry. Newer docs come with the newer packages.',
      inputSchema: {}
    },
    async () => {
      const state = await checkUpdates(project, { refresh: true })
      const available = updateLines(state)
      const installed = state
        .map(entry => `${entry.name} ${entry.version}`)
        .join(', ')
      if (available.length === 0) {
        return text(
          `Up to date (or the registry could not be reached): ${installed}.`
        )
      }
      return text(
        [
          ...available,
          '',
          "Upgrade the packages with the project's package manager; @quasar/mcp picks up its new release on the next server start (the documented npx form does that by itself)."
        ].join('\n')
      )
    }
  )

  return server
}
