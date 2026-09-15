import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** @type {string} */
export const { version } = require('../package.json')
