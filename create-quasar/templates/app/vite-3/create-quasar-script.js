export async function createQuasarScript({ scope, utils }) {
  await utils.promptUser(scope, {
    preset: () =>
      utils.prompts.multiselect({
        message: 'Pick features:',
        initialValues: ['sass', 'linting'],
        options: [
          {
            label: 'TypeScript',
            value: 'typescript'
          },
          {
            label: 'Sass CSS preprocessor',
            value: 'sass'
          },
          {
            label: 'Linting & Formatting (oxlint + oxfmt or ESLint + Prettier)',
            value: 'linting',
            hint: 'recommended'
          },
          {
            label: 'Vue Router filename-based routing',
            value: 'fbr',
            hint: 'https://v2.quasar.dev/quasar-cli-vite/page-routing-with-vue-router#filename-based-routing'
          },
          {
            label: 'State Management (Pinia)',
            value: 'pinia',
            hint: 'https://pinia.vuejs.org'
          },
          {
            label: 'Internationalization (vue-i18n)',
            value: 'i18n',
            hint: 'https://vue-i18n.intlify.dev'
          }
        ]
      })
  })

  scope.preset = utils.convertArrayToObject(scope.preset)

  if (scope.preset.linting) {
    const eslintTSBanner = scope.preset.typescript
      ? ' (TS6 required instead of TS7)'
      : ''

    await utils.promptUser(scope, {
      linter: () =>
        utils.prompts.select({
          message: 'Project linter & formatter:',
          options: [
            {
              label: 'oxlint + oxfmt',
              value: 'oxlint',
              hint: 'recommended, but full .vue support is still in progress'
            },
            {
              label: `ESLint + vite-plugin-checker + Prettier${eslintTSBanner}`,
              value: 'eslint'
            }
          ]
        })
    })
  }

  const log = utils.prompts.taskLog({
    title: 'Scaffolding Quasar App...'
  })

  const dir = scope.preset.typescript ? 'ts' : 'js'
  utils.createTargetDir(scope)
  utils.renderTemplate(`${dir}/BASE`, scope)

  const css = scope.preset.sass ? 'sass' : 'css'
  utils.renderTemplate(`${dir}/${css}`, scope)

  if (scope.preset.i18n) utils.renderTemplate(`${dir}/i18n`, scope)
  if (scope.preset.pinia) {
    utils.renderTemplate(`${dir}/pinia`, scope)
  }

  if (scope.linter === 'oxlint') {
    utils.renderTemplate(`${dir}/oxlint`, scope)
  } else if (scope.linter === 'eslint') {
    utils.renderTemplate(`${dir}/eslint`, scope)
  }

  utils.renderTemplate(
    scope.preset.fbr ? `${dir}/filenameBasedRouting` : `${dir}/manualRouting`,
    scope
  )

  log.success('Quasar App scaffolded successfully!')
}
