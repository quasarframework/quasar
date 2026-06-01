// Browser-side: minimum lang set for dynamic DocCode callers including Vue
// SFC source viewing (DocExample passes lang="markup", aliased to vue here).
// Pre-compiled grammars + raw JS engine would shrink the bundle further BUT
// html/vue are broken in that combo. See: https://github.com/shikijs/shiki/issues/918

import html from '@shikijs/langs/html'
import javascript from '@shikijs/langs/javascript'
import vue from '@shikijs/langs/vue'

const userLangs = { html, javascript, vue }

export const langs = Object.values(userLangs)

export const langAlias = {
  js: 'javascript',
  ts: 'javascript',
  markup: 'vue',
  css: 'html',
  scss: 'html',
  sass: 'html',
  shell: 'javascript',
  sh: 'javascript',
  bash: 'javascript'
}

export const supportedLangs = [
  ...Object.keys(userLangs),
  ...Object.keys(langAlias)
]
