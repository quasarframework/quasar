const spawn = require('cross-spawn')
const { join } = require('path')

function run (cwd) {
  const runner = spawn.sync(
    'bash',
    [ './update.sh' ],
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  if (runner.status || runner.error) {
    console.log()
    console.error(`⚠️  Command failed with exit code: ${runner.status || runner.error}`)
    process.exit(1)
  }
}

const webfonts = [
  'material-icons',
  'material-icons-outlined',
  'material-icons-round',
  'material-icons-sharp',
  'roboto-font',
  'roboto-font-latin-ext'
]

const baseFolder = join(__dirname, '..')

webfonts.forEach(webfont => {
  console.log(`\n\nUpdating "${webfont}" webfont`)
  console.log()

  console.log(join(baseFolder, webfont))
  run(join(baseFolder, webfont))
})
