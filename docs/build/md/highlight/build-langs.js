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
import vue from '@shikijs/langs/vue'
import diff from '@shikijs/langs/diff'

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
  html,
  vue,
  diff
}

export const langs = Object.values(userLangs)

export const langAlias = {
  js: 'javascript',
  ts: 'typescript',
  markup: 'html',
  shell: 'bash',
  sh: 'bash'
}

export const supportedLangs = [
  ...Object.keys(userLangs),
  ...Object.keys(langAlias)
]

export const langMatch = supportedLangs.join('|')
