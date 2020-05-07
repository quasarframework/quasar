const { log } = require('../utils/logger')

module.exports.mountTag = function mountTag (files) {
  const tagFiles = files.filter(file => file.tag)

  if (tagFiles.length === 0) {
    return
  }

  console.log()
  log(`You will need the following tags in your /src/index.template.html:\n`)
  tagFiles.forEach(file => {
    console.log(file.tag)
  })
  console.log()
}
