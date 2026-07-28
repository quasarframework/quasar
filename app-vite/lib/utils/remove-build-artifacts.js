import fse from 'fs-extra'
import { homedir } from 'node:os'
import { dirname, isAbsolute, parse, relative, resolve, sep } from 'node:path'

import { log } from './logger.js'

function isContainedPath(root, target) {
  const relativePath = relative(root, target)

  return (
    relativePath !== '' &&
    relativePath !== '..' &&
    relativePath.startsWith(`..${sep}`) === false &&
    isAbsolute(relativePath) === false
  )
}

function getExistingAncestor(target) {
  let current = target

  while (true) {
    try {
      fse.lstatSync(current)
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

function getEffectivePath(target) {
  const existingAncestor = getExistingAncestor(target)
  const realAncestor = fse.realpathSync(existingAncestor)

  return resolve(realAncestor, relative(existingAncestor, target))
}

function isFilesystemRoot(target) {
  return target === parse(target).root
}

export function getBuildArtifactsCleanTarget({
  targetDir,
  projectDir,
  allowOutsideProject
}) {
  if (typeof targetDir !== 'string' || targetDir.trim() === '') {
    throw new Error('Build output directory must be a non-empty path')
  }

  if (typeof projectDir !== 'string' || projectDir.trim() === '') {
    throw new Error('Project directory must be a non-empty path')
  }

  const project = resolve(projectDir)
  const effectiveProject = fse.realpathSync(project)
  const home = fse.realpathSync(resolve(homedir()))
  const target = resolve(projectDir, targetDir)
  const effectiveTarget = getEffectivePath(target)

  if (isFilesystemRoot(target) || isFilesystemRoot(effectiveTarget)) {
    throw new Error('Refusing to remove a filesystem root as build output')
  }

  if (target === home || effectiveTarget === home) {
    throw new Error(
      'Refusing to remove the user home directory as build output'
    )
  }

  if (target === project || effectiveTarget === effectiveProject) {
    throw new Error('Refusing to remove the project root as build output')
  }

  if (
    allowOutsideProject !== true &&
    isContainedPath(effectiveProject, effectiveTarget) === false
  ) {
    throw new Error(
      'Build output directory must remain inside the project. Set build.allowOutsideProjectDistDir to true to explicitly allow an external directory.'
    )
  }

  return { target, effectiveTarget }
}

export function removeBuildArtifacts(options) {
  const { target, effectiveTarget } = getBuildArtifactsCleanTarget(options)

  if (fse.pathExistsSync(target)) {
    const symlinkTarget =
      target !== effectiveTarget ? ` (resolves to: ${effectiveTarget})` : ''

    log(`Removing build artifacts: ${target}${symlinkTarget}`)
    fse.removeSync(target)
  }
}
