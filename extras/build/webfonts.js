import { join } from 'node:path'
import spawn from 'cross-spawn'

function run(webfont) {
  const runner = spawn.sync('bash', [`./${webfont}.update.sh`], {
    stdio: 'inherit',
    cwd: import.meta.dirname
  })

  if (runner.status || runner.error) {
    console.log()
    console.log('status:', runner.status)
    console.log('error:', runner.error)
    console.error(
      `⚠️  Command failed with exit code: ${runner.status || runner.error}`
    )
    process.exit(1)
  }
}

const webfonts = [
  'material-icons',
  'material-icons-outlined',
  'material-icons-round',
  'material-icons-sharp',
  'material-symbols-outlined',
  'material-symbols-rounded',
  'material-symbols-sharp',
  'roboto-font'
]

const baseFolder = join(import.meta.dirname, '../exports')

webfonts.forEach(webfont => {
  console.log(`\n\nUpdating "${webfont}" webfont`)
  console.log()

  console.log(join(baseFolder, webfont))
  run(webfont)
})
