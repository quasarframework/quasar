
import { readFileSync } from 'node:fs'

import { getErrorDetails } from './error-details.js'
import { getStack } from './stack.js'
import { getEnv } from './env.js'

function readFile (target) {
  return readFileSync(
    new URL(`../compiled-assets/${ target }-injection`, import.meta.url),
    'utf8'
  )
}

const before = readFile('before')
const after = readFile('after')

export default function renderSSRError ({ err, req, res, projectRootFolder }) {
  const data = {
    error: getErrorDetails(err),
    stack: getStack(err, projectRootFolder),
    env: getEnv(req)
  }

  // Uncomment this to debug the data
  // writeFileSync(
  //   new URL('./data.json', import.meta.url).pathname, JSON.stringify(data, null, 2), 'utf8'
  // )

  res.status(500).send(
    before
    + JSON.stringify(data).replace(/<\/script>/g, '<\\/script>')
    + after
  )
}
