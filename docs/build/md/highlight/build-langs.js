import bash from '@shikijs/langs/bash'
import javascript from '@shikijs/langs/javascript'
import typescript from '@shikijs/langs/typescript'
import yaml from '@shikijs/langs/yaml'
import sass from '@shikijs/langs/sass'
import scss from '@shikijs/langs/scss'
import css from '@shikijs/langs/css'
import json from '@shikijs/langs/json'
import xml from '@shikijs/langs/xml'
import nginx from '@shikijs/langs/nginx'
import html from '@shikijs/langs/html'

/**
 * Use "html" lang instead. The "vue" lang imports
 * a lot of other languages that we don't need, and
 * the highlighting is mostly the same!
 */
// import vue from '@shikijs/langs/vue'

/**
 * !! Keep in sync with `client-runtime.js` loaderMap
 */
const userLangs = {
  bash,
  javascript,
  typescript,
  yaml,
  sass,
  scss,
  css,
  json,
  xml,
  nginx,
  html
}

export const langs = Object.values(userLangs)

export const langAlias = {
  js: 'javascript',
  ts: 'typescript'
}

export const supportedLangs = [
  ...Object.keys(userLangs),
  ...Object.keys(langAlias)
]

export const langMatch = [...supportedLangs, 'text'].join('|')
