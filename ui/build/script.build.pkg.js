const
  fs = require('fs-extra'),
  path = require('path'),
  root = path.resolve(__dirname, '..'),
  outputFolder = path.resolve(root, '..', 'ui.pkg'),
  resolvePath = (dir, file) => path.resolve(dir, file)

fs.removeSync(outputFolder)
createFolder(outputFolder)
copyToOutput('dist', true)
copyToOutput('icon-set', true)
copyToOutput('lang', true)
copyToOutput('src', true)
copyToOutput('package.json', false)

function createFolder (name) {
  if (!fs.existsSync(name)) {
    fs.mkdirSync(name)
  }
}

function copyToOutput (name, isFolder) {
  const outputPath = resolvePath(outputFolder, name)
  if (isFolder) {
    createFolder(outputPath)
  }
  fs.copy(resolvePath(root, name), outputPath, err => {
    if (err) {
      return console.error(err)
    }
  })
}

console.log(`\n 💥 Copied package-related files to ${outputFolder}.\n`)
