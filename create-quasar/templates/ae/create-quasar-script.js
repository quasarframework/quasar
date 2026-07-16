function parsePackageName(name) {
  const scopedPackageRegex = /^(@[^/]+)\/([^/]+)$/
  const match = name
    .replace(/quasar-app-extension-/, '')
    .match(scopedPackageRegex)

  return match ? { org: match[1] + '/', name: match[2] } : { org: '', name }
}

export async function createQuasarScript({ scope, utils }) {
  await utils.promptUser(scope, {
    name: () =>
      utils.prompts.text({
        message: 'AE ext-id (w/out "quasar-app-extension" in it):',
        placeholder: 'eg. "my-ext", "@my-org/my-ext"',
        validate: val => {
          if (!val) return `ext-id is required!`
          if (!utils.definitions.name.isValid(val)) {
            return 'Invalid App Extension name'
          }
        }
      }),

    preset: () =>
      utils.prompts.groupMultiselect({
        message: 'Pick features:',
        initialValues: ['prompts', 'install', 'uninstall', 'linting'],
        options: {
          Tooling: [
            {
              label: 'TypeScript support',
              value: 'typescript'
            },
            {
              label: 'Linting & Formatting (oxlint + oxfmt)',
              value: 'linting',
              hint: 'recommended'
            }
          ],
          'Additional AE Scripts': [
            {
              label: 'Prompts script',
              value: 'prompts'
            },
            {
              label: 'Install script',
              value: 'install'
            },
            {
              label: 'Uninstall script',
              value: 'uninstall'
            }
          ]
        }
      })
  })

  const log = utils.prompts.taskLog({
    title: 'Scaffolding App Extension...'
  })

  scope.preset = utils.convertArrayToObject(scope.preset)
  if (scope.preset.linting) scope.linter = 'oxlint'

  const { org, name } = parsePackageName(scope.name)
  scope.aeShortName = `${org}${name}`
  scope.aeFullName = `${org}quasar-app-extension-${name}`

  const dir = scope.preset.typescript ? 'ts' : 'js'
  utils.createTargetDir(scope)
  utils.renderTemplate(`${dir}/BASE`, scope)

  if (scope.preset.prompts) {
    utils.renderTemplate(`${dir}/prompts`, scope)
  }
  if (scope.preset.install) {
    utils.renderTemplate(`${dir}/install`, scope)
  }
  if (scope.preset.uninstall) {
    utils.renderTemplate(`${dir}/uninstall`, scope)
  }

  if (scope.linter === 'oxlint') {
    utils.renderTemplate(`${dir}/oxlint`, scope)
  }

  log.success('App Extension scaffolded successfully!')

  // override with the only allowed package manager for AE
  scope.packageManagerList = ['pnpm']
}
