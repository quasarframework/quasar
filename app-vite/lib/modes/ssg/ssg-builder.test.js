import { spawnSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, describe, expect, test } from 'vitest'

const builderUrl = pathToFileURL(
  join(import.meta.dirname, 'ssg-builder.js')
).href
const fixtureRoots = []
const checkoutCache = join(import.meta.dirname, '../../../node_modules/.cache')
mkdirSync(checkoutCache, { recursive: true })

afterAll(() => {
  for (const rootDir of fixtureRoots) {
    rmSync(rootDir, { recursive: true, force: true })
  }
})

describe('[ssg-builder.js] loadSsgRenderer()', () => {
  // Exercise the OS temp directory and the checkout's drive, which can be a
  // non-system drive on Windows.
  for (const [location, baseDir] of [
    ['system temporary directory', tmpdir()],
    ['checkout drive', checkoutCache]
  ]) {
    const rootDir = realpathSync(
      mkdtempSync(join(baseDir, 'quasar-ssg-renderer-'))
    )
    fixtureRoots.push(rootDir)

    describe(location, () => {
      test.each(['plain', 'with spaces', 'with # and %'])(
        'loads and runs the renderer from %s',
        directory => {
          const distDir = join(rootDir, directory)
          const rendererDir = join(distDir, '__ssg__')
          mkdirSync(rendererDir, { recursive: true })
          writeFileSync(join(distDir, 'package.json'), '{"type":"module"}')

          const expected = {
            pages: [{ route: '/regression' }],
            html: '<main>Rendered SSG fixture</main>'
          }
          writeFileSync(
            join(rendererDir, 'ssg-script.js'),
            `export const getSsgPages = () => ${JSON.stringify(expected.pages)}
export const renderSsgPage = () => ${JSON.stringify(expected.html)}
`
          )

          // Use Node's actual ESM loader: Vitest's module runner can accept
          // filesystem paths that Node rejects on Windows or truncates at #.
          const env = { ...process.env }
          delete env.NODE_PATH
          const result = spawnSync(
            process.execPath,
            [
              '--input-type=module',
              '--eval',
              `import { loadSsgRenderer } from ${JSON.stringify(builderUrl)}
const { getSsgPages, renderSsgPage } = await loadSsgRenderer(process.argv[1])
console.log(JSON.stringify({
  pages: await getSsgPages(),
  html: await renderSsgPage()
}))`,
              distDir
            ],
            { env, encoding: 'utf8' }
          )

          expect(result.error).toBeUndefined()
          expect(result.status, result.stderr || result.stdout).toBe(0)
          expect(JSON.parse(result.stdout)).toEqual(expected)
        }
      )
    })
  }
})
