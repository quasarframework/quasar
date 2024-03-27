import { basename } from 'node:path'
import prompts from 'prompts'

/**
 * Validates a test file
 */
export async function cmdValidateTestFile ({
  ctx,
  argv
}) {
  const { errors, warnings } = ctx.testFile.getMisconfiguration()

  if (errors.length !== 0) {
    if (argv.interactive === true) {
      console.log('\n')
    }

    console.error(`  ❌ ${ ctx.testFileRelative } has critical issues:`)

    errors.forEach(error => {
      console.error(`       • (error)   ${ error }`)
    })

    warnings.forEach(warning => {
      console.warn(`       • (warning) ${ warning }`)
    })

    if (argv.interactive === true) {
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

    // TODO: process.exit(1) when all test files have been added
    return
  }
  else if (warnings.length !== 0) {
    console.warn(`  ⚠️  ${ ctx.testFileRelative } has issues:`)
    warnings.forEach(warning => {
      console.warn(`       • (warning) ${ warning }`)
    })
  }

  const missingTests = ctx.testFile.getMissingTests()

  if (missingTests === null) {
    console.log(`  ✅ ${ ctx.testFileRelative }`)
    return
  }

  if (argv.interactive === false) {
    // TODO: process.exit(1) when all test files have been added
    console.log(`  ❌ ${ ctx.testFileRelative } is missing ${ missingTests.length } test-cases`)
    return
  }

  console.log(`\n  ❌ ${ ctx.testFileRelative } is missing ${ missingTests.length } test-cases:`)

  missingTests.forEach(test => {
    console.log(test.content)
  })

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: `🔥 Missing ${ missingTests.length } test-cases in "${ ctx.testFileRelative }":`,
    initial: 0,
    choices: [
      { title: 'Skip', value: 'skip' },
      { title: 'Accept test-cases (notice test.todo calls)', value: 'add-missing-test-cases' },
      { title: 'Handle individually', value: 'handle-individually' },
      { title: 'Add ignore comments', value: 'add-ignore-comments' },
      { title: 'Abort & exit', value: 'exit' }
    ]
  })

  // allow user to exit
  if (action === void 0 || action === 'exit') process.exit(1)

  if (action === 'skip') return

  if (action === 'add-missing-test-cases') {
    ctx.testFile.addTestCases(missingTests)
    console.log(`  🎉 Injected the missing test-cases into "${ ctx.testFileRelative }"`)
    return
  }

  if (action === 'add-ignore-comments') {
    ctx.testFile.addIgnoreComments(missingTests.map(test => test.testId))
    console.log(`  🎉 Injected the ignore comments into "${ ctx.testFileRelative }"`)
    return
  }

  if (action === 'handle-individually') {
    let index = 0
    const missingTestsLen = missingTests.length
    const testFileName = basename(ctx.testFileRelative)

    for (const test of missingTests) {
      index++

      console.log()
      console.log(' -------')
      console.log(` | 🍕 [ ${ index } / ${ missingTestsLen } of ${ testFileName } ]`)
      console.log(` | 🔥 Missing test-case: "${ test.testId }"`)
      console.log(' -------')
      console.log(test.content)

      const { action } = await prompts({
        type: 'select',
        name: 'action',
        message: `🔋 How to proceed with "${ test.testId }" from above?`,
        initial: 0,
        choices: [
          { title: 'Skip', value: 'skip' },
          { title: 'Accept test-case (notice test.todo calls)', value: 'accept-missing-test-case' },
          { title: 'Add ignore comment', value: 'add-ignore-comment' },
          { title: 'Skip the rest', value: 'skip-the-rest' },
          { title: 'Abort & exit', value: 'exit' }
        ]
      })

      // allow user to exit
      if (action === void 0 || action === 'exit') process.exit(1)

      if (action === 'skip') continue
      if (action === 'skip-the-rest') return

      if (action === 'accept-missing-test-case') {
        ctx.testFile.addTestCases([ test ])
        console.log(`  🎉 Injected the missing test-case into "${ ctx.testFileRelative }"`)
        continue
      }

      if (action === 'add-ignore-comment') {
        ctx.testFile.addIgnoreComments([ test.testId ])
        console.log(`  🎉 Injected the ignore comment into "${ ctx.testFileRelative }"`)
        continue
      }
    }

    return
  }

  console.error(`"Missing test-cases" action "${ action }" not handled`)
  process.exit(1)
}
