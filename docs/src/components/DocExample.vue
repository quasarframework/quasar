<template>
  <q-card class="doc-example q-my-lg" flat bordered>
    <div class="header-toolbar row items-center q-pr-sm">
      <doc-card-title :title="props.title" prefix="example--" />

      <q-space />

      <div class="doc-example__actions row no-wrap items-center">
        <q-btn class="header-btn" dense flat round :icon="mdiCompare" @click="docStore.toggleDark">
          <q-tooltip>Toggle dark mode</q-tooltip>
        </q-btn>

        <q-separator class="q-mx-xs" vertical inset />

        <q-btn class="header-btn" dense flat round :icon="fabGithub" @click="openGitHub">
          <q-tooltip>View on GitHub</q-tooltip>
        </q-btn>
        <q-btn class="header-btn q-ml-xs" v-if="props.noEdit === false" dense flat round :icon="fabCodepen" @click="openCodepen" :disable="isBusy">
          <q-tooltip>Edit in Codepen</q-tooltip>
        </q-btn>
        <q-btn class="header-btn q-ml-xs" dense flat round icon="code" @click="toggleExpand" :disable="isBusy">
          <q-tooltip>View Source</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-slide-transition>
      <div v-show="expanded">
        <q-tabs class="header-tabs" v-model="currentTab" align="left" no-caps active-color="brand-primary" indicator-color="brand-primary" dense :breakpoint="0">
          <q-tab v-for="tab in def.tabs" :key="`tab-${tab}`" :name="tab" class="header-btn">
            {{ tab }}
          </q-tab>
        </q-tabs>

        <q-separator />

        <q-tab-panels class="text-grey-3 text-weight-regular" v-model="currentTab" animated>
          <q-tab-panel class="q-pa-none" v-for="tab in def.tabs" :key="`pane-${tab}`" :name="tab">
            <doc-code lang="markup" :code="def.parts[tab]" max-height="70vh" />
          </q-tab-panel>
        </q-tab-panels>

      </div>
    </q-slide-transition>

    <doc-codepen v-if="!isBusy" ref="codepenRef" :title="props.title" />

    <q-separator />

    <div class="row overflow-hidden">
      <q-linear-progress v-if="isBusy" color="brand-primary" indeterminate />
      <component class="col doc-example__content doc-example-typography" v-else :is="component" :class="componentClass" />
    </div>
  </q-card>
</template>

<script setup>
import { markRaw, onMounted } from 'vue'
import { openURL } from 'quasar'
import { ref, reactive, computed, inject } from 'vue'

import { fabGithub, fabCodepen } from '@quasar/extras/fontawesome-v6'
import { mdiCompare } from '@quasar/extras/mdi-v7'

import { useDocStore } from 'src/layouts/doc-layout/store'

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

const codepenRef = ref(null)
const isBusy = ref(true)

const component = ref(null)
const def = reactive({
  tabs: [],
  parts: {}
})
const currentTab = ref('Template')
const expanded = ref(false)

const componentClass = computed(() => {
  return props.scrollable === true
    ? 'doc-example__content--scrollable scroll-y'
    : (props.overflow === true ? 'overflow-auto' : '')
})

function parseTemplate (target, template) {
  const
    string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
    regex = new RegExp(string, 'g'),
    parsed = regex.exec(template) || []

  return parsed[ 1 ] || ''
}

function parseComponent (comp) {
  def.parts = {
    Template: parseTemplate('template', comp),
    Script: parseTemplate('script', comp),
    Style: parseTemplate('style', comp)
  }

  const tabs = [ 'Template', 'Script', 'Style' ]
    .filter(type => def.parts[ type ])

  if (tabs.length > 1) {
    def.parts.All = comp
    tabs.push('All')
  }

  def.tabs = tabs
}

function openGitHub () {
  openURL(`https://github.com/quasarframework/quasar/tree/${ process.env.DOCS_BRANCH }/docs/src/examples/${ examples.name }/${ props.file }.vue`)
}

function openCodepen () {
  codepenRef.value.open(def.parts)
}

function toggleExpand () {
  expanded.value = expanded.value === false
}

process.env.CLIENT && onMounted(() => {
  examples.list.then(list => {
    component.value = markRaw(
      process.env.DEV
        ? list.code[ `./src/examples/${ examples.name }/${ props.file }.vue` ].default
        : list[ props.file ]
    )

    parseComponent(
      process.env.DEV
        ? list.source[ `./src/examples/${ examples.name }/${ props.file }.vue` ]
        : list[ `Raw${ props.file }` ]
    )

    isBusy.value = false
  })
})
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
