import fse from 'fs-extra'
import prompts from 'prompts'

/**
 * Creates a test file (does NOT run in CI mode)
 */
export async function cmdCreateTestFile ({
  ctx,
  testFile,
  ignoredTestFiles
}) {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: `🔥 Missing test file for "${ ctx.targetRelative }":`,
    initial: 0,
    choices: [
      { title: 'Skip', value: 'skip' },
      { title: 'Create test file', value: 'create-test-file' },
      { title: 'Add file to ignore list', value: 'add-file-to-ignore-list' },
      { title: 'Abort & exit', value: 'exit' }
    ]
  })

  // allow user to exit
  if (action === void 0 || action === 'exit') process.exit(1)

  if (action === 'skip') return

  if (action === 'add-file-to-ignore-list') {
    ignoredTestFiles.add(ctx.targetRelative)
    return
  }

  const testFileContent = testFile.createContent()

  console.log()
  console.log(testFileContent)

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `🔋 Do you accept "${ ctx.testFileRelative }" with contents from above?`,
    initial: true
  })

  // allow user to exit
  if (confirm === void 0) process.exit(1)

  if (confirm === true) {
    fse.writeFileSync(ctx.testFileAbsolute, testFileContent, 'utf-8')
    console.log(`  🎉 Created "${ ctx.testFileRelative }"`)
  }
}
