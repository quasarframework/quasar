<template lang="pug">
q-card.doc-example.q-my-lg(:class="classes", flat, bordered)
  q-toolbar.doc-example__toolbar
    card-title(:title="title" :slugifiedTitle="slugifiedTitle")

    q-space

    div.col-auto(v-if="!loading")
      q-btn(dense, flat, round, :icon="fabGithub", @click="openGitHub")
        q-tooltip View on GitHub
      q-btn.q-ml-sm(v-if="noEdit === false", dense, flat, round, :icon="fabCodepen", @click="openCodepen")
        q-tooltip Edit in Codepen
      q-btn.q-ml-sm(dense, flat, round, icon="code", @click="expanded = !expanded")
        q-tooltip View Source

  q-separator.doc-example__separator

  q-slide-transition
    div(v-show="expanded")
      q-tabs.doc-example__tabs(
        v-model="currentTab",
        align="left",
        :active-color="dark ? 'amber' : void 0",
        :indicator-color="dark ? 'amber' : 'brand-primary'",
        dense,
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
        v-model="currentTab",
        animated
      )
        q-tab-panel.q-pa-none(
          v-for="tab in def.tabs"
          :key="`pane-${tab}`"
          :name="tab"
        )
          doc-code(lang="markup", :code="def.parts[tab]")

      q-separator.doc-example__separator

  .row
    q-linear-progress(v-if="loading", color="brand-primary", indeterminate)
    component.col.doc-example__content(v-else, :is="component", :class="componentClass")

  doc-codepen(v-if="!loading", ref="codepen", :title="title", :slugifiedTitle="slugifiedTitle")
</template>

<script>
import { markRaw } from 'vue'
import { openURL } from 'quasar'
import { ref, reactive, computed, onMounted } from 'vue'

import {
  fabGithub, fabCodepen
} from '@quasar/extras/fontawesome-v5'

import { slugify } from 'assets/page-utils'

import DocCode from './DocCode.vue'
import DocCodepen from './DocCodepen.vue'
import CardTitle from './CardTitle.vue'

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
    const codepen = ref(null) // $refs.codepen

    const loading = ref(true)
    const component = ref(null)
    const def = reactive({
      tabs: [],
      parts: {}
    })
    const currentTab = ref('template')
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
      const
        template = parseTemplate('template', comp),
        script = parseTemplate('script', comp),
        style = parseTemplate('style', comp)

      def.parts = {
        template,
        script,
        style
      }

      def.tabs = [ 'template', 'script', 'style' ]
        .filter(type => def.parts[ type ])
    }

    onMounted(() => {
      Promise.all([
        import(
          /* webpackChunkName: "demo" */
          /* webpackMode: "lazy-once" */
          'examples/' + props.file + '.vue'
        ).then(comp => {
          component.value = markRaw(comp.default)
        }),

        import(
          /* webpackChunkName: "demo-source" */
          /* webpackMode: "lazy-once" */
          '!raw-loader!examples/' + props.file + '.vue'
        ).then(comp => {
          parseComponent(comp.default)
        })
      ]).then(() => {
        loading.value = false
      })
    })

    return {
      fabGithub,
      fabCodepen,

      codepen,

      loading,
      component,
      currentTab,
      expanded,
      def,

      classes,
      componentClass,
      slugifiedTitle,

      openGitHub () {
        openURL(`https://github.com/quasarframework/quasar/tree/dev/docs/src/examples/${props.file}.vue`)
      },

      openCodepen () {
        codepen.value.open(def.parts)
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
