import fse from 'fs-extra'
import glob from 'fast-glob'
import { createPatch } from 'diff'
import { highlight } from 'cli-highlight'

import { resolveToRoot, relativeToRoot } from './build.utils.js'

/**
 * Call this with the path to file (or folder) you want to track, before the file gets updated.
 * It will save the current contents and will print the diff before exiting the process.
 *
 * @param {string} locationPath
 */
export default function prepareDiff (locationPath) {
  const absolutePath = resolveToRoot(locationPath)

  // If there is no "old" file/folder, then there is no diff (everything will be new)
  if (!fse.existsSync(absolutePath)) {
    return
  }

  let pattern = glob.convertPathToPattern(absolutePath)
  // If it's a directory, then query all files in it
  if (fse.lstatSync(absolutePath).isDirectory()) {
    pattern += '/*'
  }

  const originalsMap = new Map()
  const originalFiles = glob.sync(pattern)

  // If no files, then there is no diff (everything will be new)
  if (originalFiles.length === 0) {
    return
  }

  // Read the current (old) contents
  originalFiles.forEach(filePath => {
    originalsMap.set(filePath, fse.readFileSync(filePath, 'utf-8'))
  })

  // Before exiting the process, read the new contents and output the diff
  process.on('exit', code => {
    if (code !== 0) return

    const currentFiles = glob.sync(pattern)
    const currentMap = new Map()

    let somethingChanged = false

    currentFiles.forEach(filePath => {
      const relativePath = relativeToRoot(filePath)
      currentMap.set(filePath, true)

      if (originalsMap.has(filePath) === false) {
        console.log(`\n 📜 New file: ${ relativePath }`)
        somethingChanged = true
        return
      }

      const currentContent = fse.readFileSync(filePath, 'utf-8')
      const originalContent = originalsMap.get(filePath)

      if (originalContent !== currentContent) {
        const diffPatch = createPatch(filePath, originalContent, currentContent)

        console.log(`\n 📜 Changes for ${ relativePath }\n`)
        console.log(highlight(diffPatch, { language: 'diff' }))
        somethingChanged = true
      }
    })

    originalsMap.forEach((_, filePath) => {
      if (currentMap.has(filePath) === false) {
        console.log(`\n 📜 Removed file: ${ relativeToRoot(filePath) }\n`)
        somethingChanged = true
      }
    })

    if (somethingChanged === false) {
      console.log('\n 📜 No changes detected.\n')
    }
  })
}
