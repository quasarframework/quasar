import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { createServer } from 'vite'

import { AppDevserver } from '../../app-devserver.js'
import { fatal, log, warn } from '../../utils/logger.js'
import { onShutdown } from '../../utils/on-shutdown.js'
import { spawn } from '../../utils/spawn.js'
import { getPackagePath } from '../../utils/get-package-path.js'
import { updateHtmlVariables } from '../../plugins/vite.html.js'
import { quasarElectronConfig } from './electron-config.js'

const isLinux = process.platform === 'linux'
const linuxDesktopEntryMarker = 'X-Quasar-Dev-Entry=true'

function delay(time) {
  const { promise, resolve } = Promise.withResolvers()
  setTimeout(resolve, time)
  return promise
}

function getLinuxDesktopName({ desktopName, productName, name }) {
  if (typeof desktopName === 'string') {
    const trimmedName = desktopName.trim()
    if (trimmedName !== '') {
      const configuredName = trimmedName.replace(/\.desktop$/i, '')

      /**
       * The value becomes a desktop-entry filename, so reject path separators
       * and the special dot-only path segments.
       */
      return configuredName !== '.' &&
        configuredName !== '..' &&
        /^[a-zA-Z0-9_.-]+$/.test(configuredName)
        ? configuredName
        : null
    }
  }

  for (const appName of [productName, name]) {
    if (typeof appName === 'string') {
      const normalizedName = appName
        .normalize('NFKD')
        .replaceAll(/\p{M}/gu, '')
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/^-+|-+$/g, '')

      if (normalizedName !== '') {
        return normalizedName
      }
    }
  }

  return null
}

function escapeDesktopEntryValue(value) {
  return String(value)
    .replaceAll('\\', String.raw`\\`)
    .replaceAll('\t', String.raw`\t`)
    .replaceAll('\n', String.raw`\n`)
    .replaceAll('\r', '')
}

export class QuasarModeDevserver extends AppDevserver {
  #pid = 0
  #watcherList = []
  #killedPid = false
  #electronExecutable
  #linuxDesktopEntryPath = null
  #linuxDesktopEntryContent = null

  constructor(opts) {
    super(opts)

    const electronPkgPath = getPackagePath(
      'electron/package.json',
      this.ctx.appPaths.electronDir
    )
    const electronPkg = JSON.parse(readFileSync(electronPkgPath, 'utf8'))

    this.#electronExecutable = join(
      dirname(electronPkgPath),
      electronPkg.bin.electron
    )

    if (isLinux) {
      onShutdown(() => {
        this.#removeLinuxDesktopEntry()
      })
    }

    this.registerDiff('electron', (quasarConf, diffMap) => [
      quasarConf.devServer,
      quasarConf.electron.extendElectronMainConf,
      quasarConf.electron.extendElectronPreloadConf,
      quasarConf.electron.inspectPort,
      quasarConf.electron.preloadScripts,
      quasarConf.sourceFiles.electronMain,
      quasarConf.metaConf.clientEnvDefineList,

      // extends 'rolldown' diff
      ...diffMap.rolldown(quasarConf, diffMap)
    ])

