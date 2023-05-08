const parseArgs = require('minimist')
const { green, red, italic, underline } = require('kolorist')

const getApi = require('../helpers/get-api')
const { fatal, dot } = require('../helpers/logger')

const partArgs = {
  p: 'props',
  s: 'slots',
  m: 'methods',
  c: 'computedProps',
  e: 'events',
  v: 'value',
  a: 'arg',
  M: 'modifiers',
  i: 'injection',
  q: 'quasar',
  d: 'docs'
}

const partArgsKeys = Object.keys(partArgs)

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    h: 'help',
    f: 'filter',
    ...partArgs
  },
  boolean: [ 'h', ...partArgsKeys ],
  string: [ 'f' ]
})

const item = argv._[ 0 ]

if (!item || argv.help) {
  console.log(`
  Description
    Describes a component API for project's Quasar version being used

  Usage
    $ quasar describe <component/directive/Quasar plugin>

    # list all available API entries:
    $ quasar describe list
    # list available API entries that contain a String (ex "storage"):
    $ quasar describe list storage

    # display everything:
    $ quasar describe QIcon

    # displaying only props:
    $ quasar describe QIcon -p
    # displaying props and methods only:
    $ quasar describe QIcon -p -m
    # filtering by "si":
    $ quasar describe QIcon -f si
    # filtering only props by "co":
    $ quasar describe QIcon -p -f co

    # Open docs URL:
    $ quasar describe QIcon -d

  Options
    --filter, -f <filter> Filters the API
    --props, -p           Displays the API props
    --slots, -s           Displays the API slots
    --events, -e          Displays the API events
    --methods, -m         Displays the API methods
    --computedProps, -c   Displays the API computed props
    --value, -v           Displays the API value
    --arg, -a             Displays the API arg
    --modifiers, -M       Displays the API modifiers
    --injection, -i       Displays the API injection
    --quasar, -q          Displays the API quasar conf options
    --docs, -d            Opens the docs API URL
    --help, -h            Displays this message
  `)
  process.exit(0)
}

const apiParts = {}

if (partArgsKeys.some(part => argv[ part ])) {
  Object.values(partArgs).forEach(part => {
    apiParts[ part ] = argv[ part ]
  })
}
else {
  Object.values(partArgs).forEach(part => {
    if (part !== 'docs') {
      apiParts[ part ] = true
    }
  })
}

function getEventParams (event) {
  const params = event.params === void 0 || event.params.length === 0
    ? ''
    : Object.keys(event.params).join(', ')

  return ' -> function(' + params + ')'
}

function getMethodParams (method, noRequired) {
  if (!method.params || method.params.length === 0) {
    return ' ()'
  }

  if (noRequired === true) {
    return ` (${ Object.keys(method.params).join(', ') })`
  }

  const params = Object.keys(method.params)
  const optionalIndex = params.findIndex(param => method.params[ param ].required !== true)

  const str = optionalIndex !== -1
    ? params.slice(0, optionalIndex).join(', ')
      + (optionalIndex < params.length
        ? '[' + (optionalIndex > 0 ? ', ' : '') + params.slice(optionalIndex).join(', ') + ']'
        : '')
    : params.join(', ')

  return ' (' + str + ')'
}

function getMethodReturnValue (method) {
  return ' => '
    + (!method.returns
      ? 'void 0'
      : method.returns.type
    )
}

function getStringType (type) {
  return Array.isArray(type)
    ? type.join(' | ')
    : type
}

function printProp (prop, propName, indentLevel) {
  let indent = ' '.repeat(indentLevel)

  const type = getStringType(prop.type)

  if (propName !== void 0) {
    console.log(`${ indent }${ green(propName) } ${ type ? `(${ type })` : '' }${ type !== 'Function' && prop.required ? red(' [Required]') : '' }${ prop.reactive ? red(' [Reactive]') : '' }`)

    indentLevel += 2
    indent += '  '
  }

  console.log(`${ indent }Description: ${ prop.desc }`)
  if (type === 'Function') {
    console.log(`${ indent }Function form:${ getMethodParams(prop, true) }${ getMethodReturnValue(prop) }`)
  }
  if (prop.sync) {
    console.log(`${ indent }".sync" modifier required!`)
  }
  if (prop.link) {
    console.log(`${ indent }Link: ${ prop.link }`)
  }
  if (prop.values) {
    console.log(`${ indent }Accepted values: ${ prop.values.join(' | ') }`)
  }
  if (prop.default) {
    console.log(`${ indent }Default value: ${ prop.default }`)
  }
  if (prop.definition) {
    console.log(`${ indent }Props:`)
    for (const propName in prop.definition) {
      printProp(prop.definition[ propName ], propName, indentLevel + 2)
    }
  }
  if (prop.params) {
    console.log(`${ indent }Params:`)
    for (const propName in prop.params) {
      printProp(prop.params[ propName ], propName, indentLevel + 2)
    }
  }
  if (prop.returns) {
    console.log(`${ indent }Returns ${ getStringType(prop.returns.type) }:`)
    printProp(prop.returns, void 0, indentLevel + 2)
  }
  if (prop.scope) {
    console.log(`${ indent }Scope:`)
    for (const propName in prop.scope) {
      printProp(prop.scope[ propName ], propName, indentLevel + 2)
    }
  }
  if (prop.examples !== void 0) {
    console.log(`${ indent }Example${ prop.examples.length > 1 ? 's' : '' }:`)
    prop.examples.forEach(example => {
      console.log(`${ indent }  ${ example }`)
    })
  }
}

