<template>
  <q-card class="doc-example q-my-lg" flat bordered>
    <div class="header-toolbar row items-center q-pr-sm">
      <DocCardTitle :title="props.title" prefix="example--" />

      <q-space />

      <div class="doc-example__actions row no-wrap items-center">
        <q-btn
          class="header-btn"
          dense
          flat
          round
          :icon="mdiCompare"
          @click="docStore.toggleDark"
        >
          <q-tooltip>Toggle dark mode</q-tooltip>
        </q-btn>

        <q-separator class="q-mx-xs" vertical inset />

        <q-btn
          class="header-btn"
          dense
          flat
          round
          :icon="fabGithub"
          @click="openGitHub"
        >
          <q-tooltip>View on GitHub</q-tooltip>
        </q-btn>
        <q-btn
          class="header-btn q-ml-xs"
          v-if="!props.noEdit"
          dense
          flat
          round
          :icon="fabCodepen"
          @click="openCodepen"
          :loading="source.isLoading"
        >
          <q-tooltip>Edit in Codepen</q-tooltip>
        </q-btn>
        <q-btn
          class="header-btn q-ml-xs"
          dense
          flat
          round
          icon="code"
          @click="toggleExpand"
          :loading="source.isLoading"
        >
          <q-tooltip>View Source</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-slide-transition>
      <div v-if="expanded">
        <q-tabs
          class="header-tabs"
          v-model="currentTab"
          align="left"
          no-caps
          active-color="brand-primary"
          indicator-color="brand-primary"
          dense
          :breakpoint="0"
        >
          <q-tab
            v-for="tab in source.tabs"
            :key="`tab-${tab.name}`"
            :name="tab.name"
            class="header-btn"
          >
            {{ tab.name }}
          </q-tab>
        </q-tabs>

        <q-separator />

        <q-tab-panels
          class="text-grey-3 text-weight-regular"
          v-model="currentTab"
          animated
          keep-alive
        >
          <q-tab-panel
            class="q-pa-none"
            v-for="tab in source.tabs"
            :key="`pane-${tab.name}`"
            :name="tab.name"
          >
            <DocCode :lang="tab.lang" :code="tab.content" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-slide-transition>

    <DocCodepen v-if="component" ref="codepenRef" :title="props.title" />

    <q-separator />

    <div class="row overflow-hidden">
      <component
        v-if="component"
        class="col doc-example__content doc-example-typography"
        :is="component"
        :class="componentClass"
      />
      <q-linear-progress v-else color="brand-primary" indeterminate />
    </div>
  </q-card>
</template>

<script setup>
import { computed, inject, markRaw, onMounted, ref, useTemplateRef } from 'vue'
import { openURL } from 'quasar'

import { fabCodepen, fabGithub } from '@quasar/extras/fontawesome-v7'
import { mdiCompare } from '@quasar/extras/mdi-v7'

import { useDocStore } from '@/layouts/doc-layout/store/index.js'

import DocCode from './DocCode.vue'
import DocCodepen from './DocCodepen.vue'
import DocCardTitle from './DocCardTitle.vue'

const props = defineProps({
  title: String,
  file: String,
  noEdit: Boolean,
  scrollable: Boolean,
  overflow: Boolean
})

const docStore = useDocStore()
const examples = inject('_q_ex')

const codepenRef = useTemplateRef('codepenRef')
const component = ref(null)
const currentTab = ref('Template')
const expanded = ref(false)
const source = ref({
  hasLoaded: false,
  isLoading: false,
  tabs: [],
  parts: {}
})

const componentClass = computed(() =>
  props.scrollable
    ? 'doc-example__content--scrollable scroll-y'
    : props.overflow
      ? 'overflow-auto'
      : ''
)

const templateRE = /<template(.*)?>\n([\w\W]*)\n<\/template>/g
const scriptRE = /<script(.*)?>\n([\w\W]*)\n<\/script>/g
const styleRE = /<style(.*)?>\n([\w\W]*)\n<\/style>/g

function parseTemplate(regex, code) {
  const match = regex.exec(code)
  return match
    ? {
        attrs: match[1],
        content: match[2]
      }
    : null
}

function parseComponent(code) {
  const tabs = []

  const template = parseTemplate(templateRE, code)
  if (template) {
    const content = template.content
      .split('\n')
      .map(line => line.slice(2))
      .join('\n')

    tabs.push({
      codepen: 'html',
      name: 'Template',
      content,
      lang: 'html'
    })
  }

  const script = parseTemplate(scriptRE, code)
  if (script) {
    tabs.push({
      codepen: 'js',
      name: 'Script setup',
      content: script.content,
      lang: 'js'
    })
  }

  const style = parseTemplate(styleRE, code)
  if (style) {
    const lang = style.attrs.includes('lang="sass"')
      ? 'Sass'
      : style.attrs.includes('lang="scss"')
        ? 'SCSS'
        : 'CSS'

    tabs.push({
      codepen: 'style',
      name: lang,
      content: style.content,
      lang: lang.toLowerCase()
    })
  }

  if (tabs.length > 1) {
    tabs.push({
      name: 'All (SFC)',
      content: code,
      lang: 'html'
    })
  }

  source.value = {
    hasLoaded: true,
    isLoading: false,
    tabs
  }
}

function openGitHub() {
  openURL(
    `https://github.com/quasarframework/quasar/tree/${import.meta.env.DOCS_BRANCH}/docs/src/examples/${examples.name}/${props.file}.vue`
  )
}

function loadSource() {
  source.value.isLoading = true

  if (import.meta.env.QUASAR_DEV) {
    const glob = import.meta.glob('../examples/*/*.vue', {
      query: '?raw',
      import: 'default'
    })

    return glob[`../examples/${examples.name}/${props.file}.vue`]().then(
      parseComponent
    )
  }

  return examples.source().then(glob => parseComponent(glob[props.file]))
}

async function openCodepen() {
  if (!source.value.hasLoaded) await loadSource()
  codepenRef.value.open(source.value.tabs)
}

async function toggleExpand() {
  if (!source.value.hasLoaded) await loadSource()
  expanded.value = !expanded.value
}

if (import.meta.env.QUASAR_CLIENT) {
  onMounted(() => {
    if (import.meta.env.QUASAR_DEV) {
      const glob = import.meta.glob('../examples/*/*.vue', {
        import: 'default'
      })

      glob[`../examples/${examples.name}/${props.file}.vue`]().then(comp => {
        component.value = markRaw(comp)
      })
    } else {
      examples.runtime.then(glob => {
        component.value = markRaw(glob[props.file])
      })
    }
  })
}
</script>

<style lang="sass">
.doc-example

  &__actions
    padding: 3px 0 3px 7px

  &__content
    position: relative

    // reset doc style
    font-weight: 400
    font-family: $font-family-examples

    &--scrollable
      height: 500px
</style>
