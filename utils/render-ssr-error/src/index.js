import { readFileSync } from 'node:fs'

import { getErrorDetails } from './error-details.js'
import { getStack } from './stack.js'
import { getEnv } from './env.js'

function readFile(target) {
  return readFileSync(
    new URL(`../compiled-assets/${target}-injection`, import.meta.url),
    'utf8'
  )
}

const before = readFile('before')
const after = readFile('after')

const scriptEscapeRE = /[<>&\u2028\u2029]/g
const scriptEscapeMap = {
  '<': String.raw`\u003C`,
  '>': String.raw`\u003E`,
  '&': String.raw`\u0026`,
  '\u2028': String.raw`\u2028`,
  '\u2029': String.raw`\u2029`
}

function stringifyForScript(data) {
  return JSON.stringify(data).replaceAll(
    scriptEscapeRE,
    character => scriptEscapeMap[character]
  )
}

/**
 * @param {{
 *  err: Error;
 *  req: import('node:http').IncomingMessage | import('node:http2').Http2ServerRequest;
 *  rootFolder: string;
 * }} params
 */
export default function renderSSRError({
  err,
  req,
  rootFolder // the host app's root folder
}) {
  const data = {
    rootFolder,
    error: getErrorDetails(err),
    stack: getStack(err, rootFolder),
    env: getEnv(req)
  }

  // Uncomment this to debug the data
  // writeFileSync(
  //   new URL('./data.json', import.meta.url), JSON.stringify(data, null, 2), 'utf8'
  // )

  return {
    errorHeaders: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    },

    errorHtml: before + stringifyForScript(data) + after
  }
}
