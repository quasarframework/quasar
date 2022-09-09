<template lang="pug">
q-card.doc-example.q-my-lg(:class="classes", flat, bordered)
  q-toolbar.doc-example__toolbar
    card-title(:title="title" :slugifiedTitle="slugifiedTitle")

    q-space

    div.col-auto
      q-btn(dense flat round :icon="fabGithub" @click="openGitHub")
        q-tooltip View on GitHub
      q-btn.q-ml-sm(v-if="noEdit === false" dense flat round :icon="fabCodepen" @click="openCodepen" :disable="loadingSource")
        q-tooltip Edit in Codepen
      q-btn.q-ml-sm(dense flat round icon="code" @click="expanded = !expanded" :disable="loadingSource")
        q-tooltip View Source

  q-separator.doc-example__separator

  q-slide-transition
    div(v-show="expanded")
      q-tabs.doc-example__tabs(
        v-model="currentTab"
        align="left"
        no-caps
        :active-color="dark ? 'amber' : void 0"
        :indicator-color="dark ? 'amber' : 'brand-primary'"
        dense
        :breakpoint="0"
      )
        q-tab(
          v-for="tab in def.tabs"
          :key="`tab-${tab}`"
          :name="tab"
          :label="tab"
        )

      q-separator

      q-tab-panels.text-grey-3.text-weight-regular(
        v-model="currentTab"
        animated
      )
        q-tab-panel.q-pa-none(
          v-for="tab in def.tabs"
          :key="`pane-${tab}`"
          :name="tab"
        )
          doc-code(lang="markup" :code="def.parts[tab]" max-height="70vh")

      q-separator.doc-example__separator

  .row
    q-linear-progress(v-if="loadingComponent || loadingSource" color="brand-primary" indeterminate)
    component.col.doc-example__content(v-if="!loadingComponent" :is="component" :class="componentClass")

  doc-codepen(v-if="!loadingSource" ref="codepenRef" :title="title" :slugifiedTitle="slugifiedTitle")
</template>

<script>
import { markRaw, onMounted } from 'vue'
import { openURL } from 'quasar'
import { ref, reactive, computed } from 'vue'

import {
  fabGithub, fabCodepen
} from '@quasar/extras/fontawesome-v6'

import { slugify } from 'assets/page-utils'

import DocCode from './DocCode.vue'
import DocCodepen from './DocCodepen.vue'
import CardTitle from './CardTitle.vue'

const importExampleComponent = process.env.CLIENT
  ? import.meta.glob('/public/examples/**/*.vue')
  : null

export default {
  name: 'DocExample',

  components: {
    DocCode,
    DocCodepen,
    CardTitle
  },

  props: {
    title: String,
    file: String,
    noEdit: Boolean,
    dark: Boolean,
    scrollable: Boolean,
    overflow: Boolean
  },

  setup (props) {
    const codepenRef = ref(null)

    const loadingSource = ref(true)
    const loadingComponent = ref(true)

    const component = ref(null)
    const def = reactive({
      tabs: [],
      parts: {}
    })
    const currentTab = ref('Template')
    const expanded = ref(false)

    const classes = computed(() => {
      return props.dark === true
        ? 'doc-example--dark'
        : ''
    })

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

    process.env.CLIENT && onMounted(() => {
      importExampleComponent[ '/public/examples/' + props.file + '.vue' ]()
        .then(comp => {
          component.value = markRaw(comp.default)
          loadingComponent.value = false
        })

      fetch(`/examples/${ props.file }.vue`)
        .then(response => response.text())
        .then(content => {
          parseComponent(content)
          loadingSource.value = false
        })
    })

    return {
      fabGithub,
      fabCodepen,

      codepenRef,

      loadingSource,
      loadingComponent,
      component,
      currentTab,
      expanded,
      def,

      classes,
      componentClass,
      slugifiedTitle,

      openGitHub () {
        openURL(`https://github.com/quasarframework/quasar/tree/dev/docs/public/examples/${props.file}.vue`)
      },

      openCodepen () {
        codepenRef.value.open(def.parts)
      }
    }
  }
}
</script>

<style lang="sass">
.doc-example

  &__toolbar
    color: $grey-8
    > .q-btn
      color: $grey-7

  &__tabs
    background: $grey-3
    color: $grey-7

  &--dark
    .doc-example__toolbar
      background: $grey-10
      color: #fff
      > .q-btn
        color: $grey-3
    .doc-example__separator
      background-color: $grey-8
    .doc-example__tabs
      background: $grey-9
      color: $grey-5

  &__content
    position: relative

    &--scrollable
      height: 500px
</style>
