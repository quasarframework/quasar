import { basename } from 'node:path'
import prompts from 'prompts'

import { plural } from './specs.utils.js'

/**
 * Validates a test file
 */
export async function cmdValidateTestFile({ ctx, testFile, argv }) {
  const { errors, warnings } = testFile.getMisconfiguration({
    disallowWorkInProgress: true
  })

  if (errors.length !== 0) {
    if (argv.ci !== true) {
      console.log('\n')
    }

    const suffix = warnings.length !== 0 ? ' & warnings' : ''
    console.error(
      `  ❌ ${ctx.testFileRelative} has validation errors${suffix}:`
    )

    errors.forEach(error => {
      console.error(`       • (error)   ${error}`)
    })

    warnings.forEach(warning => {
      console.warn(`       • (warning) ${warning}`)
    })

    if (argv.ci !== true) {
      console.log()

      const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: 'How to proceed?',
        initial: 0,
        choices: [
          { title: 'I acknowledge & I will fix it', value: 'acknowledge' },
          { title: 'Abort & exit', value: 'exit' }
        ]
      })

      if (action === 'acknowledge') return

      process.exit(1)
    }

    process.exit(1)
  } else if (warnings.length !== 0) {
    console.warn(`  ❌ ${ctx.testFileRelative} has validation warnings:`)
    warnings.forEach(warning => {
      console.warn(`       • (warning) ${warning}`)
    })

    process.exit(1)
  }

  const missingTests = testFile.getMissingTests()

  if (missingTests === null) {
    console.log(`  ✅ ${ctx.testFileRelative}`)
    return
  }

  const pluralSuffix = plural(missingTests.length)

  if (argv.ci === true) {
    console.log(
      `  ❌ ${ctx.testFileRelative} is missing ${missingTests.length} test-case${pluralSuffix}`
    )
    process.exit(1)
  }

  console.log(
    `\n  ❌ ${ctx.testFileRelative} is missing ${missingTests.length} test-case${pluralSuffix}:`
  )

  missingTests.forEach(test => {
    console.log(test.content)
  })

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: `🔥 Missing ${missingTests.length} test-case${pluralSuffix} in "${ctx.testFileRelative}":`,
    initial: 0,
    choices: [
      { title: 'Skip', value: 'skip' },
      {
        title: `Accept test-case${pluralSuffix} (notice test.todo calls)`,
        value: 'add-missing-test-cases'
      },
      missingTests.length > 1
        ? { title: 'Handle individually', value: 'handle-individually' }
        : void 0,
      {
        title: `Add ignore comment${pluralSuffix}`,
        value: 'add-ignore-comments'
      },
      { title: 'Abort & exit', value: 'exit' }
    ].filter(Boolean)
  })

  // allow user to exit
  if (action === void 0 || action === 'exit') process.exit(1)

  if (action === 'skip') return

  if (action === 'add-missing-test-cases') {
    testFile.addTestCases(missingTests)
    console.log(
      `  🎉 Injected the missing test-cases into "${ctx.testFileRelative}"`
    )
    return
  }

  if (action === 'add-ignore-comments') {
    testFile.addIgnoreComments(
      missingTests.map(test => test.testId || test.categoryId)
    )
    console.log(
      `  🎉 Injected the ignore comments into "${ctx.testFileRelative}"`
    )
    return
  }

  if (action === 'handle-individually') {
    let index = 0
    const missingTestsLen = missingTests.length
    const testFileName = basename(ctx.testFileRelative)

    for (const test of missingTests) {
      index++
      const testCaseName = test.testId || test.categoryId

      console.log()
      console.log(' -------')
      console.log(` | 🍕 [ ${index} / ${missingTestsLen} of ${testFileName} ]`)
      console.log(` | 🔥 Missing test-case: "${testCaseName}"`)
      console.log(' -------')
      console.log(test.content)

      const { action: localAction } = await prompts({
        type: 'select',
        name: 'action',
        message: `🔋 How to proceed with "${testCaseName}" from above?`,
        initial: 0,
        choices: [
          { title: 'Skip', value: 'skip' },
          {
            title: 'Accept test-case (notice test.todo calls)',
            value: 'accept-missing-test-case'
          },
          { title: 'Add ignore comment', value: 'add-ignore-comment' },
          { title: 'Skip the rest', value: 'skip-the-rest' },
          { title: 'Abort & exit', value: 'exit' }
        ]
      })

      // allow user to exit
      if (localAction === void 0 || localAction === 'exit') process.exit(1)

      if (localAction === 'skip') continue
      if (localAction === 'skip-the-rest') return

      if (localAction === 'accept-missing-test-case') {
        testFile.addTestCases([test])
        console.log(
          `  🎉 Injected the missing test-case into "${ctx.testFileRelative}"`
        )
        continue
      }

      if (localAction === 'add-ignore-comment') {
        testFile.addIgnoreComments([testCaseName])
        console.log(
          `  🎉 Injected the ignore comment into "${ctx.testFileRelative}"`
        )
        continue
      }
    }

    return
  }

  console.error(`"Missing test-cases" action "${action}" not handled`)
  process.exit(1)
}
