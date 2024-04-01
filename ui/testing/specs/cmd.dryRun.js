import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import fse from 'fs-extra'

import { getTestFile } from './testFile.js'

const testFilePath = fileURLToPath(new URL('./__temp.js', import.meta.url))
const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

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
  console.log(`\n  🍕 Testing ${ ctx.targetRelative }:`)

  let testFileContent
  try {
    testFileContent = testFile.createContent()
  }
  catch (err) {
    console.error('  ❌ Failed createContent() test (threw an error)')
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
    console.error('  ❌ Failed getTestFile() test (threw an error)')
    console.error(err)
    fse.unlinkSync(testFilePath)
    return
  }

  try {
    const { errors, warnings } = tempTestFile.getMisconfiguration()
    if (errors.length !== 0 || warnings.length !== 0) {
      console.error('  ❌ Failed getMisconfiguration() test')
      console.error('errors', errors)
      console.error('warnings', warnings)
      fse.unlinkSync(testFilePath)
      return
    }
  }
  catch (err) {
    console.error('  ❌ Failed getMisconfiguration() test (threw an error)')
    console.error(err)
    fse.unlinkSync(testFilePath)
    return
  }

  try {
    const missingTests = tempTestFile.getMissingTests()
    if (missingTests !== null) {
      console.error('  ❌ Failed getMissingTests() test')
      console.log(missingTests)
      fse.unlinkSync(testFilePath)
      return
    }
  }
  catch (err) {
    console.error('  ❌ Failed getMissingTests() test (threw an error)')
    console.error(err)
    fse.unlinkSync(testFilePath)
    return
  }

  fse.unlinkSync(testFilePath)
  console.log('  ✅ Passed')
}
