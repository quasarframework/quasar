import { exactRegex } from '@rolldown/pluginutils'
import { transformerStyleToClass } from '@shikijs/transformers'

const virtualId = 'virtual:shiki-tokens.css'
const resolvedVirtualId = `\0${virtualId}`

// Sentinel CSS rule with a non-existent tag selector
// The accumulated shiki token CSS replaces it in `generateBundle`.
// A bang comment (`/*! ... */`) would be smaller but lightningcss strips them regardless:
// https://github.com/parcel-bundler/lightningcss/issues/43
const placeholderSelector = '__shiki_tokens_placeholder__'
const placeholderRule = `${placeholderSelector}{display:none}`
const placeholderRE = new RegExp(placeholderSelector + String.raw`\{[^}]*\}`)

let activeTransformer = null

/**
 * @see {@link shikiCssStashPlugin}
 * @example highlighter.codeToHtml(code, { transformers: [ ...getSharedStyleToClasses() ] })
 */
export function getSharedStyleToClasses() {
  return activeTransformer === null ? [] : [activeTransformer]
}

/**
 * Accumulates Shiki's token CSS into a singleton `transformerStyleToClass` instance,
 * and injects the final stylesheet into the bundle by replacing a placeholder rule. This way,
 * all codeblocks share the same CSS classes, and the resulting stylesheet is the minimal
 * set of unique color rules across the whole website.
 *
 * Dev mode keeps inline styles untouched as the singleton needs `generateBundle` to write the
 * final stylesheet, but that's only available in build. This optimization is not worth in dev anyway.
 *
 * @see {@link getSharedStyleToClasses}
 */
export default function shikiCssStashPlugin() {
  return {
    name: 'docs-shiki-css-stash',
    enforce: 'pre',

    config(_config, { command }) {
      // Use a short prefix to reduce the final HTML size. It saves ~7 bytes per token reference
      // compares to the default `__shiki_`, which adds up across the whole website. Final class
      // names look like `s25s62j`. Shouldn't cause any conflicts since the only "random" names
      // we have come from Shiki.
      activeTransformer =
        command === 'build'
          ? transformerStyleToClass({ classPrefix: 's' })
          : null
    },

    resolveId: {
      filter: { id: exactRegex(virtualId) },
      handler() {
        return resolvedVirtualId
      }
    },

    load: {
      filter: { id: exactRegex(resolvedVirtualId) },
      handler() {
        return placeholderRule
      }
    },

    generateBundle(_options, bundle) {
      if (activeTransformer === null) {
        return
      }

      const css = activeTransformer.getCSS()

      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type !== 'asset' ||
          typeof chunk.source !== 'string' ||
          !chunk.source.includes(placeholderSelector)
        ) {
          continue
        }

        chunk.source = chunk.source.replace(placeholderRE, css)
      }
    }
  }
}
