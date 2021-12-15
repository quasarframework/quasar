#!/usr/bin/env node
const argv = require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: $0 -c "component or composable name"')
  .example('$0 -c "avatar')
  .example('$0 -c "use-field')
  .alias('c', 'component')
  .describe('c', 'Component or composable name')
  .demandOption([ 'c' ])
  .help('h')
  .alias('h', 'help')
  .argv

function toPascalCase (text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper)
}

function clearAndUpper (text) {
  return text.replace(/-/, '').toUpperCase()
}

function indent (num) {
  return ' '.repeat(num * 2)
}

const isComposable = argv.component.startsWith('use-')

const component = isComposable ? argv.component : toPascalCase(argv.component)
const json = isComposable ? require(`../../../src/composables/private/${ component }.json`) : require(`../../../src/components/${ argv.component }/Q${ component }.json`)
const extendJson = require('../../../src/api.extends.json')
// console.log(json)
const extendProps = extendJson.props
let output = ''
output += `describe('${ component } API', () => {\n`
// Add props by category
output += `${ indent(1) }describe('Props', () => {\n`
if (json.props) {
  const categories = {}
  for (const prop in json.props) {
    if (json.props[ prop ].category) {
      if (!categories[ json.props[ prop ].category ]) categories[ json.props[ prop ].category ] = [ prop ]
      else categories[ json.props[ prop ].category ].push(prop)
    }
    else {
      if (!categories[ extendProps[ json.props[ prop ].extends ].category ]) categories[ extendProps[ json.props[ prop ].extends ].category ] = [ prop ]
      else categories[ extendProps[ json.props[ prop ].extends ].category ].push(prop)
    }
  }
  const keys = Object.keys(categories).sort()
  keys.forEach((category, index) => {
    output += `${ index !== 0 ? '\n' : '' }${ indent(2) }describe('Category: ${ category }', () => {\n`
    categories[ category ].forEach((prop, index) => {
      output += `${ index !== 0 ? '\n' : '' }${ indent(3) }describe('(prop): ${ prop }', () => {\n`
      output += `${ indent(4) }it.skip(' ', () => {\n`
      output += `${ indent(5) }//\n`
      output += `${ indent(4) }})\n`
      output += `${ indent(3) }})\n`
    })
    output += `${ indent(2) }})\n`
  })
  output += `${ indent(1) }})\n`
}
// Add slots
if (json.slots) {
  output += `\n${ indent(1) }describe('Slots', () => {\n`
  Object.keys(json.slots).forEach((slot, index) => {
    output += `${ index !== 0 ? '\n' : '' }${ indent(2) }describe('(slot): ${ slot }', () => {\n`
    output += `${ indent(3) }it.skip(' ', () => {\n`
    output += `${ indent(4) }//\n`
    output += `${ indent(3) }})\n`
    output += `${ indent(2) }})\n`
  })
  output += `${ indent(1) }})\n`
}
// Add events
if (json.events) {
  output += `\n${ indent(1) }describe('Events', () => {\n`
  Object.keys(json.events).forEach((event, index) => {
    output += `${ index !== 0 ? '\n' : '' }${ indent(2) }describe('(event): ${ event }', () => {\n`
    output += `${ indent(3) }it.skip(' ', () => {\n`
    output += `${ indent(4) }//\n`
    output += `${ indent(3) }})\n`
    output += `${ indent(2) }})\n`
  })
  output += `${ indent(1) }})\n`
}
// Add methods
if (json.methods) {
  output += `\n${ indent(1) }describe('Methods', () => {\n`
  Object.keys(json.methods).forEach((method, index) => {
    output += `${ index !== 0 ? '\n' : '' }${ indent(2) }describe('(method): ${ method }', () => {\n`
    output += `${ indent(3) }it.skip(' ', () => {\n`
    output += `${ indent(4) }//\n`
    output += `${ indent(3) }})\n`
    output += `${ indent(2) }})\n`
  })
  output += `${ indent(1) }})\n`
}
output += '})\n'

console.log(output)
