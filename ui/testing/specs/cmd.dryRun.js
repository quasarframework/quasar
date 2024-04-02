import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import { getTestFile } from './testFile.js'

const testFilePath = fileURLToPath(new URL('./__temp.js', import.meta.url))
const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

let result
const ctxOverride = {
  testFileAbsolute: testFilePath,
  testFileRelative: relative(rootFolder, testFilePath)
}

/**
 * Dry-run test of create + validate
 */
export async function cmdDryRun ({
  ctx,
  testFile
}) {
  if (result === void 0) {
    result = {
      passed: 0,
      failed: 0,
      failList: []
    }

    process.on('exit', () => {
      console.log(`\n\n  🏁 Done dry-run testing: ${ result.passed } passed & ${ result.failed } failed\n`)
      if (result.failList.length !== 0) {
        console.log('  Failed for:')
        for (const fail of result.failList) {
          console.log(`    ❌ ${ fail }`)
        }
      }
    })
  }

  let testFileContent
  try {
    testFileContent = testFile.createContent()
  }
  catch (err) {
    result.failed++
    result.failList.push(ctx.targetRelative)
    console.error(`\n  ❌ Failed ${ ctx.targetRelative }: createContent() threw an error`)
    console.error(err)
    return
  }

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
    fse.unlinkSync(testFilePath)
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
      fse.unlinkSync(testFilePath)
      return
    }
  }
  catch (err) {
    result.failed++
    result.failList.push(ctx.targetRelative)
    console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMisconfiguration() threw an error`)
    console.error(err)
    fse.unlinkSync(testFilePath)
    return
  }

  try {
    const missingTests = tempTestFile.getMissingTests()
    if (missingTests !== null) {
      result.failed++
      result.failList.push(ctx.targetRelative)
      console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMissingTests()`)
      console.error(missingTests)
      fse.unlinkSync(testFilePath)
      return
    }
  }
  catch (err) {
    result.failed++
    result.failList.push(ctx.targetRelative)
    console.error(`\n  ❌ Failed ${ ctx.targetRelative }: getMissingTests() threw an error`)
    console.error(err)
    fse.unlinkSync(testFilePath)
    return
  }

  result.passed++
  fse.unlinkSync(testFilePath)
}
