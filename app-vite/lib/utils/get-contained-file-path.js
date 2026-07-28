import fse from 'fs-extra'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'

function isContainedPath(root, target, allowRoot) {
  const relativePath = relative(root, target)

  return (
    (allowRoot === true || relativePath !== '') &&
    relativePath !== '..' &&
    relativePath.startsWith(`..${sep}`) === false &&
    isAbsolute(relativePath) === false
  )
}

async function getExistingAncestor(target) {
  let current = target

  while (true) {
    try {
      await fse.lstat(current)
      return current
    } catch (err) {
      if (err.code !== 'ENOENT' && err.code !== 'ENOTDIR') {
        throw err
      }
    }

    const parent = dirname(current)

    if (parent === current) {
      throw new Error(`Could not resolve an existing ancestor for "${target}"`)
    }

    current = parent
  }
}

export async function getContainedFilePath(rootDir, ...pathSegments) {
  const root = resolve(rootDir)

  for (const segment of pathSegments) {
    if (typeof segment !== 'string' || isAbsolute(segment)) {
      throw new Error(
        'The output path must contain only relative path segments'
      )
    }
  }

  const target = resolve(root, ...pathSegments)

  if (isContainedPath(root, target, false) === false) {
    throw new Error(
      'The output path must resolve to a file inside the output directory'
    )
  }

  const [realRoot, existingAncestor] = await Promise.all([
    fse.realpath(root),
    getExistingAncestor(target)
  ])
  const realAncestor = await fse.realpath(existingAncestor)

  if (isContainedPath(realRoot, realAncestor, true) === false) {
    throw new Error(
      'The output path must not traverse a symlink outside the output directory'
    )
  }

  return target
}
