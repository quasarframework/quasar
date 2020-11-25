<template lang="pug">
form(
  v-if="active"
  method="post"
  action="https://codepen.io/pen/define/"
  target="_blank"
  rel="noopener"
  class="hidden"
)
  input(
    type="hidden"
    name="data"
    :value="options"
  )
</template>

<script>
import { Quasar } from 'quasar'

const cssResources = [
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.min.css`
].join(';')

const jsResources = [
  'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.umd.prod.js`
].join(';')

export default {
  name: 'Codepen',

  props: {
    title: String,
    slugifiedTitle: String
  },

  data: () => ({ active: false, parts: {} }),

  computed: {
    css () {
      return (this.parts.style || '')
        .replace(/(<style.*?>|<\/style>)/g, '')
        .trim()
    },

    cssPreprocessor () {
      const lang = /<style.*lang=["'](.*)["'].*>/
        .exec(this.parts.style || '')

      return lang ? lang[ 1 ] : 'none'
    },

    js () {
      const importsQ = /import\s+{([^}'\n]+)}\s+from\s+'quasar'/g
      const imports = /import ([^'\n]*) from ([^\n]*)/g
      let component = /export default {([\s\S]*)}/g.exec(this.parts.script || '')
      component = ((component && component[ 1 ]) || '').trim()
      if (component.length > 0) {
        component = '\n  ' + component + '\n'
      }
      let script = /<script>([\s\S]*)export default {/g.exec(this.parts.script || '')
      script = ((script && script[ 1 ]) || '')
        .replace(importsQ, function (match, p1) {
          const parts = p1
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0)
            .reduce((acc, p) => {
              acc.push(p)
              return acc
            }, [])

          const text = []
          if (parts.length > 0) {
            text.push('const { ' + parts.c.join(', ') + ' } = Quasar')
          }
          return text.join('\n')
        })
        .replace(imports, '')
        .trim()
      script += script ? '\n\n' : ''
      return script +
        `const app = Vue.createApp({${component}})
app.use(Quasar, { config: {} })
app.mount('#q-app')
`
    },

    html () {
      return (this.parts.template || '')
        .replace(/(<template>|<\/template>$)/g, '')
        .replace(/\n/g, '\n  ')
        .replace(/([\w]+=")([^"]*?)(")/g, function (match, p1, p2, p3) {
          return p1 + p2.replace(/>/g, '___TEMP_REPLACEMENT___') + p3
        })
        .replace(/<(q-[\w-]+|div)([^>]*?)\s*?([\r\n][\t ]+)?\/>/g, '<$1$2$3></$1>')
        .replace(/<(thead|tbody)(.*?)[\n\r]?(\s*)<\/\1>/g, function (match, p1, p2, p3) {
          return '<template>\n' + p3 + '  <' + p1 + p2.split(/[\n\r]+/g).join('\n  ') + '\n' + p3 + '  </' + p1 + '>\n' + p3 + '</template>'
        })
        .replace(/___TEMP_REPLACEMENT___/g, '>')
        .replace(/^\s{2}/gm, '')
        .trim()
    },

    editors () {
      const flag = (this.html && 0b100) | (this.css && 0b010) | (this.js && 0b001)
      return flag.toString(2)
    },

    computedTitle () {
      return (typeof document !== 'undefined' ? document.title.split(' | ')[ 0 ] + ': ' : '') +
        (this.title ? this.title + ' - ' : '') +
        `Quasar v${Quasar.version}`
    },

    options () {
      const data = {
        title: this.computedTitle,
        html:
          `<!--
  Forked from:
  ${window.location.origin + window.location.pathname}#${this.slugifiedTitle}
-->
<div id="q-app">
  ${this.html}
</div>`,
        head: '',
        html_pre_processor: 'none',
        css: this.css,
        css_pre_processor: this.cssPreprocessor,
        css_external: cssResources,
        js: this.js,
        js_pre_processor: 'babel',
        js_external: jsResources,
        editors: this.editors
      }
      return JSON.stringify(data)
    }
  },

  methods: {
    open (parts) {
      this.parts = parts

      if (this.active) {
        this.$el.submit()
        return
      }

      this.active = true

      this.$nextTick(() => {
        this.$el.submit()
      })
    }
  }
}
</script>
