
import { readFileSync, writeFileSync } from 'node:fs'

const TARGET_STRING = '"<!-- inject:data -->"'
const [ pre, post ] = readFileSync(
  new URL('../src-ui/dist/index.html', import.meta.url).pathname,
  'utf8'
).split(TARGET_STRING)

writeFileSync(
  new URL('../compiled-assets/before-injection', import.meta.url).pathname,
  pre,
  'utf8'
)

writeFileSync(
  new URL('../compiled-assets/after-injection', import.meta.url).pathname,
  post,
  'utf8'
)
