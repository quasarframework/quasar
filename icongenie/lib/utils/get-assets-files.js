import { lstatSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

import { appDir } from './app-paths.js'
import { fatal } from './logger.js'

const tagRegex = /\{(.*?)\}/g
const realAppDir = realpathSync(appDir)

function isOutside(base, target) {
  const path = relative(base, target)
  return path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path)
}

// a symbolic link counts as existing even when its target is missing,
// since writing through it would create that target
function isSymlinkedOutside(absoluteName) {
  let existingPath = absoluteName

  while (lstatSync(existingPath, { throwIfNoEntry: false }) === void 0) {
    existingPath = dirname(existingPath)
  }

  try {
    return isOutside(realAppDir, realpathSync(existingPath))
  } catch {
    return true
  }
}

/**
 * Everything that gets written (the assets and the files derived from
 * them when mounting) has to stay inside the project folder.
 */
export function ensureInsideProject(absoluteName, subject, label) {
  if (absoluteName === appDir || isOutside(appDir, absoluteName)) {
    fatal(`${subject} must be inside the project folder: "${label}"`)
  }

  if (isSymlinkedOutside(absoluteName)) {
    fatal(
      `${subject} cannot use a symbolic link outside the project folder: "${label}"`
    )
  }
}

function getAssetPath({ folder, name, platform }) {
  const absoluteName = resolve(appDir, folder, name)
  const relativeName = relative(appDir, absoluteName)
  const label = `${folder}/${name}`

  ensureInsideProject(absoluteName, 'Profile asset', label)

  // their mounting writes to the parent of the asset folder
  // (<res>/mipmap-<density>/<name> for <res>/mipmap-anydpi-v26)
  if (platform === 'capacitor-android' && !relativeName.includes(sep)) {
    fatal(
      `Capacitor Android profile asset must be in a subfolder of the project folder: "${label}"`
    )
  }

  return { relativeName, absoluteName }
}

export function getAssetsFiles(assets) {
  const list = []

  assets.forEach(({ sizes, ...props }) => {
    if (sizes) {
      sizes.forEach(size => {
        const isArray = Array.isArray(size)

        const [width, height] = isArray ? size : [size, size]

        const replacer = isArray ? `${width}x${height}` : width

        list.push({
          ...props,
          name: props.name.replaceAll('{size}', replacer),
          width,
          height
        })
      })
    } else {
      list.push(props)
    }
  })

  return list.map(({ tag, ...asset }) => {
    const { relativeName, absoluteName } = getAssetPath(asset)

    const file = {
      ...asset,
      relativeName,
      absoluteName
    }

    if (tag) {
      file.tag = tag.replaceAll(
        tagRegex,
        (_, p) => file[p === 'size' ? 'width' : p]
      )
    }

    return file
  })
}
