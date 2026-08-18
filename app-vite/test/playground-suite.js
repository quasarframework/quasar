import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'
import { expect } from 'vitest'

import {
  createStepTest,
  getFreePort,
  hasBin,
  run,
  runQuasar,
  testDevServer,
  testSsrProdServer
} from './e2e-utils.js'
import qe2eMarkers from './fixtures/quasar-app-extension-qe2e/src/markers.js'

// installing Cordova mode spawns the (globally installed) cordova CLI
const hasCordovaBin = hasBin('cordova')

// The single source for values pinned from the playground fixtures —
// rendered-content assertions couple to these on purpose (they prove
// real rendering). The owning files carry breadcrumb comments pointing
// back here; when a fixture changes, this is the one place to update.
const fixtureMarkers = {
  // playground-*/src/pages/index/(index).vue — the index page button
  indexPageContent: 'Go to Second Page',
  // playground-ts/src/stores/example-store.ts — rendered on the index
  // page, proving store state made it through SSR/SSG rendering
  storeGreeting: 'Greetings from Pinia',
  // playground-ts/src/stores/example-store.ts: the serialized form of the
  // store's Map, proving non-JSON types survive state serialization
  storeMapState: 'new Map([["ssr","map-survives-serialization"]])'
}

// The full per-playground pipeline, driving every mode through the real
// CLI. Register it inside a describe() block; returns the step registrar
// so a playground can append its own extra steps.
export function definePlaygroundSuite({ playgroundDir, scriptExt }) {
  const stepTest = createStepTest()

  // The non-SPA mode folders are generated & gitignored. Every step
  // advertising a mode (auto-)install removes its folder itself, right
  // before running — so each step is self-sufficient and behaves the
  // same in a full run and in a filtered (vitest -t) run.
  const removeModeDir = modeName => {
    rmSync(join(playgroundDir, `src-${modeName}`), {
      recursive: true,
      force: true
    })
  }

  // SSG steps cannot lean on the CLI's own auto-install: it would
  // scaffold the renderer for the non-interactive default (no
  // filename-based routing) while the playgrounds use it — so steps
  // needing the mode install the right variant themselves when absent
  const ensureSsgMode = async () => {
    if (existsSync(join(playgroundDir, 'src-ssg'))) return

    const { code, output, repro } = await runQuasar(
      ['mode', 'add', 'ssg', '--filename-based-routing'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)
  }

  // Config-modifying steps write the pristine file to this gitignored
  // sibling BEFORE modifying and delete it after restoring — so even a
  // hard-killed run (finally never fires) self-heals on the next one,
  // without involving git (which could also wipe unrelated user edits).
  const configFile = join(playgroundDir, `quasar.config.${scriptExt}`)
  const configBackupFile = `${configFile}.e2e-backup`

  const healConfigLeftover = () => {
    if (existsSync(configBackupFile)) {
      copyFileSync(configBackupFile, configFile)
      rmSync(configBackupFile)
    }
  }

  const restoreConfig = originalConfig => {
    writeFileSync(configFile, originalConfig)
    rmSync(configBackupFile, { force: true })
  }

  // Reads the playground quasar.config for a from→to modification —
  // self-healing any leftover of a killed run first — and guards both
  // directions: the anchor must still exist, and the modification must
  // not already be present (possible only through external editing,
  // since a leftover would have healed above). Writes the backup;
  // callers MUST end with restoreConfig(originalConfig) in a finally.
  const readCleanConfig = (from, to) => {
    healConfigLeftover()

    const originalConfig = readFileSync(configFile, 'utf8')

    expect(
      originalConfig,
      `quasar.config.${scriptExt} already contains the modification and ` +
        'no backup exists to heal from — restore the file manually'
    ).not.toContain(to)
    expect(
      originalConfig,
      `quasar.config.${scriptExt} lost its "${from}" edit anchor`
    ).toContain(from)

    writeFileSync(configBackupFile, originalConfig)
    return originalConfig
  }

  // temporarily applies a from→to quasar.config modification for the
  // given fn, always restoring the original file afterwards
  const withModifiedConfig = async ({ from, to }, fn) => {
    const originalConfig = readCleanConfig(from, to)
    writeFileSync(configFile, originalConfig.replace(from, to))

    try {
      await fn()
    } finally {
      restoreConfig(originalConfig)
    }
  }

  // the generated dist/ssr is a standalone package; installs its deps,
  // pointing the monorepo's own packages at the local checkouts (their
  // resolved versions may not be published yet, and the SSR webserver
  // should serve THIS repo's quasar at runtime anyway — vite
  // externalizes it in the server bundle)
  const installSsrDistDeps = async () => {
    const distDir = join(playgroundDir, 'dist/ssr')
    const pkgFile = join(distDir, 'package.json')
    const pkg = JSON.parse(readFileSync(pkgFile, 'utf8'))

    // the playground's quasar/@quasar/extras deps use the workspace:
    // protocol; the generated package.json must have resolved it (it
    // could never install from dist/ssr, a standalone workspace root)
    expect(JSON.stringify(pkg.dependencies)).not.toContain('workspace:')

    for (const name of ['quasar', '@quasar/extras']) {
      const localDir = realpathSync(join(playgroundDir, 'node_modules', name))
      pkg.dependencies[name] = `file:${localDir}`
    }
    writeFileSync(pkgFile, JSON.stringify(pkg, null, 2))

    const { code, output, repro } = await run(
      'pnpm',
      ['install', '--no-frozen-lockfile'],
      distDir
    )
    expect(code, output + repro).toBe(0)
    expect(existsSync(join(distDir, 'node_modules')), repro).toBe(true)
  }

  // The fixture App Extension gets symlinked into the playground,
  // invoked (registration + rendered files) and uninvoked again within
  // a single step. Everything it leaves behind is gitignored and healed
  // by the clean step, so a hard-killed run cannot dirty the worktree.
  const qe2eFixtureDir = join(
    import.meta.dirname,
    'fixtures/quasar-app-extension-qe2e'
  )
  const qe2ePackageLink = join(
    playgroundDir,
    'node_modules/quasar-app-extension-qe2e'
  )
  const qe2eExtensionsFile = join(playgroundDir, 'quasar.extensions.json')
  const qe2eRenderedDir = join(playgroundDir, qe2eMarkers.renderedDirName)

  const healQe2eLeftovers = () => {
    rmSync(qe2eExtensionsFile, { force: true })
    rmSync(qe2eRenderedDir, { recursive: true, force: true })
    rmSync(qe2ePackageLink, { recursive: true, force: true })
  }

  const appPkgName = JSON.parse(
    readFileSync(join(playgroundDir, 'package.json'), 'utf8')
  ).name

  // the ts playground ships a pinia store, the js one deliberately
  // does not — so both the with-store and without-store paths are covered
  const hasStore = existsSync(join(playgroundDir, 'src/stores'))

  stepTest('cleans the build artifacts', async () => {
    // a hard-killed previous run may have left a modified config
    // or an invoked qe2e extension behind
    healConfigLeftover()
    healQe2eLeftovers()

    const { code, output, repro } = await runQuasar(['clean'], playgroundDir)
    expect(code, output + repro).toBe(0)

    // so every artifact asserted below is produced by THIS run
    expect(existsSync(join(playgroundDir, '.quasar')), repro).toBe(false)
    expect(readdirSync(join(playgroundDir, 'dist')), repro).toHaveLength(0)
  })

  stepTest('prepares the app types', async () => {
    const { code, output, repro } = await runQuasar(['prepare'], playgroundDir)
    expect(code, output + repro).toBe(0)

    const dotQuasarDir = join(playgroundDir, '.quasar')
    for (const file of ['tsconfig.json', 'quasar.d.ts', 'feature-flags.d.ts']) {
      expect(
        existsSync(join(dotQuasarDir, file)),
        `.quasar/${file} was not generated${repro}`
      ).toBe(true)
    }

    const tsconfig = JSON.parse(
      readFileSync(join(dotQuasarDir, 'tsconfig.json'), 'utf8')
    )
    expect(tsconfig.compilerOptions.paths, repro).toHaveProperty('#q-app')

    // pinia augmentations are generated exactly when a store exists
    expect(existsSync(join(dotQuasarDir, 'pinia.d.ts')), repro).toBe(hasStore)
  })

  stepTest('builds the app in SPA mode', async () => {
    const { code, output, repro } = await runQuasar(['build'], playgroundDir)
    expect(code, output + repro).toBe(0)

    const indexFile = join(playgroundDir, 'dist/spa/index.html')
    expect(existsSync(indexFile), repro).toBe(true)

    const indexHtml = readFileSync(indexFile, 'utf8')
    expect(indexHtml, repro).toMatch(/<div id="?q-app"?>/)
    // it references at least one built (hashed) script
    expect(indexHtml, repro).toMatch(/assets\/[\w.-]+\.js/)
  })

  stepTest(
    'builds the app in SPA mode with the qe2e extension invoked',
    async () => {
      healQe2eLeftovers()
      symlinkSync(qe2eFixtureDir, qe2ePackageLink)

      try {
        // invoke: prompts answers stored + install script rendered files
        let res = await runQuasar(['ext', 'invoke', 'qe2e'], playgroundDir)
        expect(res.code, res.output + res.repro).toBe(0)
        expect(res.output, res.repro).toContain(qe2eMarkers.installExitLog)
        expect(
          JSON.parse(readFileSync(qe2eExtensionsFile, 'utf8')).qe2e,
          res.repro
        ).toEqual({ greeting: qe2eMarkers.promptGreeting })
        expect(
          readFileSync(join(qe2eRenderedDir, 'greeting.txt'), 'utf8'),
          res.repro
        ).toContain(`greeting=${qe2eMarkers.promptGreeting}`)

        // a real build picks up the AE's extendViteConf hook
        res = await runQuasar(['build'], playgroundDir)
        expect(res.code, res.output + res.repro).toBe(0)
        expect(
          readFileSync(join(playgroundDir, 'dist/spa/index.html'), 'utf8'),
          res.repro
        ).toContain(qe2eMarkers.viteHtmlMarker)

        // uninvoke: uninstall script removes what install rendered
        res = await runQuasar(['ext', 'uninvoke', 'qe2e'], playgroundDir)
        expect(res.code, res.output + res.repro).toBe(0)
        expect(res.output, res.repro).toContain(qe2eMarkers.uninstallExitLog)
        expect(existsSync(qe2eRenderedDir), res.repro).toBe(false)
      } finally {
        healQe2eLeftovers()
      }
    }
  )

  stepTest('builds the app in SSR mode, auto-installing it', async () => {
    removeModeDir('ssr')

    const { code, output, repro } = await runQuasar(
      ['build', '-m', 'ssr'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    // the mode got auto-installed with the non-interactive default
    expect(output, repro).toContain('Non-interactive environment detected')

    const distDir = join(playgroundDir, 'dist/ssr')
    for (const file of [
      'index.js',
      'package.json',
      'render-template.js',
      'client',
      'server'
    ]) {
      expect(
        existsSync(join(distDir, file)),
        `dist/ssr/${file} was not generated${repro}`
      ).toBe(true)
    }
  })

  stepTest('installs the SSR webserver dependencies', async () => {
    await installSsrDistDeps()
  })

  stepTest('serves the SSR production build', async () => {
    const port = await getFreePort()
    const html = await testSsrProdServer(join(playgroundDir, 'dist/ssr'), port)

    expect(html).toMatch(/<div id="?q-app"?>/)
    // page content present in the payload proves actual server-side
    // rendering (a client-side rendered shell ships an empty q-app div)
    expect(html).toContain(fixtureMarkers.indexPageContent)
    // preload tags are rendered by default — the no-preload-routes step
    // below asserts their absence, so pin their presence here
    expect(html).toContain('modulepreload')

    if (hasStore) {
      // the store got used during the render and its state serialized
      expect(html).toContain(fixtureMarkers.storeGreeting)
      expect(html).toContain('__INITIAL_STATE__')
      expect(html).toContain(fixtureMarkers.storeMapState)
    } else {
      expect(html).not.toContain('__INITIAL_STATE__')
    }
  })

  stepTest(
    'serves the SSR production build with CSR and no-preload routes',
    async () => {
      await withModifiedConfig(
        {
          from: 'ssr: {',
          to:
            "ssr: {\n    clientSideRenderingRoutes: ['/second'],\n" +
            "    noPreloadTagRoutes: ['/'],"
        },
        async () => {
          const { code, output, repro } = await runQuasar(
            ['build', '-m', 'ssr'],
            playgroundDir
          )
          expect(code, output + repro).toBe(0)

          const distDir = join(playgroundDir, 'dist/ssr')
          // the client-side rendered shell only gets emitted
          // when CSR routes are configured
          expect(existsSync(join(distDir, 'server/csr.html')), repro).toBe(true)

          await installSsrDistDeps()

          const port = await getFreePort()
          const html = await testSsrProdServer(distDir, port, {
            onReady: async origin => {
              const response = await fetch(`${origin}/second`, {
                headers: { accept: 'text/html' }
              })
              expect(response.status).toBe(200)

              // a CSR route answers with the client-side shell:
              // an EMPTY mount point instead of rendered page content
              const csrHtml = await response.text()
              expect(csrHtml).toMatch(/<div id="?q-app"?><\/div>/)
            }
          })

          // '/' is still server-rendered...
          expect(html).toContain(fixtureMarkers.indexPageContent)
          // ...but as a no-preload route it carries no preload tags
          expect(html).not.toContain('modulepreload')
        }
      )
    }
  )

  stepTest('builds the app in SSR mode with PWA takeover', async () => {
    await withModifiedConfig(
      // trailing comma matters: it keeps the leftover check from
      // matching the commented-out "// pwa: true" in the ssg section
      { from: 'pwa: false,', to: 'pwa: true,' },
      async () => {
        // ssr.pwa auto-installs PWA mode itself when missing
        const { code, output, repro } = await runQuasar(
          ['build', '-m', 'ssr'],
          playgroundDir
        )
        expect(code, output + repro).toBe(0)

        const clientDir = join(playgroundDir, 'dist/ssr/client')
        for (const file of ['sw.js', 'manifest.json']) {
          expect(
            existsSync(join(clientDir, file)),
            `dist/ssr/client/${file} was not generated${repro}`
          ).toBe(true)
        }
      }
    )
  })

  stepTest('adds SSG mode with --filename-based-routing', async () => {
    // must be added explicitly BEFORE building: the playgrounds use
    // filename-based routing, while a non-interactive auto-install would
    // scaffold the renderer for the default (not using it), which would
    // then fail to import the non-existent @/router/routes file
    removeModeDir('ssg')

    const { code, output, repro } = await runQuasar(
      ['mode', 'add', 'ssg', '--filename-based-routing'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    const renderer = readFileSync(
      join(playgroundDir, `src-ssg/ssg-renderer.${scriptExt}`),
      'utf8'
    )
    // the filename-based-routing template variant got rendered
    expect(renderer, repro).toContain('getFilenameBasedRoutes')
  })

  stepTest('builds the app in SSG mode', async () => {
    await ensureSsgMode()

    const { code, output, repro } = await runQuasar(
      ['build', '-m', 'ssg'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    const indexFile = join(playgroundDir, 'dist/ssg/index.html')
    expect(existsSync(indexFile), repro).toBe(true)

    // statically generated markup, not a client-side rendered shell
    const indexHtml = readFileSync(indexFile, 'utf8')
    expect(indexHtml, repro).toMatch(/<div id="?q-app"?>/)
    expect(indexHtml, repro).toContain(fixtureMarkers.indexPageContent)

    if (hasStore) {
      // store-driven content is statically rendered too
      expect(indexHtml, repro).toContain(fixtureMarkers.storeGreeting)
      expect(indexHtml, repro).toContain(fixtureMarkers.storeMapState)
    }
  })

  stepTest('builds the app in SSG mode with a CSR route', async () => {
    await ensureSsgMode()

    await withModifiedConfig(
      {
        from: 'ssg: {',
        to: "ssg: {\n    clientSideRenderingRoutes: ['/second'],"
      },
      async () => {
        const { code, output, repro } = await runQuasar(
          ['build', '-m', 'ssg'],
          playgroundDir
        )
        expect(code, output + repro).toBe(0)

        const distDir = join(playgroundDir, 'dist/ssg')
        // the CSR route is not statically generated — the emitted
        // client-side shell covers it at serve time instead
        expect(existsSync(join(distDir, 'csr.html')), repro).toBe(true)
        expect(existsSync(join(distDir, 'second.html')), repro).toBe(false)

        // other routes are still statically rendered
        const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf8')
        expect(indexHtml, repro).toContain(fixtureMarkers.indexPageContent)
      }
    )
  })

  stepTest('builds the app in PWA mode, auto-installing it', async () => {
    removeModeDir('pwa')

    const { code, output, repro } = await runQuasar(
      ['build', '-m', 'pwa'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    const distDir = join(playgroundDir, 'dist/pwa')
    for (const file of ['index.html', 'sw.js', 'manifest.json']) {
      expect(
        existsSync(join(distDir, file)),
        `dist/pwa/${file} was not generated${repro}`
      ).toBe(true)
    }
  })

  stepTest('builds the app in BEX mode, auto-installing it', async () => {
    removeModeDir('bex')

    const { code, output, repro } = await runQuasar(
      ['build', '-m', 'bex'],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    const distDir = join(playgroundDir, 'dist/bex-chrome')
    for (const file of [
      'manifest.json',
      'background.js',
      'www/index.html',
      // the packaged extension, named after the package.json name
      `Packaged.${appPkgName}.zip`
    ]) {
      expect(
        existsSync(join(distDir, file)),
        `dist/bex-chrome/${file} was not generated${repro}`
      ).toBe(true)
    }

    const manifest = JSON.parse(
      readFileSync(join(distDir, 'manifest.json'), 'utf8')
    )
    expect(manifest.manifest_version, repro).toBeTypeOf('number')
  })

  stepTest(
    'builds the app in Electron mode unpackaged, auto-installing it',
    async () => {
      // --skip-pkg: compiling the UI + main/preload threads is the part
      // exercising app-vite; packaging is @electron/packager's concern
      removeModeDir('electron')

      const { code, output, repro } = await runQuasar(
        ['build', '-m', 'electron', '--skip-pkg'],
        playgroundDir
      )
      expect(code, output + repro).toBe(0)

      const distDir = join(playgroundDir, 'dist/electron/UnPackaged')
      for (const file of ['index.html', 'electron-main.js', 'package.json']) {
        expect(
          existsSync(join(distDir, file)),
          `dist/electron/UnPackaged/${file} was not generated${repro}`
        ).toBe(true)
      }

      // static bundle integrity: the compiled output must carry no
      // unresolved rolldown-plugin injection tokens nor leaked SFC
      // template markup
      const bundleFiles = readdirSync(distDir, { recursive: true }).filter(
        file => /\.(js|mjs|cjs)$/.test(file)
      )
      expect(bundleFiles.length, repro).toBeGreaterThan(0)
      for (const file of bundleFiles) {
        const content = readFileSync(join(distDir, file), 'utf8')
        expect(content, `${file} has unresolved tokens${repro}`).not.toMatch(
          /__quasar_inject_\w+__/
        )
        expect(content, `${file} leaks template markup${repro}`).not.toContain(
          '<template>'
        )
      }

      // the scaffolded workspace file allowlists electron's postinstall
      // script — a no-op for electron >= 43 (no postinstall; the binary
      // self-downloads on first launch) but required for older pins,
      // where pnpm would silently block the binary download
      const workspaceFile = readFileSync(
        join(playgroundDir, 'src-electron/pnpm-workspace.yaml'),
        'utf8'
      )
      expect(workspaceFile, repro).toContain('onlyBuiltDependencies')
    }
  )

  stepTest('adds Capacitor mode non-interactively', async () => {
    // building Capacitor requires adding a native platform (and its
    // toolchain), so e2e coverage stops at the mode installation
    removeModeDir('capacitor')

    const { code, output, repro } = await runQuasar(
      [
        'mode',
        'add',
        'capacitor',
        '--app-id',
        'org.quasar.e2e',
        '--app-name',
        'Quasar E2E'
      ],
      playgroundDir
    )
    expect(code, output + repro).toBe(0)

    const capacitorConfig = readFileSync(
      join(playgroundDir, `src-capacitor/capacitor.config.${scriptExt}`),
      'utf8'
    )
    expect(capacitorConfig, repro).toContain("appId: 'org.quasar.e2e'")
    expect(capacitorConfig, repro).toContain("appName: 'Quasar E2E'")
  })

  stepTest(
    'adds Cordova mode non-interactively',
    async () => {
      // building Cordova requires a native platform toolchain,
      // so e2e coverage stops at the mode installation
      removeModeDir('cordova')

      const { code, output, repro } = await runQuasar(
        ['mode', 'add', 'cordova', '--app-id', 'org.quasar.e2e'],
        playgroundDir
      )
      expect(code, output + repro).toBe(0)

      const configXml = readFileSync(
        join(playgroundDir, 'src-cordova/config.xml'),
        'utf8'
      )
      expect(configXml, repro).toContain('org.quasar.e2e')
    },
    // installing the mode spawns the cordova CLI (a global npm package)
    { runIf: hasCordovaBin }
  )

  stepTest('serves the app in SPA dev mode', async () => {
    const port = await getFreePort()
    const { html } = await testDevServer(
      ['dev', '-p', String(port)],
      playgroundDir
    )

    expect(html).toMatch(/<div id="?q-app"?>/)
    // the page went through the dev pipeline (HMR client injected),
    // it is not a statically served file
    expect(html).toContain('/@vite/client')
  })

  stepTest('serves the app in SSR dev mode', async () => {
    const port = await getFreePort()
    const { html } = await testDevServer(
      ['dev', '-m', 'ssr', '-p', String(port)],
      playgroundDir
    )

    expect(html).toMatch(/<div id="?q-app"?>/)
    // dev-mode requests are server-rendered too
    expect(html).toContain(fixtureMarkers.indexPageContent)
    expect(html).toContain('/@vite/client')

    if (hasStore) {
      expect(html).toContain(fixtureMarkers.storeGreeting)
      expect(html).toContain('__INITIAL_STATE__')
      expect(html).toContain(fixtureMarkers.storeMapState)
    }
  })

  stepTest('serves the app in SSG dev mode', async () => {
    await ensureSsgMode()

    const port = await getFreePort()
    const { html } = await testDevServer(
      ['dev', '-m', 'ssg', '-p', String(port)],
      playgroundDir
    )

    expect(html).toMatch(/<div id="?q-app"?>/)
    // SSG dev serves server-rendered pages (like SSR dev)
    expect(html).toContain(fixtureMarkers.indexPageContent)
    expect(html).toContain('/@vite/client')
  })

  stepTest('serves the app in PWA dev mode', async () => {
    const port = await getFreePort()
    const { html } = await testDevServer(
      ['dev', '-m', 'pwa', '-p', String(port)],
      playgroundDir,
      {
        // the dev server also serves the PWA manifest
        onReady: async ({ origin }) => {
          const response = await fetch(`${origin}/manifest.json`)
          expect(response.status).toBe(200)
          const manifest = await response.json()
          expect(manifest.name).toBeTypeOf('string')
        }
      }
    )

    expect(html).toMatch(/<div id="?q-app"?>/)
    expect(html).toContain('/@vite/client')
  })

  stepTest('serves the app in BEX dev mode', async () => {
    const port = await getFreePort()
    const { html } = await testDevServer(
      ['dev', '-m', 'bex', '-p', String(port)],
      playgroundDir,
      {
        // BEX announces no App URL — the banner's load-the-extension
        // note is the ready signal; its vite server listens on the
        // dev port regardless (it drives the extension's HMR)
        readyRe: /Load the dev extension in/,
        url: `http://localhost:${port}/`
      }
    )

    expect(html).toContain('<html')

    // what a user actually consumes in BEX dev: the unpacked dev
    // extension folder the banner points at
    const devDistDir = join(playgroundDir, 'dist/bex-chrome--dev')
    for (const file of ['manifest.json', 'background.js']) {
      expect(
        existsSync(join(devDistDir, file)),
        `dist/bex-chrome--dev/${file} was not generated`
      ).toBe(true)
    }
  })

  stepTest('serves the app in Electron dev mode', async () => {
    // the warmup below needs the mode's deps BEFORE the dev command
    // would get a chance to auto-install them
    if (
      !existsSync(join(playgroundDir, 'src-electron/node_modules/electron'))
    ) {
      const added = await runQuasar(['mode', 'add', 'electron'], playgroundDir)
      expect(added.code, added.output + added.repro).toBe(0)
    }

    // Warm the Electron binary first (electron >= 43 downloads it lazily
    // on first launch), so the settle window below measures the app
    // actually starting instead of the download.
    // Every upstream release invalidates the local binary cache, turning
    // this into a multi-minute download that reports nothing: the
    // downloader's progress bar is TTY-gated and a vitest worker has no
    // TTY, so no child output can ever surface it. Without the heartbeat
    // below the step just sits there and reads as a hung dev server.
    // An already-cached binary exits install.js immediately, well before
    // the first tick, so warm runs stay silent.
    const warmupStartedAt = Date.now()
    const warmupHeartbeat = setInterval(() => {
      const elapsedSec = Math.round((Date.now() - warmupStartedAt) / 1000)
      console.log(
        `  still warming the Electron binary — ${elapsedSec}s elapsed; a new upstream release re-downloads it`
      )
    }, 15_000)

    let warmup
    try {
      warmup = await run(
        process.execPath,
        ['node_modules/electron/install.js'],
        join(playgroundDir, 'src-electron')
      )
    } finally {
      clearInterval(warmupHeartbeat)
    }

    expect(warmup.code, warmup.output + warmup.repro).toBe(0)

    const port = await getFreePort()
    // Electron advertises no App URL (the app runs in its own window),
    // so the banner's Electron PID line is the ready signal and the
    // renderer dev server is fetched on the -p port directly.
    // --no-sandbox lets the binary run on CI runners, where the
    // Chromium sandbox cannot start (CI wraps the run in xvfb-run for
    // the missing display). settleMs verifies the Electron app itself
    // came up without errors: the CLI exits as soon as the Electron
    // process dies, so surviving the settle window means the app is up.
    const { html, output } = await testDevServer(
      ['dev', '-m', 'electron', '-p', String(port), '--', '--no-sandbox'],
      playgroundDir,
      {
        readyRe: /Electron PID/,
        url: `http://localhost:${port}/`,
        settleMs: 5000
      }
    )

    expect(html).toMatch(/<div id="?q-app"?>/)
    expect(html).toContain('/@vite/client')
    expect(output).not.toContain('ended with error')
    // the running banner names the spawned Electron process
    expect(output).toMatch(/Electron PID\.+ \d+/)
  })

  // cordova/capacitor dev requires a device/emulator (their dev flow
  // spawns the native tooling), so their dev commands are not covered

  stepTest(
    'applies quasar.config changes while the dev server runs',
    async () => {
      // it must be a devServer change: a cosmetic-only edit would be
      // correctly diffed away by the devserver, restarting nothing.
      // Applied mid-flight (the server must boot with the original),
      // hence readCleanConfig directly instead of withModifiedConfig.
      const originalConfig = readCleanConfig(
        'devServer: {',
        "devServer: {\n    headers: { 'X-Qe2e': 'reload' },"
      )

      const port = await getFreePort()

      try {
        await testDevServer(['dev', '-p', String(port)], playgroundDir, {
          onReady: async ({ origin, waitForOutput }) => {
            writeFileSync(
              configFile,
              originalConfig.replace(
                'devServer: {',
                "devServer: {\n    headers: { 'X-Qe2e': 'reload' },"
              )
            )

            await waitForOutput(/Applying quasar\.config changes/)
            // the devServer change restarts the server → banner reprint
            await waitForOutput(/App URL[\s\S]+App URL/)

            const response = await fetch(origin, {
              headers: { accept: 'text/html' }
            })
            expect(response.status).toBe(200)
            // the reloaded config is live in the running server
            expect(response.headers.get('x-qe2e')).toBe('reload')
          }
        })
      } finally {
        restoreConfig(originalConfig)
      }
    }
  )

  return stepTest
}
