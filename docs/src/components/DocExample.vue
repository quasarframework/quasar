<template>
  <q-card class="doc-example q-my-lg" :class="classes" flat bordered>
    <q-toolbar class="doc-example__toolbar">
      <card-title :title="props.title" :slugifiedTitle="slugifiedTitle" />
      <q-space />
      <div class="col-auto row no-wrap items-center">
        <q-btn class="doc-example__btn" dense flat round :icon="mdiCompare" @click="docStore.toggleDark">
          <q-tooltip>Toggle dark mode</q-tooltip>
        </q-btn>

        <q-separator class="doc-example__separator q-mx-sm" vertical />

        <q-btn class="doc-example__btn" dense flat round :icon="fabGithub" @click="openGitHub">
          <q-tooltip>View on GitHub</q-tooltip>
        </q-btn>
        <q-btn class="doc-example__btn" v-if="props.noEdit === false" dense flat round :icon="fabCodepen" @click="openCodepen" :disable="isBusy">
          <q-tooltip>Edit in Codepen</q-tooltip>
        </q-btn>
        <q-btn class="doc-example__btn" dense flat round icon="code" @click="toggleExpand" :disable="isBusy">
          <q-tooltip>View Source</q-tooltip>
        </q-btn>
      </div>
    </q-toolbar>

    <q-separator class="doc-example__separator" />

    <q-slide-transition>
      <div v-show="expanded">
        <q-tabs class="doc-example__tabs" v-model="currentTab" align="left" no-caps active-color="brand-primary" indicator-color="brand-primary" dense :breakpoint="0">
          <q-tab v-for="tab in def.tabs" :key="`tab-${tab}`" :name="tab" :label="tab" />
        </q-tabs>

        <q-separator />

        <q-tab-panels class="text-grey-3 text-weight-regular" v-model="currentTab" animated>
          <q-tab-panel class="q-pa-none" v-for="tab in def.tabs" :key="`pane-${tab}`" :name="tab">
            <doc-code lang="markup" :code="def.parts[tab]" max-height="70vh" />
          </q-tab-panel>
        </q-tab-panels>

        <q-separator class="doc-example__separator" />
      </div>
    </q-slide-transition>

    <doc-codepen v-if="!isBusy" ref="codepenRef" :title="props.title" :slugifiedTitle="slugifiedTitle" />

    <div class="row overflow-hidden">
      <q-linear-progress v-if="isBusy" color="brand-primary" indeterminate />
      <component class="col doc-example__content" v-else :is="component" :class="componentClass" />
    </div>
  </q-card>
</template>

<script setup>
import { markRaw, onMounted } from 'vue'
import { openURL } from 'quasar'
import { ref, reactive, computed, inject } from 'vue'

import { fabGithub, fabCodepen } from '@quasar/extras/fontawesome-v6'
import { mdiCompare } from '@quasar/extras/mdi-v7'

import { slugify } from 'assets/page-utils'
import { useDocStore } from 'src/layouts/doc-layout/store'

import DocCode from './DocCode.vue'
import DocCodepen from './DocCodepen.vue'
import CardTitle from './CardTitle.vue'

const props = defineProps({
  title: String,
  file: String,
  noEdit: Boolean,
  scrollable: Boolean,
  overflow: Boolean,
  dark: Boolean
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

const classes = computed(() => (props.dark === true ? 'doc-example--dark' : ''))
const componentClass = computed(() => {
  return props.scrollable === true
    ? 'doc-example__content--scrollable scroll-y'
    : (props.overflow === true ? 'overflow-auto' : '')
})

const slugifiedTitle = computed(() => {
  return 'example--' + slugify(props.title)
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
  openURL(`https://github.com/quasarframework/quasar/tree/dev/docs/public/examples/${ examples.name }/${ props.file }.vue`)
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
        ? list.code[ `./public/examples/${ examples.name }/${ props.file }.vue` ].default
        : list[ props.file ]
    )

    parseComponent(
      process.env.DEV
        ? list.source[ `./public/examples/${ examples.name }/${ props.file }.vue` ]
        : list[ `Raw${ props.file }` ]
    )

    isBusy.value = false
  })
})
</script>

<style lang="sass">
.doc-example
  &__toolbar
    color: $grey-8
  &__btn
    margin-left: 4px
    color: $grey-7
    &:hover
      color: $grey-9
  &__tabs
    background: $grey-3
    color: $grey-7
  &__content
    position: relative
    font-family: $font-family-examples

    &--scrollable
      height: 500px

body.body--dark .doc-example,
.doc-example--dark
  .doc-example__toolbar
    background: $grey-10
    color: #fff
  .doc-example__btn
    color: $grey-8
    &:hover
      color: $grey-3
  .doc-example__separator
    background-color: $grey-8
  .doc-example__tabs
    background: $grey-9
    color: $dark-text
</style>
