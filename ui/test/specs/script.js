// oxlint-disable import/first

function showHelp() {
  console.log(`
  Description
    UI test files validator & generator

  Usage
    $ specs [--check] [-t <target>] [-g <json.path>]
    $ specs [-t <target>] [-g <json.path>]
    $ specs [-d] [-t <target>]

    $ specs --check

    $ specs -t QIcon
    $ specs -t components
    $ specs -t Ico
    $ specs -t utils

    $ specs -t QIcon -g props.name
    $ specs -t utils/uid

  Options
    --target, -t        Target a component/directive/plugin/composable/other
                           (should not specify file extension)
    --generate, -g      Generates a targeted section of a json path
    --dry-run, -d       Dry-run test for create + validate (no output to files)
    --check, -c         Validate only: never prompt, never write, exit 1 on
                           the first problem (what "pnpm test" runs)
    --help, -h          Show this help message
  `)
  process.exit(0)
}

import { parseArgs } from 'node:util'

const { values, positionals } = parseArgs({
  options: {
    target: { type: 'string', short: 't' },
    generate: { type: 'string', short: 'g' },
    check: { type: 'boolean', short: 'c', default: false },
    // former name of --check; kept accepted so that muscle memory and
    // any out-of-tree invocation don't hit the strict-parse error
    ci: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', short: 'd', default: false },
    help: { type: 'boolean', short: 'h' }
  },
  strict: true,
  allowPositionals: true
})

const argv = { ...values, _: positionals }
if (argv.help) showHelp()
if (argv.ci === true) argv.check = true

import { getTargetList } from './target.js'
import { ignoredTestFiles } from './ignoredTestFiles.js'
import { createCtx } from './ctx.js'
import { getTestFile } from './testFile.js'

import { cmdValidateTestFile } from './cmd.validateTestFile.js'
import { cmdCreateTestFile } from './cmd.createTestFile.js'
import { cmdGenerateSection } from './cmd.generateSection.js'
import { getDryRunCmd } from './cmd.dryRun.js'
import { plural } from './specs.utils.js'

const targetList = getTargetList(argv)

if (targetList.length === 0) {
  console.error('No such target found...')
  process.exit(1)
}

const cmdDryRun = argv['dry-run'] ? getDryRunCmd() : null

// gathered and reported in one go at the end, so that all of them
// are known after a single run
const missingTestFileList = []

for (const target of targetList) {
  if (ignoredTestFiles.has(target)) {
    if (argv.check !== true) {
      console.log(`  📦 Ignoring "${target}"`)
    }
    continue
  }

  const ctx = createCtx(target)
  const testFile = getTestFile(ctx)

  if (cmdDryRun !== null) {
    cmdDryRun({ ctx, testFile })
  } else if (argv.generate !== void 0) {
    await cmdGenerateSection({ ctx, testFile, jsonPath: argv.generate })
  } else if (testFile.content !== null) {
    await cmdValidateTestFile({ ctx, testFile, argv })
  } else if (argv.check === true) {
    // check mode never prompts, so report instead of offering to generate
    missingTestFileList.push(ctx)
  } else if (
    (await cmdCreateTestFile({ ctx, testFile, ignoredTestFiles })) !== true
  ) {
    missingTestFileList.push(ctx)
  }
}

if (missingTestFileList.length !== 0) {
  const suffix = plural(missingTestFileList.length)

  console.error(
    `\n  ❌ Missing ${missingTestFileList.length} test file${suffix}:`
  )

  missingTestFileList.forEach(ctx => {
    console.error(`       • ${ctx.testFileRelative}`)
  })

  console.error(
    `\n  Generate the missing test file${suffix} with:` +
      '\n       $ pnpm test:specs --target <target_file>' +
      '\n  ...or add the source file' +
      suffix +
      ' to test/specs/ignoredTestFiles.conf\n'
  )

  process.exit(1)
}