function printProperties ({ props }) {
  const keys = Object.keys(props || {})

  console.log('\n ' + underline('Properties'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No properties*'))
    return
  }

  if (argv.filter) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete props[ key ]
      }
    })
    if (Object.keys(props).length === 0) {
      console.log('\n   ' + italic('*No matching properties*'))
      return
    }
  }

  for (const propName in props) {
    console.log()
    printProp(props[ propName ], propName, 3)
  }
}

function printSlots ({ slots }) {
  const keys = Object.keys(slots || {})

  console.log('\n ' + underline('Slots'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No slots*'))
    return
  }

  if (argv.filter !== void 0) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete slots[ key ]
      }
    })
    if (Object.keys(slots).length === 0) {
      console.log('\n   ' + italic('*No matching slots*'))
      return
    }
  }

  for (const slot in slots) {
    console.log()
    printProp(slots[ slot ], slot, 3)
  }
}

function printEvents ({ events }) {
  const keys = Object.keys(events || {})

  console.log('\n ' + underline('Events'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No events*'))
    return
  }

  if (argv.filter !== void 0) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete events[ key ]
      }
    })
    if (Object.keys(events).length === 0) {
      console.log('\n   ' + italic('*No matching events*'))
      return
    }
  }

  for (const eventName in events) {
    const event = events[ eventName ]

    console.log('\n   @' + green(eventName) + getEventParams(event))
    console.log('     Description: ' + event.desc)
    if (!event.params) {
      console.log('     Parameters: ' + italic('*None*'))
    }
    else {
      console.log('     Parameters:')
      for (const paramName in event.params) {
        printProp(event.params[ paramName ], paramName, 7)
      }
    }
  }
}

function printMethods ({ methods }) {
  const keys = Object.keys(methods || {})

  console.log('\n ' + underline('Methods'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No methods*'))
    return
  }

  if (argv.filter !== void 0) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete methods[ key ]
      }
    })
    if (Object.keys(methods).length === 0) {
      console.log('\n   ' + italic('*No matching methods*'))
      return
    }
  }

  for (const methodName in methods) {
    const method = methods[ methodName ]
    console.log('\n   ' + green(methodName) + getMethodParams(method) + getMethodReturnValue(method))
    console.log('     ' + method.desc)
    if (method.params !== void 0) {
      console.log('     Parameters:')
      for (const paramName in method.params) {
        printProp(method.params[ paramName ], paramName, 7)
      }
    }

    if (method.returns !== void 0) {
      console.log(`     Returns ${ getStringType(method.returns.type) }:`)
      printProp(method.returns, void 0, 7)
    }
  }
}

function printComputedProps ({ computedProps }) {
  const keys = Object.keys(computedProps || {})

  console.log('\n ' + underline('Computed Properties'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No computed properties*'))
    return
  }

  if (argv.filter) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete computedProps[ key ]
      }
    })
    if (Object.keys(computedProps).length === 0) {
      console.log('\n   ' + italic('*No matching computed properties*'))
      return
    }
  }

  for (const propName in computedProps) {
    console.log()
    printProp(computedProps[ propName ], propName, 3)
  }
}

function printValue ({ value }) {
  console.log('\n ' + underline('Value'))

  if (value === void 0) {
    console.log('\n   ' + italic('*No value*'))
  }
  else {
    console.log('\n   Type:', value.type)
    printProp(value, void 0, 3)
  }
}

function printArg ({ arg }) {
  console.log('\n ' + underline('Arg'))

  if (arg === void 0) {
    console.log('\n   ' + italic('*No arg*'))
  }
  else {
    console.log('\n   Type:', arg.type)
    printProp(arg, void 0, 3)
  }
}