    this.registerRunSteps([
      {
        diff: 'htmlTemplate',
        fn: quasarConf => {
          this.clientNeedsReload = true
          updateHtmlVariables(quasarConf)
        }
      },

      {
        diff: 'vite',
        fn: this.#runVite.bind(this)
      },

      {
        diff: 'electron',
        fn: this.#runElectronFiles.bind(this)
      }
    ])
  }

  async #runVite(quasarConf) {
    this.clientNeedsReload = false

    const viteConfig = await quasarElectronConfig.vite(quasarConf)
    const server = await createServer(viteConfig)

    await this.rebootClient(server)
  }

  async #runElectronFiles(quasarConf) {
    this.clientNeedsReload = false

    await this.clearWatcherList(this.#watcherList, () => {
      this.#watcherList.length = 0
    })

    let isReady = false

    const cfgMain = await quasarElectronConfig.main(quasarConf)
    const cfgPreloadList =
      await quasarElectronConfig.preloadScriptList(quasarConf)

    const cfgList = [
      { banner: 'Electron Main', cfg: cfgMain },
      ...cfgPreloadList.map(preloadScript => ({
        banner: `Electron Preload (${preloadScript.scriptName})`,
        cfg: preloadScript.rolldownConfig
      }))
    ].map(({ banner, cfg }) =>
      this.watchWithRolldown(banner, cfg, () => {
        if (isReady) {
          this.#runElectron(quasarConf)
        }
      }).then(watcher => {
        this.#watcherList.push(watcher)
      })
    )

    return Promise.all(cfgList).then(() => {
      isReady = true
      return this.#runElectron(quasarConf)
    })
  }

  async #runElectron(quasarConf) {
    if (this.#pid) {
      log('Shutting down Electron process...')
      process.kill(this.#pid)

      this.#pid = 0
      this.#killedPid = true

      // on some OSes a small delay is needed
      // so that resources are freed on kill
      await delay(100)
    }

    const electronEntryDir = this.ctx.appPaths.resolve.entry('electron')
    // oxlint-disable-next-line prefer-const
    let { name, productName, version, desktopName } = this.ctx.pkg.appPkg

    if (isLinux) {
      desktopName = getLinuxDesktopName({ name, productName, desktopName })
      this.#createLinuxDesktopEntry({
        name,
        productName,
        desktopName
      })
    }

    /**
     * Electron only loads application metadata when launched with an app
     * directory. Passing the compiled main file directly makes development
     * builds inherit Electron's name, version and Linux desktop identity.
     */
    writeFileSync(
      join(electronEntryDir, 'package.json'),
      JSON.stringify({
        name,
        productName,
        version,
        desktopName: desktopName || 'QuasarApp',
        main: './electron-main.js',
        type: 'module'
      })
    )

    this.#pid = spawn(
      this.#electronExecutable,
      [
        '--inspect=' + quasarConf.electron.inspectPort,
        electronEntryDir,
        ...this.argv._
      ],
      { cwd: this.ctx.appPaths.appDir },
      code => {
        if (this.#killedPid) {
          this.#killedPid = false
          return
        }

        warn()
        fatal(
          code
            ? `Electron process ended with error code: ${code}`
            : 'Electron process was killed. Exiting...'
        )
      }
    )

    // like every other mode's devserver does (the App URL shown is the
    // renderer's dev server, which the Electron window loads)
    this.printBanner(quasarConf, { electronPid: this.#pid })
  }

  #createLinuxDesktopEntry({ name, productName, desktopName }) {
    this.#removeLinuxDesktopEntry()

    if (
      desktopName === null ||
      (process.env.DISPLAY === void 0 && process.env.WAYLAND_DISPLAY === void 0)
    ) {
      return
    }

    const appPaths = this.ctx.appPaths
    const iconPathList = [
      appPaths.resolve.electron('electron-assets/icons/icon.png'),
      appPaths.resolve.electron('electron-assets/icons/linux-512x512.png')
    ]
    const iconPath = iconPathList.find(existsSync)
    if (iconPath === void 0) return

    const filename = `${desktopName}.desktop`
    const appDir = escapeDesktopEntryValue(appPaths.appDir)
    const appDirMarker = `X-Quasar-Dev-AppDir=${appDir}`

    const dataHome =
      process.env.XDG_DATA_HOME || join(homedir(), '.local', 'share')

    const dataDirList = (
      process.env.XDG_DATA_DIRS || '/usr/local/share:/usr/share'
    )
      .split(':')
      .filter(Boolean)

    const desktopEntryPath = join(dataHome, 'applications', filename)
    const existingDesktopEntryPath = [dataHome, ...dataDirList]
      .map(dir => join(dir, 'applications', filename))
      .find(existsSync)

    if (existingDesktopEntryPath !== void 0) {
      if (existingDesktopEntryPath === desktopEntryPath) {
        try {
          const content = readFileSync(desktopEntryPath, 'utf8')

          // Adopt an entry left by an interrupted Quasar process so that a
          // later graceful shutdown can remove it.
          if (
            content.includes(linuxDesktopEntryMarker) &&
            content.includes(appDirMarker)
          ) {
            this.#linuxDesktopEntryPath = desktopEntryPath
            this.#linuxDesktopEntryContent = content
          }
        } catch {}
      }

      return
    }

    const appDisplayName = escapeDesktopEntryValue(
      productName || name || 'Quasar App'
    )
    const content = [
      '[Desktop Entry]',
      'Type=Application',
      `Name=${appDisplayName} (Development)`,
      'Comment=Temporary launcher metadata for Quasar Electron development',
      'Exec=/bin/false',
      `Icon=${escapeDesktopEntryValue(iconPath)}`,
      'NoDisplay=true',
      'StartupNotify=false',
      `StartupWMClass=${desktopName}`,
      linuxDesktopEntryMarker,
      appDirMarker
    ].join('\n')

    try {
      mkdirSync(dirname(desktopEntryPath), { recursive: true })
      writeFileSync(desktopEntryPath, content, {
        flag: 'wx',
        mode: 0o600
      })

      this.#linuxDesktopEntryPath = desktopEntryPath
      this.#linuxDesktopEntryContent = content
    } catch {
      // Desktop integration is best-effort and must not prevent development.
    }
  }

  #removeLinuxDesktopEntry() {
    if (this.#linuxDesktopEntryPath === null) {
      return
    }

    try {
      // Never delete a desktop entry that another process replaced while the
      // development server was running.
      if (
        readFileSync(this.#linuxDesktopEntryPath, 'utf8') ===
        this.#linuxDesktopEntryContent
      ) {
        unlinkSync(this.#linuxDesktopEntryPath)
      }
    } catch {
      // The entry may already have been removed by the user or the OS.
    }

    this.#linuxDesktopEntryPath = null
    this.#linuxDesktopEntryContent = null
  }
}
