const fs = require('fs'),
  path = require('path'),
  ast = require('../build/ast')

const targetComponent = process.argv[2] || null,
  sections = ['behavior', 'props', 'slots', 'scopedSlots', 'events', 'methods', 'css']

let lookup = process.argv.filter(p => p.startsWith('--') && sections.includes(p.substring(2))).map(p => p.substring(2))
if (!lookup.length) {
  lookup = sections
}

const dirLookup = dir => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file),
      isDir = fs.lstatSync(filePath).isDirectory()

    if (isDir) {
      dirLookup(filePath)
    }
    else if (file.endsWith('.json')) {
      const componentName = file.replace('.json', '')

      if (targetComponent !== null && targetComponent !== componentName) {
        return
      }

      let touched = false
      const api = JSON.parse(fs.readFileSync(filePath))

      if (lookup.some(p => p !== 'css')) {
        ast.evaluate(fs.readFileSync(filePath.replace('.json', '.js')), lookup, (prop, key) => {
          if (key.startsWith('__')) {
            return
          }
          if (api[prop] === void 0) {
            touched = true
            api[prop] = {
              [key]: {}
            }
          }
          else if (api[prop][key] === void 0) {
            touched = true
            api[prop][key] = {}
          }
        })
      }

      if (lookup.includes('css')) {
        const cssFile = fs.readFileSync(filePath.replace('.json', '.sass')).toString(),
          variables = cssFile.match(/(\$\S+)/g) || []

        if (!api.css) {
          api.css = {}
        }

        for (const variable in api.css) {
          if (!variables.includes(variable)) {
            touched = true
            delete api.css[variable]
          }
        }

        variables.forEach(v => {
          if (!api.css[v]) {
            touched = true
            api.css[v] = {}
          }
        })
      }

      if (touched) {
        fs.writeFileSync(filePath, JSON.stringify(api, null, 2))
      }
    }
  })
}

dirLookup(path.join(__dirname, '../src/components'))
