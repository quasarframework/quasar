import { existsSync } from 'node:fs'

import { resolveDir } from './app-paths.js'
import { warn } from './logger.js'

// Assets of these platforms are written inside the native project,
// which only exists after the platform was added to it
const platformFolders = {
  'capacitor-android': 'src-capacitor/android',
  'capacitor-ios': 'src-capacitor/ios'
}

export function filterPlatformFiles(files) {
  const missing = new Set()

  const list = files.filter(file => {
    const folder = platformFolders[file.platform]

    if (folder === void 0 || existsSync(resolveDir(folder))) {
      return true
    }

    missing.add(`${file.platform} (/${folder})`)
    return false
  })

  missing.forEach(platform => {
    warn(`Skipping ${platform} assets: platform not added to the project`)
  })

  return list
}
