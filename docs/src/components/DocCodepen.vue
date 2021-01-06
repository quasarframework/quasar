<template lang="pug">
form(
  ref="form"
  method="post"
  action="https://codepen.io/pen/define/"
  target="_blank"
  rel="noopener"
  class="hidden"
)
  input(
    v-if="active"
    type="hidden"
    name="data"
    :value="options"
  )
</template>

<script>
import { Quasar } from 'quasar'
import { ref, reactive, computed, nextTick } from 'vue'

const cssResources = [
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.min.css`
].join(';')

const jsResources = [
  'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.umd.prod.js`
].join(';')

const replace = name => function (match, p1) {
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
    text.push('const { ' + parts.join(', ') + ' } = ' + name)
  }
  return text.join('\n')
}

const replaceQuasarImports = replace('Quasar')
const replaceVueImports = replace('Vue')

export default {
  name: 'DocCodepen',

  props: {
    title: String,
    slugifiedTitle: String
  },

  setup (props) {
    const active = ref(false)
    const form = ref(null) // $refs.form
    const def = reactive({
      parts: {}
    })

    const css = computed(() => {
      return (def.parts.style || '')
        .replace(/(<style.*?>|<\/style>)/g, '')
        .trim()
    })

    const cssPreprocessor = computed(() => {
      const lang = /<style.*lang=["'](.*)["'].*>/
        .exec(def.parts.style || '')

      return lang ? lang[ 1 ] : 'none'
    })

    const js = computed(() => {
      const quasarImports = /import\s+{([^}'\n]+)}\s+from\s+'quasar'/g
      const vueImports = /import\s+{([^}'\n]+)}\s+from\s+'vue'/g
      const otherImports = /import ([^'\n]*) from ([^\n]*)/g
      let component = /export default {([\s\S]*)}/g.exec(def.parts.script || '')

      component = ((component && component[ 1 ]) || '').trim()
      if (component.length > 0) {
        component = '\n  ' + component + '\n'
      }

      let script = /<script>([\s\S]*)export default {/g.exec(def.parts.script || '')
      script = ((script && script[ 1 ]) || '')
        .replace(quasarImports, replaceQuasarImports)
        .replace(vueImports, replaceVueImports)
        .replace(otherImports, '')
        .trim()

      script += script ? '\n\n' : ''
      return script +
        `const app = Vue.createApp({${component}})

app.use(Quasar, { config: {} })
app.mount('#q-app')
`
    })

    const html = computed(() => {
      return (def.parts.template || '')
        .replace(/(<template>|<\/template>$)/g, '')
        .replace(/\n/g, '\n  ')
        .replace(/([\w]+=")([^"]*?)(")/g, function (match, p1, p2, p3) {
          return p1 + p2.replace(/>/g, '___TEMP_REPLACEMENT___') + p3
        })
        .replace(/<(q-[\w-]+|div)([^>]*?)\s*?([\n\r][\t ]+)?\/>/gs, '<$1$2$3></$1>')
        .replace(/<(thead|tbody)(.*?)[\n\r]?(\s*)<\/\1>/gs, function (match, p1, p2, p3) {
          return '<template>\n' + p3 + '  <' + p1 + p2.split(/[\n\r]+/g).join('\n  ') + '\n' + p3 + '  </' + p1 + '>\n' + p3 + '</template>'
        })
        .replace(/___TEMP_REPLACEMENT___/g, '>')
        .replace(/^\s{2}/gm, '')
        .trim()
    })

    const editors = computed(() => {
      const flag = (html.value && 0b100) | (css.value && 0b010) | (js.value && 0b001)
      return flag.toString(2)
    })

    const computedTitle = computed(() => {
      return (typeof document !== 'undefined' ? document.title.split(' | ')[ 0 ] + ': ' : '') +
        (props.title ? props.title + ' - ' : '') +
        `Quasar v${Quasar.version}`
    })

    const options = computed(() => {
      const data = {
        title: computedTitle.value,
        html:
          `<!--
  Forked from:
  ${window.location.origin + window.location.pathname}#${props.slugifiedTitle}
-->
<div id="q-app" style="min-height: 100vh;">
  ${html.value}
</div>`,
        head: '',
        html_pre_processor: 'none',
        css: css.value,
        css_pre_processor: cssPreprocessor.value,
        css_external: cssResources,
        js: js.value,
        js_pre_processor: 'babel',
        js_external: jsResources,
        editors: editors.value
      }
      return JSON.stringify(data)
    })

    async function open (whichParts) {
      def.parts = whichParts

      if (active.value) {
        form.value.submit()
        return
      }

      active.value = true

      await nextTick()
      form.value.submit()
    }

    return {
      active,
      form,
      options,
      open
    }
  }
}
</script>
