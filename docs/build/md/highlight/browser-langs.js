// Browser-side: minimum lang set for dynamic DocCode callers.
//
// Pre-compiled grammars + raw JS engine would shrink the bundle further BUT
// html/vue are broken in that combo. See: https://github.com/shikijs/shiki/issues/918

import javascript from '@shikijs/langs/javascript'
import sass from '@shikijs/langs/sass'
import vue from '@shikijs/langs/vue'

const userLangs = { javascript, sass, vue }

export const langs = Object.values(userLangs)

export const langAlias = {
  js: 'javascript',
  ts: 'javascript'
}

export const supportedLangs = [
  ...Object.keys(userLangs),
  ...Object.keys(langAlias)
]
