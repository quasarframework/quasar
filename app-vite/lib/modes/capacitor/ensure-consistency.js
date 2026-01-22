import { existsSync } from 'node:fs'
import fse from 'fs-extra'

export function ensureWWW ({ appPaths, forced }) {
  const www = appPaths.resolve.capacitor('www')

  forced === true && fse.removeSync(www)

  if (!existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor/www'),
      www
    )
  }
}

export async function ensureDeps ({ appPaths, cacheProxy }) {
  if (existsSync(appPaths.resolve.capacitor('node_modules'))) return

  const nodePackager = await cacheProxy.getModule('nodePackager')
  nodePackager.install({
    cwd: appPaths.capacitorDir,
    // See https://github.com/orgs/pnpm/discussions/4735
    // We also started creating an empty pnpm-workspace.yaml file in src-capacitor as of app-vite v2.4.1
    // which addresses all cases without requiring explicit ignore-workspace flag all the time.
    // However, we are keeping this for backward compatibility of the scaffolded projects and just in case.
    params: nodePackager.name === 'pnpm' ? [ 'i', '--ignore-workspace' ] : undefined,
    displayName: 'Capacitor'
  })
}

export async function ensureConsistency (opts) {
  ensureWWW(opts)
  await ensureDeps(opts)
}