function printModifiers ({ modifiers }) {
  const keys = Object.keys(modifiers || {})

  console.log('\n ' + underline('Modifiers'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No modifiers*'))
    return
  }

  if (argv.filter !== void 0) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete modifiers[ key ]
      }
    })
    if (Object.keys(modifiers).length === 0) {
      console.log('\n   ' + italic('*No matching modifiers*'))
      return
    }
  }

  for (const modifierName in modifiers) {
    const modifier = modifiers[ modifierName ]
    console.log('\n   ' + green(modifierName))
    printProp(modifier, modifierName, 5)
  }
}

function printInjection ({ injection }) {
  console.log('\n ' + underline('Injection'))

  if (injection === void 0) {
    console.log('\n   ' + italic('*No injection*'))
  }
  else {
    console.log('\n   ' + green(injection))
  }
}

function printQuasarConfOptions ({ quasarConfOptions }) {
  const conf = quasarConfOptions !== void 0
    ? quasarConfOptions.definition || {}
    : {}
  const keys = Object.keys(conf)

  console.log('\n ' + underline('quasar.config.js > framework > config'))

  if (keys.length === 0) {
    console.log('\n   ' + italic('*No configuration options*'))
    return
  }

  if (argv.filter !== void 0) {
    keys.forEach(key => {
      if (key.indexOf(argv.filter) === -1) {
        delete conf[ key ]
      }
    })
    if (Object.keys(conf).length === 0) {
      console.log('\n   ' + italic('*No matching configuration options*'))
      return
    }
  }

  console.log('\n   Property name: ' + green(quasarConfOptions.propName))
  console.log('   Definition:')
  for (const propName in conf) {
    console.log()
    printProp(conf[ propName ], propName, 5)
  }
}

function describe (api) {
  switch (api.type) {
    case 'component':
      apiParts.quasar === true && printQuasarConfOptions(api)
      apiParts.props === true && printProperties(api)
      apiParts.slots === true && printSlots(api)
      apiParts.events === true && printEvents(api)
      apiParts.methods === true && printMethods(api)
      apiParts.computedProps === true && printComputedProps(api)
      break

    case 'directive':
      apiParts.quasar === true && printQuasarConfOptions(api)
      apiParts.value === true && printValue(api)
      apiParts.arg === true && printArg(api)
      apiParts.modifiers === true && printModifiers(api)
      break

    case 'plugin':
      apiParts.injection === true && printInjection(api)
      apiParts.quasar === true && printQuasarConfOptions(api)
      apiParts.props === true && printProperties(api)
      apiParts.methods === true && printMethods(api)
      break
  }

  if (api.meta && api.meta.docsUrl) {
    console.log('\n ' + underline('Documentation URL'))
    console.log('\n   ' + green(api.meta.docsUrl))
  }
}

async function run () {
  try {
    const { api, supplier } = await getApi(item)

    console.log()

    if (apiParts.docs) {
      if (api.meta && api.meta.docsUrl) {
        const openBrowser = require('../helpers/open-browser')
        openBrowser({ url: api.meta.docsUrl, wait: false })
      }
      else {
        console.log(' Please report this issue to: https://github.com/quasarframework/quasar/issues/')
        console.log(' Write down the command that you tried along with a complete log of "quasar info" command output')
        console.log()
      }
    }
    else {
      console.log(` Describing ${ green(item) } ${ api.type } API`)

      if (supplier === void 0) {
        console.log(` ${ italic('Description is based on your project\'s Quasar version') }`)
      }
      else {
        console.log(` ${ italic(`Supplied by "${ supplier }" App Extension`) }`)
      }

      describe(api)
      console.log()
    }
  }
  catch (e) {
    fatal(e)
  }
}

function listElements () {
  const getPackage = require('../helpers/get-package')
  let api = getPackage('quasar/dist/transforms/api-list.json')

  if (api === void 0) {
    fatal(' Could not retrieve list...')
  }

  const filter = argv._[ 1 ]

  if (filter) {
    const needle = filter.toLowerCase()
    const filterBanner = green(filter)
    api = api.filter(entry => entry.toLowerCase().indexOf(needle) !== -1)

    if (api.length === 0) {
      console.log(`\n Nothing matches "${ filterBanner }". Please refine the search term.\n`)
      process.exit(0)
    }

    console.log(`\n The list of API elements that match "${ filterBanner }":\n`)
  }
  else {
    console.log('\n The complete list of API elements:\n')
  }

  const prefix = green(`  ${ dot } `)

  api.forEach(entry => {
    console.log(prefix + entry)
  })
  console.log()
}

if (item === 'list') {
  listElements()
}
else {
  run()
}
