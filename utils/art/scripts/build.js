import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// the generated asset must not depend on the terminal running this
// script: without this, a non-TTY run (CI, spawned tests) makes the
// chalk-based gradient emit NO colors at all and silently writes a
// colorless "color" asset. Truecolor is forced BEFORE gradient-string
// (chalk) is imported, as it reads the environment at import time.
process.env.FORCE_COLOR = '3'
const { default: gradient } = await import('gradient-string')

const source = `
 ██████╗ ██╗   ██╗ █████╗ ███████╗ █████╗ ██████╗
██╔═══██╗██║   ██║██╔══██╗██╔════╝██╔══██╗██╔══██╗
██║   ██║██║   ██║███████║███████╗███████║██████╔╝
██║▄▄ ██║██║   ██║██╔══██║╚════██║██╔══██║██╔══██╗
╚██████╔╝╚██████╔╝██║  ██║███████║██║  ██║██║  ██║
 ╚══▀▀═╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
`

// the gradient endpoint colors are pinned by index.test.js
// (gradientEndpoints) — update both together
const gradientFrom = '#1976D2'
const gradientTo = '#a82f37'

// an optional target dir argument lets the test suite generate into a
// temp dir and byte-compare against the committed assets
const outDir = process.argv[2]
  ? resolve(process.argv[2])
  : join(import.meta.dirname, '../assets')

const rawFilePath = join(outDir, 'cli-banner.raw.txt')
writeFileSync(rawFilePath, source, 'utf8')

const colorFilePath = join(outDir, 'cli-banner.color.txt')
writeFileSync(
  colorFilePath,
  gradient(gradientFrom, gradientTo).multiline(source, {}),
  'utf8'
)

console.log(readFileSync(rawFilePath, 'utf8'))
console.log(readFileSync(colorFilePath, 'utf8'))
