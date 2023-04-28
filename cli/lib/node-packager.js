import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { sync as spawn } from 'cross-spawn'

import { fatal } from './logger.js'

function isInstalled (cmd) {
  try {
    return spawn(cmd, ['--version']).status === 0
  }
  catch (err) {
    return false
  }
}

export function getNodePackager (root) {
  if (existsSync(join(root, 'yarn.lock'))) {
    return 'yarn'
  }

  if (existsSync(join(root, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }

  if (existsSync(join(root, 'package-lock.json'))) {
    return 'npm'
  }

  if (isInstalled('yarn')) {
    return 'yarn'
  }

  if (isInstalled('npm')) {
    return 'npm'
  }

  if (isInstalled('pnpm')) {
    return 'pnpm'
  }

  fatal('⚠️  Please install Yarn or Pnpm or NPM before running this command.\n')
}
