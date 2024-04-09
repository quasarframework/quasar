import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import { getTestFile } from './testFile.js'
import lint from './lint.js'

const testFilePath = fileURLToPath(new URL('./__temp.js', import.meta.url))
const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

const ctxOverride = {
  testFileAbsolute: testFilePath,
  testFileRelative: relative(rootFolder, testFilePath)
}

/**
 * Initializes and returns a Dry-run test function of create + validate
 */
export async function getDryRunCmd () {
  const result = {
    passed: 0,
    failed: 0,
    failList: []
  }

  process.on('exit', code => {
    // ensure we don't leave this file when exiting
    fse.removeSync(testFilePath)

    if (code !== 0) {
      console.log(`\n\n  🔥 The dry-run testing failed (exit code ${ code }).\n`)
      return
    }

    console.log(`\n\n  🏁 Done dry-run testing: ${ result.passed } passed & ${ result.failed } failed\n`)
    if (result.failList.length !== 0) {
      console.log('  Failed for:')
      for (const fail of result.failList) {
        console.log(`    ❌ ${ fail }`)
      }
    }
  })

  return async function cmdDryRun ({ ctx, testFile }) {
    let testFileContent
    try {
      testFileContent = testFile.createContent()
      // fse.writeFileSync(
      //   ctx.testFileAbsolute,
      //   testFileContent,
      //   'utf-8'
      // )
    }
    catch (err) {
      result.failed++
      result.failList.push(ctx.targetRelative)
      console.error(`\n  ❌ Failed ${ ctx.targetRelative }: createContent() threw an error`)
      console.error(err)
      return
    }

    const lintResult = await lint(testFileContent, 'lintText')
    if (lintResult !== void 0) {
      result.failed++
      result.failList.push(ctx.targetRelative)
      console.error(`\n  ❌ Failed ${ ctx.targetRelative }: linting after createContent()`)
      console.error(lintResult)
      return
    }

    /**
     * We write the test file in a temporary file
     * so that the next validations can work.
     * Their "ctx" will be overridden to point to
     * the temporary file.
     */
    fse.writeFileSync(
      testFilePath,
      testFileContent,
      'utf-8'
    )

    let tempTestFile
    try {
      tempTestFile = getTestFile({ ...ctx, ...ctxOverride })
    }
    catch (err) {
      result.failed++
      result.failList.push(ctx.targetRelative)
      console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getTestFile() threw an error`)
      console.error(err)
      return
    }

    try {
      const { errors, warnings } = tempTestFile.getMisconfiguration()
      if (errors.length !== 0 || warnings.length !== 0) {
        result.failed++
        result.failList.push(ctx.targetRelative)
        console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMisconfiguration()`)
        console.error('errors', errors)
        console.error('warnings', warnings)
        return
      }
    }
    catch (err) {
      result.failed++
      result.failList.push(ctx.targetRelative)
      console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMisconfiguration() threw an error`)
      console.error(err)
      return
    }

    try {
      const missingTests = tempTestFile.getMissingTests()
      if (missingTests !== null) {
        result.failed++
        result.failList.push(ctx.targetRelative)
        console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMissingTests()`)
        console.error(missingTests)
        return
      }
    }
    catch (err) {
      result.failed++
      result.failList.push(ctx.targetRelative)
      console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMissingTests() threw an error`)
      console.error(err)
      return
    }

    result.passed++
  }
}
