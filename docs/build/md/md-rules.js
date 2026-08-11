/**
 * Shared markdown-it parsing rules used by both the HTML docs pipeline
 * and the AI-docs extractor. Render hooks live in the per-pipeline modules.
 */

import { registerContainers } from './md-plugin-containers.js'

/**
 * markdown-it options shared by the HTML site config (md.js) and the AI
 * extractor (md-ai.js, which overrides `typographer` to false).
 *
 * @type {{ html: boolean, linkify: boolean, typographer: boolean }}
 */
export const sharedMdOptions = {
  html: true,
  linkify: false,
  typographer: true
}

/**
 * Install every parsing-only rule both pipelines need. Renderer hooks are
 * pipeline-specific and stay out of this module so the AI extractor can swap
 * in its own emitters without dragging the HTML output along.
 *
 * @param {import('markdown-it')} md
 */
export function registerAllParsing(md) {
  registerContainers(md)
  // The other md-plugin-* modules are HTML-only renderers with no parsing
  // rules. Add new shared parsing here as needed.
}
