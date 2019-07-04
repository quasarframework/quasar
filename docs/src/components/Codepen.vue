<template lang="pug">
form(
  v-if="active"
  method="POST"
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
import Quasar from 'quasar'

const cssResources = [
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.min.css`
].join(';')

const jsResources = [
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.umd.min.js`
].join(';')

export default {
  name: 'Codepen',

  props: {
    title: String,
    slugifiedTitle: String,
    parts: Object
  },

  data: () => ({ active: false }),

  computed: {
    css () {
      return (this.parts.style || '')
        .replace(/(<style.*?>|<\/style>)/g, '')
        .trim()
    },

    cssPreprocessor () {
      const lang = /<style.*lang=["'](.*)["'].*>/
        .exec(this.parts.style || '')

      return lang ? lang[1] : 'none'
    },

    js () {
      const imports = /(import*) ([^'\n]*) from ([^\n]*)/g
      let component = /export default {([\s\S]*)}/g.exec(this.parts.script || '')
      component = ((component && component[1]) || '').trim()
      let script = /<script>([\s\S]*)export default {/g.exec(this.parts.script || '')
      script = ((script && script[1]) || '')
        .replace(imports, '')
        .trim()
      script += script ? '\n\n' : ''
      return script +
        `new Vue({
  el: '#q-app',
  ${component}
})`
    },

    html () {
      return (this.parts.template || '')
        .replace(/(<template>|<\/template>$)/g, '')
        .replace(/\n/g, '\n  ')
        .replace(/([\w]+=")([^"]*?)(")/gs, function (match, p1, p2, p3) {
          return p1 + p2.replace(/>/g, '___TEMP_REPLACEMENT___') + p3
        })
        .replace(/<(q-[\w-]+)([^>]+?)\/>/gs, '<$1$2></$1>')
        .replace(/___TEMP_REPLACEMENT___/gs, '>')
        .trim()
    },
    editors () {
      const flag = (this.html && 0b100) | (this.css && 0b010) | (this.js && 0b001)
      return flag.toString(2)
    },

    computedTitle () {
      return (this.page ? this.page + ': ' : '') +
        (this.title ? this.title + ' - ' : '') +
        'Quasar Playground'
    },

    page () {
      let el = this.$parent

      while (el && el.$options && (!el.$options.meta || !el.$options.meta.title)) {
        el = el.$parent
      }

      return el ? el.$options.meta.title : null
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
    open () {
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
