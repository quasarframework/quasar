<template>
  <form
    ref="formRef"
    method="post"
    action="https://codepen.io/pen/define/"
    target="_blank"
    rel="noopener"
    class="hidden"
  >
    <input
      v-if="active"
      type="hidden"
      name="data"
      :value="options"
    />
  </form>
</template>

<script setup>
import { Quasar } from 'quasar'
import { ref, reactive, computed, nextTick } from 'vue'

import { slugify } from 'assets/page-utils'

const cssResources = [
  'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.min.css`
].join(';')

const jsResources = [
  'https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js',
  `https://cdn.jsdelivr.net/npm/quasar@${Quasar.version}/dist/quasar.umd.prod.js`
].join(';')

const replace = name => function (_, p1) {
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

const props = defineProps({ title: String })

const active = ref(false)
const formRef = ref(null)
const def = reactive({ parts: {} })

const css = computed(() => {
  return (def.parts.Style || '')
    .replace(/(<style.*?>|<\/style>)/g, '')
    .trim()
})

const cssPreprocessor = computed(() => {
  const lang = /<style.*lang=["'](.*)["'].*>/
    .exec(def.parts.Style || '')

  return lang ? lang[ 1 ] : 'none'
})

const js = computed(() => {
  const quasarImports = /import\s+{([^}'\n]+)}\s+from\s+'quasar'/g
  const vueImports = /import\s+{([^}'\n]+)}\s+from\s+'vue'/g
  const otherImports = /import ([^'\n]*) from ([^\n]*)/g
  let component = /export default {([\s\S]*)}/g.exec(def.parts.Script || '')

  component = ((component && component[ 1 ]) || '').trim()
  if (component.length > 0) {
    component = '\n  ' + component + '\n'
  }

  let script = /<script>([\s\S]*)export default {/g.exec(def.parts.Script || '')
  script = ((script && script[ 1 ]) || '')
    .replace(quasarImports, replace('Quasar'))
    .replace(vueImports, replace('Vue'))
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
  return (def.parts.Template || '')
    .replace(/(<template>|<\/template>$)/g, '')
    .replace(/\n/g, '\n  ')
    .replace(/([\w]+=")([^"]*?)(")/g, function (match, p1, p2, p3) {
      return p1 + p2.replace(/>/g, '___TEMP_REPLACEMENT___') + p3
    })
    .replace(/<(q-[\w-]+|div)([^>]*?)\s*?([\n\r][\t ]+)?\/>/gs, '<$1$2$3></$1>')
    .replace(/(<template[^>]*>)(\s*?(?:[\n\r][\t ]+)?)<(thead|tbody|tfoot)/gs, '$1$2<___PREVENT_TEMPLATE___$3')
    .replace(/<(thead|tbody|tfoot)(.*?)[\n\r]?(\s*)<\/\1>/gs, function (match, p1, p2, p3) {
      return '<template>\n' + p3 + '  <' + p1 + p2.split(/[\n\r]+/g).join('\n  ') + '\n' + p3 + '  </' + p1 + '>\n' + p3 + '</template>'
    })
    .replace(/___PREVENT_TEMPLATE___/g, '')
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

const slugifiedTitle = computed(() => {
  return 'example--' + slugify(props.title)
})

const options = computed(() => {
  const data = {
    title: computedTitle.value,
    html:
      `<!--
Forked from:
${window.location.origin + window.location.pathname}#${slugifiedTitle.value}
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

function open (whichParts) {
  def.parts = whichParts

  if (active.value) {
    formRef.value.submit()
    return
  }

  active.value = true

  nextTick(() => {
    formRef.value.submit()
  })
}

defineExpose({ open })
</script>
