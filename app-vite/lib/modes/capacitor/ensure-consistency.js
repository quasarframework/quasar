import fs from 'node:fs'
import fse from 'fs-extra'

export function ensureWWW ({ appPaths, forced }) {
  const www = appPaths.resolve.capacitor('www')

  forced === true && fse.removeSync(www)

  if (!fs.existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor/www'),
      appPaths.resolve.capacitor('www')
    )
  }
}

export async function ensureDeps ({ appPaths, cacheProxy }) {
  if (fs.existsSync(appPaths.resolve.capacitor('node_modules'))) {
    return
  }

  const nodePackager = await cacheProxy.getModule('nodePackager')
  nodePackager.install({
    cwd: appPaths.capacitorDir,
    displayName: 'Capacitor'
  })
}

export async function ensureConsistency (opts) {
  ensureWWW(opts)
  await ensureDeps(opts)
}
