import { existsSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

import { appDir } from './app-paths.js'
import { fatal } from './logger.js'

const tagRegex = /\{(.*?)\}/g
const realAppDir = realpathSync(appDir)

function isOutside(base, target) {
  const path = relative(base, target)
  return path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path)
}

function getAssetPath(folder, name) {
  const absoluteName = resolve(appDir, folder, name)
  const relativeName = relative(appDir, absoluteName)

  if (relativeName === '' || isOutside(appDir, absoluteName)) {
    fatal(
      `Profile asset must be inside the project folder: "${folder}/${name}"`
    )
  }

  let existingPath = absoluteName

  while (existsSync(existingPath) === false) {
    existingPath = dirname(existingPath)
  }

  if (isOutside(realAppDir, realpathSync(existingPath))) {
    fatal(
      `Profile asset cannot use a symbolic link outside the project folder: "${folder}/${name}"`
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
    const { relativeName, absoluteName } = getAssetPath(
      asset.folder,
      asset.name
    )

    const file = {
      ...asset,
      relativeName,
      absoluteName
    }

    if (tag) {
      file.tag = tag.replace(
        tagRegex,
        (_, p) => file[p === 'size' ? 'width' : p]
      )
    }

    return file
  })
}
