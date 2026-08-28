import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { globSync } from 'tinyglobby'
import { merge } from 'webpack-merge'
import fse from 'fs-extra'

import {
  camelCase,
  capitalize,
  kebabCase,
  logError,
  plural,
  readJsonFile,
  relativeToRoot,
  resolveToRoot,
  rootFolder,
  writeFile
} from './build.utils.js'

const dest = resolveToRoot('dist/api')

const extendApi = readJsonFile(resolveToRoot('src/api.extends.json'))

const passthroughValues = [true, false, 'child']

const slotRE = /slots\[\s*['"](\S+)['"]\s*\]|slots\.([A-Za-z]+)/g
const emitRE = /emit\(\s*['"](\S+)['"]/g
const assignRE = /Object\.assign\(\s*(?:vm\.)?proxy\s*,\s*\{/g
const assignEntryRE = /^[A-Za-z$_][\w$]*$/

const apiIgnoreValueRegex = /^# /
const apiValuePromiseRegex = /\.then\(/
const apiValueRegex = {
  Number: /^-?\d/,
  String: /^'[^']*'$/,
  Array: /^\[.*\]$/,
  Object: /^{.*}$/,
  Boolean: /^(true|false)$/,
  Function: / => /,
  RegExp: /^\/.*\/[gimuy]*$/,
  Element: /(^document\.|^\..+|^#.+|.+El$|\$refs)/,
  Component: /^[A-Z][A-Za-z]+$/,
  'Promise<any>': apiValuePromiseRegex,
  'Promise<void>': apiValuePromiseRegex,
  'Promise<boolean>': apiValuePromiseRegex,
  'Promise<number>': apiValuePromiseRegex,
  'Promise<string>': apiValuePromiseRegex,
  'Promise<object>': apiValuePromiseRegex,
  null: /^null$/,
  undefined: /^void 0$/
}

const topSections = {
  // also update /ui/test/specs/generators/generator.plugin.js on the rootProps
  plugin: {
    rootProps: [], // computed after this declaration
    rootValidations: {
      meta: val => Object(val) === val || "'meta' must be an Object",
      addedIn: parseAddedIn,
      internal: val =>
        typeof val === 'boolean' || '"internal" must be a Boolean',
      injection: val =>
        typeof val === 'string' || '"injection must be a string"',
      quasarConfOptions: val =>
        Object(val) === val || "'quasarConfOptions' must be an Object",
      props: val => parseObjectWithPascalCaseProps(val, 'props'),
      methods: val => parseObjectWithPascalCaseProps(val, 'methods')
    }
  },

  // also update: /ui/test/specs/generators/generator.component.js on the rootProps
  component: {
    rootProps: [], // computed after this declaration
    rootValidations: {
      meta: val => Object(val) === val || "'meta' must be an Object",
      addedIn: parseAddedIn,
      quasarConfOptions: val =>
        parseObjectWithPascalCaseProps(val, 'quasarConfOptions'),
      props: val => parseObjectWithKebabCaseProps(val, 'props'),
      slots: val => Object(val) === val || "'slots' must be an Object", // TODO Qv3: kebabCase
      events: val => parseObjectWithKebabCaseProps(val, 'events'),
      methods: val => parseObjectWithPascalCaseProps(val, 'methods'),
      computedProps: val => parseObjectWithPascalCaseProps(val, 'computedProps')
    }
  },

  // also update /ui/test/specs/generators/generator.directive.js on the rootProps
  directive: {
    rootProps: [], // computed after this declaration
    rootValidations: {
      meta: val => Object(val) === val || "'meta' must be an Object",
      addedIn: parseAddedIn,
      quasarConfOptions: val =>
        parseObjectWithPascalCaseProps(val, 'quasarConfOptions'),
      value: val => Object(val) === val || "'value' must be an Object",
      arg: val => Object(val) === val || "'arg' must be an Object",
      modifiers: val => parseObjectWithPascalCaseProps(val, 'modifiers')
    }
  }
}
Object.keys(topSections).forEach(section => {
  topSections[section].rootProps = Object.keys(
    topSections[section].rootValidations
  )
})

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
// https://regex101.com/r/vkijKf/1/
const semanticRE =
  /^v(0|[1-9]\d*)\.(0|[1-9]\d*)(\.(0|[1-9]\d*))?(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

function parseAddedIn(val) {
  if (val === void 0 || val === null) {
    return '"addedIn" has erroneous content'
  }

  if (typeof val !== 'string') {
    return '"addedIn" is not a string'
  }

  if (val.length === 0) {
    return '"addedIn" is empty'
  }

  if (val.at(0) !== 'v') {
    return `"addedIn" value (${val}) must start with "v"`
  }

  if (!semanticRE.test(val)) {
    return `"addedIn" value (${val}) must follow semantic versioning`
  }

  if (val.endsWith('.0')) {
    return `"addedIn" value (${val}) must not end with '.0' (remove it)`
  }

  return true
}

function parseObjectWithPascalCaseProps(obj, objName) {
  if (Object(obj) !== obj) {
    return `"${objName}" must be an Object`
  }

  const invalidProps = []
  for (const key in obj) {
    if (key !== camelCase(key)) {
      invalidProps.push(key)
    }
  }

  return (
    invalidProps.length === 0 ||
    `"${objName}" has non camelCase key${plural(invalidProps.length)}: ${invalidProps.join(', ')}`
  )
}

function parseObjectWithKebabCaseProps(obj, objName) {
  if (Object(obj) !== obj) {
    return `"${objName}" must be an Object`
  }

  const invalidProps = []
  for (const key in obj) {
    if (key !== kebabCase(key)) {
      invalidProps.push(key)
    }
  }

  return (
    invalidProps.length === 0 ||
    `"${objName}" has non kebab-case key${plural(invalidProps.length)}: ${invalidProps.join(', ')}`
  )
}

const nativeTypes = [
  'Component',
  'Error',
  'Element',
  'File',
  'FileList',
  'Event',
  'SubmitEvent'
]

const objectTypes = {
  Boolean: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'default',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isArray: ['examples'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  String: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'values',
      'default',
      'examples',
      'category',
      'addedIn',
      'transformAssetUrls',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'transformAssetUrls',
      'internal'
    ],
    isArray: ['examples', 'values'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  Number: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'values',
      'default',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isArray: ['examples', 'values'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  Object: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'autoDefineTsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'values',
      'default',
      'definition',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    recursive: ['definition'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isObject: ['definition'],
    isArray: ['examples', 'values'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  Array: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'autoDefineTsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'values',
      'default',
      'definition',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isObject: ['definition'],
    isArray: ['examples', 'values'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  Promise: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'default',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isObject: ['definition'],
    isArray: ['examples'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  Function: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'autoDefineTsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'default',
      'params',
      'returns',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc', 'params', 'returns'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isObject: ['params', 'returns'],
    isArray: ['examples'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  MultipleTypes: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'autoDefineTsType',
      'desc',
      'required',
      'reactive',
      'sync',
      'syncable',
      'link',
      'values',
      'default',
      'definition',
      'params',
      'returns',
      'examples',
      'category',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isBoolean: [
      'tsInjectionPoint',
      'required',
      'reactive',
      'sync',
      'syncable',
      'internal'
    ],
    isObject: ['definition', 'params', 'returns'],
    isArray: ['examples', 'values'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  },

  meta: {
    props: ['docsUrl'],
    required: ['docsUrl']
  },

  // component only
  slots: {
    props: ['tsType', 'desc', 'link', 'scope', 'addedIn', 'internal'],
    required: ['desc'],
    isObject: ['scope'],
    isBoolean: ['internal'],
    isString: ['tsType', 'desc', 'addedIn']
  },

  // component only
  events: {
    props: [
      'tsType',
      'desc',
      'link',
      'params',
      'addedIn',
      'passthrough',
      'internal'
    ],
    required: ['desc'],
    isObject: ['params'],
    isBoolean: ['internal'],
    isString: ['tsType', 'desc', 'addedIn']
  },

  // component only
  computedProps: {
    props: ['desc', 'tsType', 'examples', 'addedIn', 'internal'],
    required: ['desc'],
    isBoolean: ['internal'],
    isArray: ['examples'],
    isString: ['tsType', 'desc', 'addedIn']
  },

  methods: {
    props: [
      'tsInjectionPoint',
      'tsType',
      'desc',
      'link',
      'params',
      'returns',
      'addedIn',
      'alias'
    ],
    required: ['desc', 'params', 'returns'],
    isBoolean: ['tsInjectionPoint'],
    isObject: ['params', 'returns'],
    isString: ['tsType', 'desc', 'link', 'addedIn', 'alias']
  },

  quasarConfOptions: {
    props: [
      'tsType',
      'desc',
      'propName',
      'definition',
      'values',
      'examples',
      'link',
      'addedIn'
    ],
    required: ['propName'],
    isObject: ['definition'],
    isArray: ['values'],
    isString: ['tsType', 'desc', 'addedIn']
  }
}

nativeTypes.forEach(name => {
  objectTypes[name] = {
    props: [
      'tsType',
      'desc',
      'required',
      'category',
      'examples',
      'addedIn',
      'internal'
    ],
    required: ['desc'],
    isBoolean: ['internal', 'required'],
    isString: ['tsType', 'desc', 'category', 'addedIn']
  }
})

/**
 * Also update /ui/test/specs/specs.utils.js on the "typeMap" object
 */
const typeList = [
  'Number',
  'String',
  'Array',
  'Object',
  'Boolean',
  'Function',
  'RegExp',
  'Date',
  'Element',
  'Any',
  'Event',
  'SubmitEvent',
  'File',
  'FileList',
  'Promise<any>',
  'Promise<void>',
  'Promise<boolean>',
  'Promise<number>',
  'Promise<string>',
  'Promise<object>',
  'Error',
  'Component',
  'null',
  'undefined'
]

// assumes type does NOT have any duplicates
function isClassStyleType(type) {
  if (!Array.isArray(type)) return false
  if (type.length !== 3) return false

  let hits = 0

  ;['String', 'Array', 'Object'].forEach(entry => {
    if (type.includes(entry)) hits++
  })

  return hits === 3
}

// See https://github.com/quasarframework/quasar/issues/16046#issuecomment-1666395268 for more info
const serializableTypes = [
  'Any',
  'Boolean',
  'Number',
  'String',
  'Array',
  'Object'
]
function isSerializable(value) {
  const types = Array.isArray(value.type) ? value.type : [value.type]
  return types.every(type => serializableTypes.includes(type))
}

/**
 * Object-form mixins
 *
 * Next to the string form, a "mixins" entry can be an Object that pulls
 * definitions from another component/plugin/directive API file, so that
 * pass-through definitions inherit type/values/default/examples/addedIn
 * from their source instead of hand-copying them (which drifts):
 *
 *   {
 *     "from": "components/menu/QMenu",
 *     "include?": { "props": "all", "events": ["escape-key"] },
 *     "exclude?": { "props": ["separate-close-popup"] },
 *     "rename?": { "props": { "anchor": "menu-anchor" } },
 *     "overrideAll?": {
 *       "props": {
 *         "passthrough": true,
 *         "category": "menu",
 *         "__desc__suffix": "; Only applies when a Menu is used"
 *       }
 *     },
 *     "overrides?": {
 *       "props": {
 *         "max-height": { "type": "String", "default": "'99vh'" }
 *       }
 *     },
 *     "explicitOverrideForAll?": true
 *   }
 *
 * - "from" resolves the source's fully merged API (cached and
 *   cycle-guarded); "meta" never travels and "internal" entries are
 *   skipped. Definitions of the pulling file itself (own JSON or
 *   string-form mixins) always win over pulls.
 * - "include"/"exclude"/"overrideAll"/"overrides" are all keyed by
 *   section ("props", "slots", "events", "methods", ...). "include"
 *   present means a strict allowlist (unlisted sections are not
 *   pulled); omitted means everything. Each section is "all" or an
 *   Array of entry names. "exclude" prunes after "include".
 * - "rename" (also keyed by section) maps a source entry name to the
 *   name it gets on the pulling file (e.g. QMenu's "anchor" pulled as
 *   "menu-anchor"). It applies after "include"/"exclude" (which use
 *   source names); "overrides" and "explicitOverrideForAll" use the
 *   final (renamed) names.
 * - Every name in "include"/"exclude"/"rename"/"overrides" is
 *   existence-checked against the source, and an override must target
 *   an actually pulled entry, so a renamed/removed source entry fails
 *   the build here.
 * - "overrideAll" merges its keys into every pulled entry of that
 *   section; "overrides" > "overrideAll" > pulled definition. Inside an
 *   override, "__delete" (Array) removes inherited keys.
 * - "__<key>__prefix" / "__<key>__suffix" (in "overrideAll" or in a
 *   per-entry override) append to the inherited String value instead of
 *   replacing it; a key addressed by an entry's own override escapes
 *   the section-wide affixes for that key.
 * - The same entry pulled from two sources with differing final
 *   definitions is an error: exclude it in one of them or align it via
 *   "overrides".
 * - "explicitOverrideForAll" requires an "overrides" entry (an empty
 *   Object suffices) for every pulled entry, so an addition on the
 *   source breaks the build until the pulling file makes a conscious
 *   call; without it, additions flow in (and the Specs test workflow
 *   still demands a test-case for them).
 */
const objectMixinKeys = [
  'from',
  'include',
  'exclude',
  'rename',
  'overrideAll',
  'overrides',
  'explicitOverrideForAll'
]
const objectMixinSectionBlocklist = ['meta', 'addedIn', 'quasarConfOptions']
const objectMixinApiTypes = [
  ['components/', 'component'],
  ['plugins/', 'plugin'],
  ['directives/', 'directive']
]
const objectMixinAffixRE = /^__(\w+)__(prefix|suffix)$/

const objectMixinSourceCache = new Map()
const objectMixinSourcePending = new Set()

function stripUndefinedMarkers(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === void 0) {
      delete obj[key]
    } else if (Object(obj[key]) === obj[key]) {
      stripUndefinedMarkers(obj[key])
    }
  }
}

function getObjectMixinSource(from, printErrorAndExit) {
  const apiTypeEntry = objectMixinApiTypes.find(([prefix]) =>
    from.startsWith(prefix)
  )

  if (apiTypeEntry === void 0) {
    printErrorAndExit(
      '"from" must point to a component, plugin or directive API file'
    )
  }

  const file = resolveToRoot('src/' + from + '.json')

  if (!fse.existsSync(file)) {
    printErrorAndExit('no such API file to pull from')
  }

  if (objectMixinSourcePending.has(file)) {
    printErrorAndExit('circular "from" reference')
  }

  if (!objectMixinSourceCache.has(file)) {
    objectMixinSourcePending.add(file)
    objectMixinSourceCache.set(file, parseAPI(file, apiTypeEntry[1]))
    objectMixinSourcePending.delete(file)
  }

  return objectMixinSourceCache.get(file)
}

function applyObjectMixins(api, objectMixins, mainFile) {
  // section -> name -> { from, def }
  const pulled = {}

  objectMixins.forEach(mixin => {
    const printErrorAndExit = msg => {
      logError(
        `build.api.js: ${relativeToRoot(mainFile)} -> "mixins" ` +
          `(from "${mixin.from}") -> ${msg}`
      )
      console.log()
      process.exit(1)
    }

    if (typeof mixin.from !== 'string') {
      printErrorAndExit('"from" must be a String')
    }

    for (const key of Object.keys(mixin)) {
      if (!objectMixinKeys.includes(key)) {
        printErrorAndExit(`unrecognized "${key}" key`)
      }
    }

    if (
      mixin.explicitOverrideForAll !== void 0 &&
      typeof mixin.explicitOverrideForAll !== 'boolean'
    ) {
      printErrorAndExit('"explicitOverrideForAll" must be a Boolean')
    }

    const source = getObjectMixinSource(mixin.from, printErrorAndExit)
    const sourceSections = Object.keys(source).filter(
      section => !objectMixinSectionBlocklist.includes(section)
    )

    const readFilter = (filter, filterName) => {
      if (filter === void 0) return null

      if (Object(filter) !== filter || Array.isArray(filter)) {
        printErrorAndExit(`"${filterName}" must be an Object keyed by section`)
      }

      for (const section of Object.keys(filter)) {
        if (!sourceSections.includes(section)) {
          printErrorAndExit(
            `"${filterName}" > "${section}" is not a pullable section of ` +
              `${mixin.from}; available: ${sourceSections.join(', ')}`
          )
        }

        const val = filter[section]

        if (
          val !== 'all' &&
          (!Array.isArray(val) ||
            val.length === 0 ||
            val.some(name => typeof name !== 'string'))
        ) {
          printErrorAndExit(
            `"${filterName}" > "${section}" must be "all" or a non-empty Array of Strings`
          )
        }
      }

      return filter
    }

    const include = readFilter(mixin.include, 'include')
    const exclude = readFilter(mixin.exclude, 'exclude')

    // section -> Map(final name -> source name);
    // insertion order follows the source file
    const selected = {}
    const includedSections =
      include === null ? sourceSections : Object.keys(include)

    for (const section of includedSections) {
      const useAll = include === null || include[section] === 'all'
      const names = useAll ? Object.keys(source[section]) : include[section]

      if (!useAll) {
        for (const name of names) {
          if (source[section][name] === void 0) {
            printErrorAndExit(
              `"include" > "${section}" > "${name}" does not exist on ${mixin.from}`
            )
          }
        }
      }

      selected[section] = new Map(names.map(name => [name, name]))
    }

    if (exclude !== null) {
      for (const section of Object.keys(exclude)) {
        if (selected[section] === void 0) {
          printErrorAndExit(
            `"exclude" > "${section}" has no effect ("include" does not select that section)`
          )
        }

        if (exclude[section] === 'all') {
          delete selected[section]
          continue
        }

        for (const name of exclude[section]) {
          if (!selected[section].has(name)) {
            printErrorAndExit(
              `"exclude" > "${section}" > "${name}" has no effect (not in the included set)`
            )
          }

          selected[section].delete(name)
        }
      }
    }

    if (mixin.rename !== void 0) {
      if (
        Object(mixin.rename) !== mixin.rename ||
        Array.isArray(mixin.rename)
      ) {
        printErrorAndExit('"rename" must be an Object keyed by section')
      }

      for (const section of Object.keys(mixin.rename)) {
        if (selected[section] === void 0) {
          printErrorAndExit(
            `"rename" > "${section}" has no effect (nothing is pulled from that section)`
          )
        }

        const sectionRenames = mixin.rename[section]

        if (Object(sectionRenames) !== sectionRenames) {
          printErrorAndExit(`"rename" > "${section}" must be an Object`)
        }

        for (const sourceName of Object.keys(sectionRenames)) {
          const finalName = sectionRenames[sourceName]

          if (typeof finalName !== 'string' || finalName.length === 0) {
            printErrorAndExit(
              `"rename" > "${section}" > "${sourceName}" must map to a non-empty String`
            )
          }

          if (!selected[section].has(sourceName)) {
            printErrorAndExit(
              `"rename" > "${section}" > "${sourceName}" does not target a pulled entry`
            )
          }

          if (selected[section].has(finalName)) {
            printErrorAndExit(
              `"rename" > "${section}" > "${sourceName}" -> "${finalName}" collides with another pulled entry`
            )
          }
        }

        // re-key while preserving the source file's insertion order
        selected[section] = new Map(
          [...selected[section]].map(([finalName, sourceName]) => [
            sectionRenames[sourceName] !== void 0
              ? sectionRenames[sourceName]
              : finalName,
            sourceName
          ])
        )
      }
    }

    // internal entries never travel; definitions of the target file
    // itself (own JSON or string-form mixins) always win over pulls
    for (const section of Object.keys(selected)) {
      for (const [name, sourceName] of selected[section]) {
        if (
          source[section][sourceName].internal === true ||
          api[section]?.[name] !== void 0
        ) {
          selected[section].delete(name)
        }
      }

      if (selected[section].size === 0) {
        delete selected[section]
      }
    }

    const readOverrideMap = (value, keyName) => {
      if (value === void 0) return null

      if (Object(value) !== value || Array.isArray(value)) {
        printErrorAndExit(`"${keyName}" must be an Object keyed by section`)
      }

      for (const section of Object.keys(value)) {
        if (selected[section] === void 0) {
          printErrorAndExit(
            `"${keyName}" > "${section}" has no effect (nothing is pulled from that section)`
          )
        }

        if (Object(value[section]) !== value[section]) {
          printErrorAndExit(`"${keyName}" > "${section}" must be an Object`)
        }
      }

      return value
    }

    const overrideAll = readOverrideMap(mixin.overrideAll, 'overrideAll')
    const overrides = readOverrideMap(mixin.overrides, 'overrides')

    if (overrides !== null) {
      for (const section of Object.keys(overrides)) {
        for (const name of Object.keys(overrides[section])) {
          if (Object(overrides[section][name]) !== overrides[section][name]) {
            printErrorAndExit(
              `"overrides" > "${section}" > "${name}" must be an Object`
            )
          }

          if (!selected[section].has(name)) {
            printErrorAndExit(
              `"overrides" > "${section}" > "${name}" does not target a pulled entry ` +
                '(it is not included, excluded, internal, or already defined by the target file)'
            )
          }
        }
      }
    }

    if (mixin.explicitOverrideForAll === true) {
      const missing = []

      for (const section of Object.keys(selected)) {
        for (const name of selected[section].keys()) {
          if (overrides?.[section]?.[name] === void 0) {
            missing.push(`"${section}" > "${name}"`)
          }
        }
      }

      if (missing.length !== 0) {
        printErrorAndExit(
          '"explicitOverrideForAll" requires an explicit override ' +
            `(an empty Object suffices) for: ${missing.join(', ')}`
        )
      }
    }

    const applyPlainKeys = (def, spec) => {
      for (const key of Object.keys(spec)) {
        if (!objectMixinAffixRE.test(key)) {
          def[key] = structuredClone(spec[key])
        }
      }
    }

    const applyAffixes = (def, spec, skipKeys, entryLabel) => {
      for (const key of Object.keys(spec)) {
        const match = objectMixinAffixRE.exec(key)
        if (match === null) continue

        const [, target, kind] = match
        if (skipKeys !== null && skipKeys.has(target)) continue

        if (typeof def[target] !== 'string') {
          printErrorAndExit(
            `"${key}" (on ${entryLabel}) targets "${target}" which is not a String`
          )
        }

        def[target] =
          kind === 'prefix' ? spec[key] + def[target] : def[target] + spec[key]
      }
    }

    for (const section of Object.keys(selected)) {
      const oAll = overrideAll?.[section]

      for (const [name, sourceName] of selected[section]) {
        const def = structuredClone(source[section][sourceName])
        const oItem = overrides?.[section]?.[name]
        const entryLabel = `"${section}" > "${name}"`

        // the source went through parseObject already, which leaves
        // undefined-valued markers (e.g. "required") behind, at any
        // nesting level (e.g. method "params")
        stripUndefinedMarkers(def)

        if (oAll !== void 0) applyPlainKeys(def, oAll)
        if (oItem !== void 0) applyPlainKeys(def, oItem)

        if (oAll !== void 0) {
          // a key addressed by the item's own override (as plain value
          // or as affix) escapes the section-wide affixes for that key
          const skipKeys = new Set(
            oItem === void 0
              ? []
              : Object.keys(oItem).map(key => {
                  const match = objectMixinAffixRE.exec(key)
                  return match === null ? key : match[1]
                })
          )

          applyAffixes(def, oAll, skipKeys, entryLabel)
        }

        if (oItem !== void 0) applyAffixes(def, oItem, null, entryLabel)

        const existing = pulled[section]?.[name]

        if (existing !== void 0) {
          if (JSON.stringify(existing.def) !== JSON.stringify(def)) {
            printErrorAndExit(
              `${entryLabel} is also pulled from ${existing.from} with a ` +
                'differing definition; exclude it in one of them or align it via "overrides"'
            )
          }

          continue
        }

        ;(pulled[section] ??= {})[name] = { from: mixin.from, def }
      }
    }
  })

  for (const section of Object.keys(pulled)) {
    api[section] ??= {}

    for (const name of Object.keys(pulled[section])) {
      api[section][name] = pulled[section][name].def
    }
  }

  return api
}

function getApiWithMixins(api, mainFile) {
  const objectMixins = []

  api.mixins.forEach(mixin => {
    if (Object(mixin) === mixin) {
      objectMixins.push(mixin)
      return
    }

    const mixinFile = resolveToRoot('src/' + mixin + '.json')

    if (!fse.existsSync(mixinFile)) {
      logError(
        `build.api.js: ${relativeToRoot(mainFile)} -> no such mixin ${mixin}`
      )
      process.exit(1)
    }

    const content = readJsonFile(mixinFile)

    api = merge(
      {},
      content.mixins === void 0
        ? content
        : getApiWithMixins(content, mixinFile),
      api
    )
  })

  if (objectMixins.length !== 0) {
    api = applyObjectMixins(api, objectMixins, mainFile)
  }

  const { mixins, ...finalApi } = api
  return finalApi
}

function deCapitalize(str) {
  return str.at(0).toLowerCase() + str.slice(1)
}

const arrayRE = /(\[.*\])/
const objectRE = /(\{.*\})/
const functionRE = /^(\s*\(\s*\)\s*=>\s*).+/
function encodeDefaultValue(val, isFunction) {
  if (typeof val === 'string') return `'${val}'`

  if (typeof val === 'function') {
    const fn = val.toString()

    if (isFunction) return fn

    const arrayMatch = fn.match(arrayRE)
    if (arrayMatch !== null) {
      return arrayMatch[1]
    }

    const objMatch = fn.match(objectRE)
    if (objMatch !== null) {
      return objMatch[1]
    }

    const arrowMatch = fn.match(functionRE)
    if (arrowMatch !== null) {
      return fn.slice(arrowMatch[1].length)
    }
  }

  return String(val)
}

const runtimePropTypeToAny = ['File', 'FileList', 'Element']
const runtimePropTypeExceptions = ['null', 'undefined']
function extractRuntimeDefinablePropTypes(apiTypes) {
  if (apiTypes.includes('Any')) {
    return ['Any']
  }

  return apiTypes.some(key => runtimePropTypeToAny.includes(key))
    ? ['Any']
    : apiTypes.filter(key => !runtimePropTypeExceptions.includes(key)).sort()
}

function parseRuntimeType(runtimeConstructor) {
  // String.toString() -> "function String() { [native code] }"
  const str = runtimeConstructor.toString()
  const match = str.match(/function (\w+)\(/)
  return match?.[1]
}

const typeofRE = /typeof\s+[a-zA-Z0-9$_]+\s+===\s+'([a-zA-Z]+)'/
function extractRuntimePropAttrs(runtimeProp) {
  if (Array.isArray(runtimeProp)) {
    return {
      runtimeTypes: runtimeProp.map(parseRuntimeType).sort(),
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  const runtimeType = parseRuntimeType(runtimeProp)
  if (runtimeType !== void 0) {
    return {
      runtimeTypes: [runtimeType],
      isRuntimeRequired: false,
      hasRuntimeDefault: false
    }
  }

  // else... it's a definition in Object form { ... }

  let runtimeTypes

  if (Array.isArray(runtimeProp.type)) {
    runtimeTypes = runtimeProp.type.map(parseRuntimeType)

    if (runtimeTypes.includes('Any')) {
      runtimeTypes = ['Any']
    } else {
      runtimeTypes.sort()
    }
  } else if (runtimeProp.type !== void 0) {
    runtimeTypes = [parseRuntimeType(runtimeProp.type)]
  } else if (runtimeProp.validator !== void 0) {
    /**
     * Example (we want Number AND null to be valid):
     *
     * modelValue: {
     *   default: null,
     *   validator: v => typeof v === 'number' || v === null
     * }
     */

    runtimeTypes = []
    const fn = runtimeProp.validator.toString()

    const match = fn.match(typeofRE)
    if (match !== null) {
      runtimeTypes.push(capitalize(match[1]))
    }

    if (fn.includes('Array.isArray')) {
      runtimeTypes.push('Array')
    }

    if (fn.includes('Object')) {
      runtimeTypes.push('Object')
    }

    if (runtimeTypes.length === 0) {
      runtimeTypes = []
    } else {
      runtimeTypes.sort()
    }
  } else {
    runtimeTypes = ['Any']
  }

  return {
    runtimeTypes,
    isRuntimeRequired: runtimeProp.required === true,
    hasRuntimeDefault: Object.hasOwn(runtimeProp, 'default'),
    runtimeDefaultValue: runtimeProp.default
  }
}

function parseObject({
  banner,
  api,
  itemName,
  masterType,
  verifyCategory,
  verifySerializable
}) {
  let obj = api[itemName]

  const printErrorAndExit = msg => {
    logError(`${banner} ${msg}`)
    console.error(obj)
    console.log()
    process.exit(1)
  }

  if (Object.hasOwn(obj, 'addedIn')) {
    const result = parseAddedIn(obj.addedIn)
    if (result !== true) {
      printErrorAndExit(result)
    }
  }

  if (Object.hasOwn(obj, 'extends') && extendApi[masterType] !== void 0) {
    if (extendApi[masterType][obj.extends] === void 0) {
      printErrorAndExit(`extends "${obj.extends}" which does not exists`)
    }

    api[itemName] = merge({}, extendApi[masterType][obj.extends], api[itemName])
    delete api[itemName].extends

    obj = api[itemName]
  }

  // there are cases where you extend something but you
  // need to remove some props from the extended object
  if (obj.__delete !== void 0) {
    if (!Array.isArray(obj.__delete)) {
      printErrorAndExit('"__delete" prop must be an Array')
    }

    if (obj.__delete.some(prop => typeof prop !== 'string')) {
      printErrorAndExit('"__delete" prop must be an Array of Strings')
    }

    obj.__delete.forEach(prop => {
      delete obj[prop]
    })

    // now delete the __delete prop itself (we don't need it in the final API)
    delete obj.__delete
  }

  let type

  if (['props', 'modifiers'].includes(masterType)) {
    if (obj.type === void 0) {
      printErrorAndExit('missing "type" prop')
    }

    type =
      Array.isArray(obj.type) || obj.type === 'Any' ? 'MultipleTypes' : obj.type
  } else {
    type = masterType
  }

  type = type.startsWith('Promise') ? 'Promise' : type
  const def = objectTypes[type]

  if (def === void 0) {
    printErrorAndExit(`object has unrecognized API type prop value: "${type}"`)
  }

  if (obj.internal !== true) {
    const regexList = Array.isArray(obj.type)
      ? obj.type.includes('Any')
        ? []
        : obj.type.map(t => apiValueRegex[t]).filter(Boolean)
      : obj.type === 'Any'
        ? []
        : [apiValueRegex[obj.type]].filter(Boolean)

    for (const prop in obj) {
      // These props are always valid and doesn't need to be specified in 'props' of 'objectTypes' entries
      if (['type', '__exemption'].includes(prop)) {
        continue
      }

      if (prop === '__runtimeDefault') {
        if (obj.__runtimeDefault !== true) {
          printErrorAndExit(
            'props > "__runtimeDefault" should only be set to true; Solutions:' +
              '\n  1. delete it as it is indeed an error' +
              '\n  2. it is being inherited, so add "delete": [ "__runtimeDefault" ]'
          )
        }

        continue
      }

      // 'configFileType' is always valid in any level of 'quasarConfOptions' and nothing else
      if (prop === 'configFileType' && banner.includes('"quasarConfOptions"')) {
        continue
      }

      if (!def.props.includes(prop)) {
        printErrorAndExit(
          `object has unrecognized API prop "${prop}" for its type (${type})`
        )
      }
    }

    ;[...def.required, ...(verifyCategory ? ['category'] : [])].forEach(
      prop => {
        if (obj.__exemption !== void 0 && obj.__exemption.includes(prop)) {
          return
        }

        // 'examples' property is not required if 'definition' or 'values' properties are specified
        if (
          prop === 'examples' &&
          (obj.definition !== void 0 || obj.values !== void 0)
        ) {
          const matchedProp =
            obj.definition === void 0 ? 'values' : 'definition'

          printErrorAndExit(
            `"examples" is not needed because there is "${matchedProp}"; remove it`
          )
          return
        }

        if (obj[prop] === void 0) {
          printErrorAndExit(
            `missing required API prop "${prop}" for its type (${type})`
          )
        }
      }
    )

    // Since we processed '__exemption', we can strip it
    if (obj.__exemption !== void 0) {
      const { __exemption, ...p } = obj
      api[itemName] = p
    }

    if (def.isBoolean) {
      def.isBoolean.forEach(prop => {
        if (
          Object.hasOwn(obj, prop) &&
          obj[prop] !== true &&
          obj[prop] !== false
        ) {
          printErrorAndExit(`"${prop}" is not a Boolean`)
        }
      })
    }

    if (def.isObject) {
      def.isObject.forEach(prop => {
        if (obj[prop] && Object(obj[prop]) !== obj[prop]) {
          printErrorAndExit(`"${prop}" is not an Object`)
        }
      })
    }

    if (def.isArray) {
      def.isArray.forEach(prop => {
        if (obj[prop] && !Array.isArray(obj[prop])) {
          printErrorAndExit(`"${prop}" is not an Array`)
        }
      })
    }

    if (def.isString) {
      def.isString.forEach(prop => {
        if (obj[prop] && typeof obj[prop] !== 'string') {
          printErrorAndExit(`"${prop}" is not a String`)
        }
      })
    }

    if (obj.type) {
      const list = Array.isArray(obj.type) ? obj.type : [obj.type]
      list.forEach(t => {
        if (!typeList.includes(t)) {
          printErrorAndExit(
            `object has unrecognized type "${t}"; if this is a new type, then ` +
              'add it to the "typeList" array in build.api.js'
          )
        }
      })
    }

    if (obj.values) {
      if (obj.values.some(val => typeof val !== 'string')) {
        printErrorAndExit('object: stringify each of "values" entries')
      }

      if (regexList.length !== 0) {
        obj.values.forEach(val => {
          if (
            !apiIgnoreValueRegex.test(val) &&
            regexList.every(regex => !regex.test(val))
          ) {
            printErrorAndExit(
              `object: "values" -> "${val}" value must satisfy regex: ` +
                `${regexList.map(r => r.toString()).join(' or ')}`
            )
          }
        })
      }
    }

    if (Object.hasOwn(obj, 'default')) {
      if (typeof obj.default !== 'string') {
        printErrorAndExit('object: stringify "default" value')
      }

      if (!apiIgnoreValueRegex.test(obj.default)) {
        if (
          regexList.length !== 0 &&
          regexList.every(regex => !regex.test(obj.default))
        ) {
          printErrorAndExit(
            `object: "default" value must satisfy regex: ${regexList.map(r => r.toString()).join(' or ')}`
          )
        }

        if (obj.values && !obj.values.includes(obj.default)) {
          printErrorAndExit(
            'object: "default" value must be one of the "values"'
          )
        }
      }
    }

    if (obj.examples !== void 0) {
      if (obj.examples.some(val => typeof val !== 'string')) {
        printErrorAndExit('object: stringify each of "examples" entries')
      }

      if (regexList.length !== 0) {
        obj.examples.forEach(val => {
          if (
            !apiIgnoreValueRegex.test(val) &&
            regexList.every(regex => !regex.test(val))
          ) {
            printErrorAndExit(
              `object: "examples" -> "${val}" value must satisfy regex: ${regexList.map(r => r.toString()).join(' or ')}`
            )
          }
        })
      }

      if (new Set(obj.examples).size !== obj.examples.length) {
        printErrorAndExit('object has "examples" Array with duplicates')
      }
    }

    if (
      Object.hasOwn(obj, 'passthrough') &&
      !passthroughValues.includes(obj.passthrough)
    ) {
      printErrorAndExit(
        `"passthrough" should be one of: ${passthroughValues.join('|')}`
      )
    }

    if (
      obj.default !== void 0 &&
      obj.required === true &&
      (Array.isArray(obj.type)
        ? !obj.type.includes('Any') && !obj.type.includes('undefined')
        : !['Any', 'undefined'].includes(obj.type))
    ) {
      printErrorAndExit(
        'cannot have "required" as true since it is optional because it has "default" ' +
          '(if default is still required as it handles the "undefined" value, then ' +
          'add "__requireWithDefault": true)'
      )
    }

    // If required is specified, use it, if not and it has a default value, then it's optional,
    // otherwise use undefined so it can get overridden later
    api[itemName].required =
      obj.required !== void 0
        ? obj.required
        : obj.default !== void 0
          ? false
          : void 0
  }

  if (obj.tsType && obj.autoDefineTsType === true && !obj.definition) {
    printErrorAndExit(
      `object is auto defining "${obj.tsType}" TS type but it is missing "definition" prop`
    )
  }

  if (masterType === 'props') {
    if (Array.isArray(obj.type) && new Set(obj.type).size !== obj.type.length) {
      printErrorAndExit(
        'object has "type" defined as Array, but the Array contains duplicates'
      )
    }

    if (itemName.includes('class')) {
      if (obj.type === 'Object' && obj.tsType !== 'VueClassObjectProp') {
        printErrorAndExit(
          'object is class-type (Object form) but "tsType" prop is set to ' +
            `"${obj.tsType}" instead of "VueClassObjectProp":`
        )
      } else if (obj.tsType !== 'VueClassProp' && isClassStyleType(obj.type)) {
        printErrorAndExit(
          'object is class-type (String/Array/Object form) but "tsType" prop ' +
            `is set to "${obj.tsType}" instead of "VueClassProp":`
        )
      }
    } else if (itemName.includes('style')) {
      if (obj.type === 'Object' && obj.tsType !== 'VueStyleObjectProp') {
        printErrorAndExit(
          'object is style-type (Object form) but "tsType" prop is ' +
            `set to "${obj.tsType}" instead of "VueStyleObjectProp":`
        )
      } else if (obj.tsType !== 'VueStyleProp' && isClassStyleType(obj.type)) {
        printErrorAndExit(
          'object is style-type (String/Array/Object form) but "tsType" prop ' +
            `is set to "${obj.tsType}" instead of "VueStyleProp":`
        )
      }
    }

    if (
      verifySerializable &&
      obj.configFileType === void 0 &&
      !isSerializable(obj)
    ) {
      printErrorAndExit(
        'object\'s type is non-serializable but props in "quasarConfOptions" can only consist of ' +
          `${serializableTypes.join('/')} to be used in quasar.config file. Use "configFileType" ` +
          'prop to specify a serializable type for quasar.config file, or set to null if there is no suitable type:'
      )
    }
  }

  // If it must be synced, then it is syncable too (v-model:xyz)
  if (obj.sync === true) obj.syncable = true

  if (obj.returns) {
    parseObject({
      banner: `${banner}/"returns"`,
      api: api[itemName],
      itemName: 'returns',
      masterType: 'props'
    })
  }

  ;['params', 'definition', 'scope', 'props'].forEach(prop => {
    if (!obj[prop]) return

    for (const item in obj[prop]) {
      parseObject({
        banner: `${banner}/"${prop}"/"${item}"`,
        api: api[itemName][prop],
        itemName: item,
        masterType: 'props',
        verifySerializable
      })
    }
  })
}

function findMatchingBrace(content, startIndex) {
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = startIndex; index < content.length; index++) {
    const char = content[index]

    if (quote !== null) {
      if (escaped === true) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = null
      }

      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') depth++
    if (char === '}') {
      depth--
      if (depth === 0) return index
    }
  }

  return -1
}

function splitTopLevelObjectEntries(content) {
  const entries = []
  let start = 0
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = 0; index < content.length; index++) {
    const char = content[index]

    if (quote !== null) {
      if (escaped === true) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = null
      }

      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '(' || char === '[' || char === '{') depth++
    if (char === ')' || char === ']' || char === '}') depth--

    if (char === ',' && depth === 0) {
      entries.push(content.slice(start, index).trim())
      start = index + 1
    }
  }

  entries.push(content.slice(start).trim())
  return entries.filter(Boolean)
}

function getExposedMethodNames(content) {
  const names = new Set()
  let match

  while ((match = assignRE.exec(content)) !== null) {
    const bodyStart = match.index + match[0].length - 1
    const bodyEnd = findMatchingBrace(content, bodyStart)

    if (bodyEnd === -1) continue

    splitTopLevelObjectEntries(content.slice(bodyStart + 1, bodyEnd)).forEach(
      entry => {
        const key = entry.split(':')[0].trim()

        if (assignEntryRE.test(key)) {
          names.add(key)
        }
      }
    )
  }

  return names
}

function parseAPI(file, apiType) {
  let api = readJsonFile(file)

  if (api.mixins !== void 0) {
    api = getApiWithMixins(api, file)
  }

  const banner = `build.api.js: ${relativeToRoot(file)} -> `
  const printErrorAndExit = msg => {
    logError(`${banner} ${msg}`)
    console.log()
    process.exit(1)
  }

  if (api.meta === void 0 || api.meta.docsUrl === void 0) {
    printErrorAndExit('API file does not contain meta > docsUrl')
  }

  // "props", "slots", ...
  for (const type in api) {
    if (!topSections[apiType].rootProps.includes(type)) {
      printErrorAndExit(` "${type}" is not recognized for a ${apiType}`)
    }

    if (Object.hasOwn(api, type)) {
      const result = topSections[apiType].rootValidations[type](api[type])
      if (result !== true) {
        printErrorAndExit(result)
      }
    }
  }

  const handledTypes = ['addedIn', 'injection']

  for (const type of ['meta', 'quasarConfOptions']) {
    if (api[type] !== void 0) {
      parseObject({
        banner: `${banner} "${type}"`,
        api,
        itemName: type,
        masterType: type,
        verifySerializable: type === 'quasarConfOptions'
      })
    }
  }
  handledTypes.push('meta', 'quasarConfOptions')

  for (const type of ['value', 'arg']) {
    if (api[type] !== void 0) {
      parseObject({
        banner: `${banner} "${type}"`,
        api,
        itemName: type,
        masterType: 'props'
      })
    }
  }
  handledTypes.push('value', 'arg')

  const isComponent = banner.includes('component')

  for (const type in api) {
    const targetApi = api[type]
    if (handledTypes.includes(type)) continue

    for (const itemName in targetApi) {
      parseObject({
        banner: `${banner} "${type}"/"${itemName}"`,
        api: targetApi,
        itemName,
        masterType: type === 'computedProps' ? 'props' : type,
        verifyCategory: type === 'props' && isComponent
      })
    }
  }

  return api
}

function orderAPI(api, apiType) {
  const ordered = { type: apiType }

  topSections[apiType].rootProps.forEach(section => {
    if (api[section] !== void 0) {
      ordered[section] = api[section]
    }
  })

  return ordered
}

function fillAPI(apiType, list, encodeFn) {
  return async file => {
    const name = basename(file)
    const filePath = join(dest, name)
    const api = orderAPI(parseAPI(file, apiType), apiType)

    if (apiType === 'component') {
      let hasError = false

      const componentPath = file.replace('.json', '.js')
      const componentName = name.replace('.json', '.js')
      const componentContent = fse.readFileSync(componentPath, 'utf8')

      let RuntimeComponent

      try {
        const comp = await import(pathToFileURL(componentPath))

        RuntimeComponent = comp.default
      } catch (err) {
        logError(
          `${componentName}: failed to import Component file; check if it is a valid ES module`
        )
        console.error(err)
        process.exit(1)
      }

      const apiProps = api.props || {}
      const apiEvents = api.events || {}
      const apiSlots = api.slots || {}
      const apiMethods = api.methods || {}

      const runtimeProps = RuntimeComponent.props || {}
      const runtimeEmits = RuntimeComponent.emits || []

      let match

      while ((match = slotRE.exec(componentContent)) !== null) {
        const slotName = (match[1] || match[2]).replaceAll(
          /(\${.+})/g,
          '[name]'
        )

        if (apiSlots[slotName] === void 0) {
          logError(
            `${name}: missing "slot" -> "${slotName}" definition (found slots usage with it)`
          )
          hasError = true
        }
      }

      while ((match = emitRE.exec(componentContent)) !== null) {
        const matchedEmit = match[1]
        const emitName = kebabCase(deCapitalize(matchedEmit)) // deCapitalize because: QTable > emit('RowClick')
        const propName = `on${capitalize(matchedEmit)}`

        if (
          !runtimeEmits.includes(matchedEmit) &&
          runtimeProps[propName] === void 0
        ) {
          logError(
            `${componentName}: Component is emitting "${matchedEmit}" event without having ` +
              'it defined in its code; Solutions:' +
              `\n   1. add it in the Component as "emits: [ '${matchedEmit}' ]"` +
              `\n   2. or as "props: { ${propName}: ... }"`
          )
          hasError = true
        }

        if (apiEvents[emitName] === void 0) {
          logError(
            `${name}: missing "events" -> "${emitName}" definition (found emit() with it)`
          )
          hasError = true
        }
      }

      // runtime props should be defined in the API
      for (const runtimePropName in runtimeProps) {
        const apiPropName = kebabCase(runtimePropName)
        const apiEntry = apiProps[apiPropName]

        if (runtimePropName.includes('-')) {
          logError(
            `${componentName}: prop "${runtimePropName}" should be ` +
              'in camelCase (found kebab-case)'
          )
          hasError = true
        }

        if (/^on[A-Z]/.test(runtimePropName)) {
          const strippedPropName = runtimePropName.slice(2) // strip "on" prefix
          const runtimeEmitName = deCapitalize(strippedPropName)
          const apiEventName = kebabCase(strippedPropName)

          // should not duplicate as prop and emit
          if (runtimeEmits.includes(runtimeEmitName)) {
            logError(
              `${componentName}: Component has duplicated prop (${runtimePropName}) + ` +
                `emit (${runtimeEmitName}); only one should be defined`
            )
            hasError = true
          }

          if (apiEntry !== void 0) {
            logError(
              `${name}: "props" -> "${apiPropName}" should instead be defined ` +
                `as "events" -> "${apiEventName}"`
            )
            hasError = true
          }

          if (apiEvents[apiEventName] === void 0) {
            logError(
              `${name}: missing "events" -> "${apiEventName}" definition ` +
                `(found Component prop "${runtimePropName}")`
            )
            hasError = true
          }

          continue
        }

        const runtimePropEntry = runtimeProps[runtimePropName]

        if (apiEntry === void 0) {
          logError(
            `${name}: missing "props" -> "${apiPropName}" definition ` +
              `(found Component prop "${runtimePropName}")`
          )
          hasError = true
        } else if (apiEntry.passthrough === 'child') {
          if (
            Object(runtimePropEntry) !== runtimePropEntry ||
            Object.keys(runtimePropEntry).length !== 0
          ) {
            logError(
              `${name}: "props" -> "${apiPropName}" is marked as ` +
                'passthrough="child" but its definition is NOT an empty Object'
            )
            console.log(apiEntry)
            hasError = true
          }
        } else {
          const apiTypes = Array.isArray(apiEntry.type)
            ? apiEntry.type
            : [apiEntry.type]

          const {
            runtimeTypes,
            isRuntimeRequired,
            hasRuntimeDefault,
            runtimeDefaultValue
          } = extractRuntimePropAttrs(runtimePropEntry)

          const isRuntimeFunction =
            runtimeTypes.length === 1 && runtimeTypes[0] === 'Function'

          const runtimeDefinableApiTypes =
            extractRuntimeDefinablePropTypes(apiTypes)

          // API "type" validation against runtime
          if (
            runtimeDefinableApiTypes.length !== runtimeTypes.length ||
            !runtimeDefinableApiTypes.every((t, i) => t === runtimeTypes[i])
          ) {
            logError(
              `${name}: wrong definition for prop "${apiPropName}" - ` +
                `JSON as ${JSON.stringify(apiTypes)} ` +
                `vs Component as ${JSON.stringify(runtimeTypes)}`
            )
            console.log(apiEntry)
            hasError = true
          }

          // API "required" validation against runtime
          if (isRuntimeRequired === true && apiEntry.required !== true) {
            logError(
              `${name}: "props" -> "${apiPropName}" is missing the required=true flag`
            )
            console.log(apiEntry)
            hasError = true
          }

          // API "default" value validation against runtime
          if (hasRuntimeDefault === true) {
            if (!Object.hasOwn(apiEntry, 'default')) {
              logError(
                `${name}: "props" -> "${apiPropName}" is missing "default" with ` +
                  `value: "${encodeDefaultValue(runtimeDefaultValue, isRuntimeFunction)}"`
              )
              console.log(apiEntry)
              hasError = true
            } else if (!apiIgnoreValueRegex.test(apiEntry.default)) {
              const encodedValue = encodeDefaultValue(
                runtimeDefaultValue,
                isRuntimeFunction
              )

              if (apiEntry.default !== encodedValue) {
                let handledAlready = false

                if (isRuntimeFunction) {
                  const fn = runtimeDefaultValue.toString()

                  if (fn.includes('\n')) {
                    logError(
                      `${componentName}: prop "${runtimePropName}" -> "default" ` +
                        'should be a single line arrow function (found multiple lines)'
                    )
                    console.log(apiEntry)
                    hasError = true
                    handledAlready = true
                  }

                  if (!handledAlready && !functionRE.test(fn)) {
                    logError(
                      `${componentName}: prop "${runtimePropName}" -> "default" should ` +
                        'be an arrow function that begins with: "() => "'
                    )
                    console.log(apiEntry)
                    hasError = true
                  }

                  if (!handledAlready && /^[a-zA-Z]/.test(encodedValue)) {
                    logError(
                      `${componentName}: prop "${runtimePropName}" -> "default" should ` +
                        'be an arrow factory function that does not reference any external variables'
                    )
                    console.log(apiEntry)
                    hasError = true
                  }
                }

                if (!handledAlready && apiEntry.__runtimeDefault !== true) {
                  logError(
                    `${name}: "props" -> "${apiPropName}" > "default" value should ` +
                      `be: "${encodedValue}" (instead of "${apiEntry.default}")`
                  )
                  console.log(apiEntry)
                  hasError = true
                }
              }

              if (
                apiEntry.__runtimeDefault === true &&
                runtimeDefaultValue !== null
              ) {
                logError(
                  `${name}: "props" -> "${apiPropName}" should NOT ` +
                    'have "__runtimeDefault" (found static value on Component)'
                )
                console.log(apiEntry)
                hasError = true
              }
            }
          } else if (
            apiEntry.__runtimeDefault !== true &&
            Object.hasOwn(apiEntry, 'default')
          ) {
            logError(
              `${name}: "props" -> "${apiPropName}" should NOT have a "default" value; Solutions:` +
                '\n  1. remove "default" because it should indeed not have it' +
                '\n  2. it is runtime computed, in which case add "__runtimeDefault": true' +
                '\n  3. it handles the "undefined" value, in which case add "undefined" or "Any" to the "type"'
            )
            console.log(apiEntry)
            hasError = true
          }
        }
      }

      // API defined props should exist in the component
      for (const apiPropName in apiProps) {
        const apiEntry = apiProps[apiPropName]
        const runtimeName = camelCase(apiPropName)

        if (apiEntry.passthrough === true) {
          if (runtimeProps[runtimeName] !== void 0) {
            logError(
              `${name}: "props" -> "${apiPropName}" should NOT be ` +
                'a "passthrough" as it exists in the Component too'
            )
            console.log(apiEntry)
            hasError = true
          }

          continue
        }

        if (runtimeProps[runtimeName] === void 0) {
          logError(
            `${name}: "props" -> "${apiPropName}" is in JSON but ` +
              'not in the Component (is it a passthrough?)'
          )
          console.log(apiEntry)
          hasError = true
        }
      }

      // runtime emits should be defined in the API as events
      for (const runtimeEmitName of runtimeEmits) {
        const apiEventName = kebabCase(runtimeEmitName)

        if (apiEvents[apiEventName] === void 0) {
          logError(
            `${name}: missing "events" -> "${apiEventName}" definition ` +
              `(found Component > emits: "${runtimeEmitName}")`
          )
          hasError = true
        }

        if (runtimeEmitName.includes('-')) {
          logError(
            `${componentName}: "emits" -> "${runtimeEmitName}" should be` +
              ' in camelCase (found kebab-case)'
          )
          hasError = true
        }
      }

      // API defined events should exist in the component
      for (const apiEventName in apiEvents) {
        const apiEntry = apiEvents[apiEventName]

        const runtimeEmitName = camelCase(apiEventName)
        const runtimePropName = `on${capitalize(runtimeEmitName)}`

        if (apiEntry.passthrough === true) {
          if (runtimeProps[runtimePropName] !== void 0) {
            logError(
              `${name}: "events" -> "${apiEventName}" should NOT be ` +
                'a "passthrough" as it exists in the Component too'
            )
            console.log(apiEntry)
            hasError = true
          }

          if (runtimeEmits.includes(runtimeEmitName)) {
            logError(
              `${name}: "events" -> "${apiEventName}" should NOT be a "passthrough" ` +
                `as it exists in the Component (as emits: ${runtimeEmitName})`
            )
            console.log(apiEntry)
            hasError = true
          }

          continue
        }

        if (
          runtimeProps[runtimePropName] === void 0 &&
          !runtimeEmits.includes(runtimeEmitName)
        ) {
          logError(
            `${name}: "events" -> "${apiEventName}" is in JSON but ` +
              'not in the Component (is it a passthrough?)'
          )
          console.log(apiEntry)
          hasError = true
        }
      }

      // API defined methods should exist in the component
      // Warning!!! It's just a best effort. It is NOT exhaustive as it only
      // checks the direct component file content, but methods can be
      // registered in other imported files as well.
      const exposedMethods = getExposedMethodNames(componentContent)
      for (const methodName of exposedMethods) {
        if (apiMethods[methodName] === void 0) {
          logError(
            `${name}: missing JSON method "${methodName}" found in Object.assign(proxy, ...)`
          )
          hasError = true
        }
      }

      if (hasError) {
        logError('Errors were found... exiting with error')
        process.exit(1)
      }

      Object.keys(api).forEach(section => {
        const target = api[section]

        if (Object(target) === target) {
          for (const key in target) {
            const entry = target[key]
            if (Object(entry) !== entry) continue

            if (entry.internal === true) {
              delete target[key]
            } else if (entry.internal === false) {
              // save bytes over the wire
              delete entry.internal
            }

            if (
              Object.hasOwn(entry, 'passthrough') &&
              entry.passthrough !== true
            ) {
              // save bytes over the wire
              delete entry.passthrough
            }

            if (Object.hasOwn(entry, '__runtimeDefault')) {
              // API internal prop; not needed in the final API
              delete entry.__runtimeDefault
            }
          }

          // we might have only internal stuff in a key (which was deleted above)
          if (Object.keys(target).length === 0) {
            delete api[section]
          }
        }
      })
    }

    // copy API file to dest
    writeFile(filePath, encodeFn(api))

    const shortName = name.slice(0, -5)
    list.push(shortName)

    return {
      name: shortName,
      api
    }
  }
}

function writeTransformAssetUrls(components, encodeFn) {
  const transformAssetUrls = {
    base: null,
    includeAbsolute: false,
    tags: {
      video: ['src', 'poster'],
      source: ['src'],
      img: ['src'],
      image: ['xlink:href', 'href'],
      use: ['xlink:href', 'href']
    }
  }

  components.forEach(({ name, api }) => {
    if (api.props !== void 0) {
      let props = Object.keys(api.props).filter(
        propName => api.props[propName].transformAssetUrls === true
      )

      if (props.length !== 0) {
        props = props.length > 1 ? props : props[0]

        transformAssetUrls.tags[name] = props
        transformAssetUrls.tags[kebabCase(name)] = props
      }
    }
  })

  writeFile(
    resolveToRoot('dist/transforms/loader-asset-urls.json'),
    encodeFn(transformAssetUrls)
  )
}

function writeApiIndex(list, encodeFn) {
  writeFile(resolveToRoot('dist/transforms/api-list.json'), encodeFn(list))
}

function prepareRuntimeImports() {
  // we prepare importing UI code so that it won't crash
  global.__QUASAR_SSR__ = true
  global.__QUASAR_SSR_SERVER__ = true
  global.__QUASAR_SSR_CLIENT__ = false
}

function resetRuntimeImports() {
  // we revert the changes we did to global because
  // we are done with importing the UI code
  delete global.__QUASAR_SSR__
  delete global.__QUASAR_SSR_SERVER__
  delete global.__QUASAR_SSR_CLIENT__
}

export async function generate({ compact = false } = {}) {
  const encodeFn = compact
    ? JSON.stringify
    : json => JSON.stringify(json, null, 2)

  prepareRuntimeImports()

  try {
    const list = []

    const plugins = await Promise.all(
      globSync(['src/plugins/*/*.json', 'src/Brand.json'], {
        cwd: rootFolder,
        absolute: true
      }).map(fillAPI('plugin', list, encodeFn))
    )

    const directives = await Promise.all(
      globSync('src/directives/*/*.json', {
        cwd: rootFolder,
        absolute: true
      }).map(fillAPI('directive', list, encodeFn))
    )

    const components = await Promise.all(
      globSync('src/components/*/Q*.json', {
        cwd: rootFolder,
        absolute: true
      }).map(fillAPI('component', list, encodeFn))
    )

    resetRuntimeImports()

    writeTransformAssetUrls(components, encodeFn)
    writeApiIndex(list.sort(), encodeFn)

    return { components, directives, plugins }
  } catch (err) {
    resetRuntimeImports()

    logError('build.api.js: something went wrong...')
    console.log()
    console.error(err)
    console.log()
    process.exit(1)
  }
}
