import clipboardy from 'clipboardy'

const jsonPathRE = /^[^.]+\.[^.]+$/

/**
 * Generates a targeted section of a json path
 */
export async function cmdGenerateSection ({
  ctx,
  testFile,
  jsonPath
}) {
  if (jsonPathRE.test(jsonPath) === false) {
    console.log(`  ❌ Invalid json path: "${ jsonPath }"`)
    return
  }

  const output = testFile.generateSection(jsonPath)

  if (output === null) {
    console.log(`  ❌ No such json path found: "${ jsonPath }"`)
    return
  }

  console.log(output)
  clipboardy.writeSync(output)

  console.log(`\n  ✅ Generated (& copied to clipboard) the section "${ jsonPath }" for "${ ctx.testFileRelative }"\n`)
}
