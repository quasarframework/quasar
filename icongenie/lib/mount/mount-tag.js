
import { log } from '../utils/logger.js'

export function mountTag (files) {
  const tagFiles = files.filter(file => file.tag)

  if (tagFiles.length === 0) {
    return
  }

  console.log()
  log(`You will need the following tags in your /index.html or /src/index.template.html:\n`)
  tagFiles.forEach(file => {
    console.log(file.tag)
  })
  console.log()
}
