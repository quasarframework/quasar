const { yellow } = require('chalk')
const execa = require('execa')

/**
 * Checks if Git is present in the system
 */
function hasGit() {
  try {
    execa.sync('git', ['--version'], { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

/**
 * Checks if the project already have an initialized Git repo
 * @param {string} cwd Path of the created project directory
 */
function hasProjectGit(cwd) {
  try {
    execa.sync('git', ['status'], { stdio: 'ignore', cwd })
    return true
  } catch (e) {
    return false
  }
}

/**
 * Initialize a git repository into the project directory, if possible
 * @param {string} cwd Path of the created project directory
 */
 module.exports.initializeGit = async function (cwd) {
  if(!hasGit()) {
    console.log(yellow(' Git is not present on the system, skipping repo initialization...'))
    return
  }
  
  if(hasProjectGit(cwd)) {
    console.log(yellow(' The project already have an initialized Git repository, skipping repo initialization...'))
    return
  }

  await execa('git', ['init'], { cwd })
  await execa('git', ['add', '-A'], { cwd })
  
  try {
    await execa('git', ['commit', '-m', 'init', '--no-verify'], { cwd, stdio: 'ignore' })
  } catch (e) {
    console.log(yellow(' Skipped git commit because an error occurred, you will need to perform the initial commit yourself.'))
  }
}