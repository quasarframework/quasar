function showHelp (exitCode = 0) {
  console.log(`
  Description
    UI test files validator & generator

  Usage
    $ specs [--ci] [-t <target>] [-g <json.path>]
    $ specs [-t <target>] [-g <json.path>]
    $ specs [-d] [-t <target>]

    $ specs --ci

    $ specs -t QIcon
    $ specs -t components
    $ specs -t Ico
    $ specs -t utils

    $ specs -t QIcon -g props.name

  Options
    --target, -t        Target a component/directive/plugin/composable/other
                           (should not specify file extension)
    --generate, -g      Generates a targeted section of a json path
    --dry-run, -d       Dry-run test for create + validate (no output to files)
    --ci, -c            Validate & create specs while in CI mode
    --help, -h          Show this help message
  `)
  process.exit(exitCode)
}

import parseArgs from 'minimist'

const argv = parseArgs(process.argv.slice(2), {
  alias: {
    t: 'target',
    g: 'generate',
    c: 'ci',
    d: 'dry-run',
    h: 'help'
  },
  boolean: [ 'h', 'c', 'd' ],
  string: [ 't', 'g' ]
})

if (argv.help) showHelp()

import { getTargetList } from './target.js'
import { ignoredTestFiles } from './ignoredTestFiles.js'
import { createCtx } from './ctx.js'
import { getTestFile } from './testFile.js'

import { cmdValidateTestFile } from './cmd.validateTestFile.js'
import { cmdCreateTestFile } from './cmd.createTestFile.js'
import { cmdGenerateSection } from './cmd.generateSection.js'
import { getDryRunCmd } from './cmd.dryRun.js'

const targetList = getTargetList(argv)

if (targetList.length === 0) {
  console.error('No such target found...')
  process.exit(1)
}

const cmdDryRun = argv[ 'dry-run' ] === true
  ? await getDryRunCmd()
  : null

for (const target of targetList) {
  if (ignoredTestFiles.has(target) === true) {
    if (argv.ci !== true) {
      console.log(`  📦 Ignoring "${ target }"`)
    }
    continue
  }

  const ctx = createCtx(target)
  const testFile = getTestFile(ctx)

  if (cmdDryRun !== null) {
    await cmdDryRun({ ctx, testFile })
  }
  else if (argv.generate !== void 0) {
    await cmdGenerateSection({ ctx, testFile, jsonPath: argv.generate })
  }
  else if (testFile.content !== null) {
    await cmdValidateTestFile({ ctx, testFile, argv })
  }
  else if (argv.ci !== true) {
    await cmdCreateTestFile({ ctx, testFile, ignoredTestFiles })
  }
}
