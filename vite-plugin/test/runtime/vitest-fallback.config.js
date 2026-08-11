import { createConfig } from './vitest.config.js'

/**
 * Runs the whole runtime suite through the regex-based fallback
 * transformation (astAutoImport disabled). A separate config file
 * instead of an env variable keeps the script cross-platform
 * (cmd.exe does not support inline VAR=value assignments).
 */
export default createConfig({ astAutoImport: false })
