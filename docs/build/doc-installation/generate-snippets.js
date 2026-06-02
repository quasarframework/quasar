function nameAsString(name, indent, quotes = true) {
  const wrapper = quotes ? str => `'${str}'` : str => str

  return Array.isArray(name)
    ? name.map(wrapper).join(',\n' + ''.padStart(indent, ' '))
    : wrapper(name)
}

function buildQuasarConfRef(config) {
  return config !== void 0
    ? `${config}: /* look at QuasarConfOptions from the API card */`
    : null
}

function buildQuasarCli({ plugins, quasarConfRef }) {
  if (plugins === void 0 && quasarConfRef === null) {
    return `/*
 * No installation step is necessary.
 * It gets installed by default by @quasar/app-vite.
 */`
  }

  const parts = []

  if (plugins !== void 0) {
    parts.push(`plugins: [
      ${nameAsString(plugins, 6)}
    ]`)
  }

  if (quasarConfRef !== null) {
    parts.push(`config: {
      ${quasarConfRef}
    }`)
  }

  return `// quasar.config file

return {
  framework: {
    ${parts.join(',\n    ')}
  }
}`
}

function buildUmd({ quasarConfRef }) {
  const head = `/*
 * No installation step is necessary.
 * It gets installed by default.
 */`

  if (quasarConfRef === null) return head

  return `${head}

// Optional;
// Place the global quasarConfig Object in a script tag BEFORE your Quasar script tag
app.use(Quasar, {
  config: {
    ${quasarConfRef}
  }
}`
}

function buildExternalCli({ components, directives, plugins, quasarConfRef }) {
  const types = []
  const imports = ['Quasar']

  for (const type of ['components', 'directives', 'plugins']) {
    const value = { components, directives, plugins }[type]
    if (value === void 0) continue
    imports.push(nameAsString(value, 2, false))
    types.push(`${type}: {
    ${nameAsString(value, 4, false)}
  }`)
  }

  if (quasarConfRef !== null) {
    types.push(`config: {
    ${quasarConfRef}
  }`)
  }

  return `// main.js

import {
  ${imports.join(',\n  ')}
} from 'quasar'

app.use(Quasar, {
  ${types.join(',\n  ')}
})`
}

export function generateDocInstallationSnippets({
  components,
  directives,
  plugins,
  config
} = {}) {
  const quasarConfRef = buildQuasarConfRef(config)
  return {
    quasarCli: buildQuasarCli({ plugins, quasarConfRef }),
    externalCli: buildExternalCli({
      components,
      directives,
      plugins,
      quasarConfRef
    }),
    umd: buildUmd({ quasarConfRef })
  }
}
