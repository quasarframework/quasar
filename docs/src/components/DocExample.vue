<template lang="pug">
q-card.doc-example.q-my-lg
  q-toolbar.text-grey-8.bg-white
    card-title(:title="title", prefix="Example--")

    q-btn(dense, flat, round, icon="fab fa-github", color="grey-7", @click="openGithub")
      q-tooltip View on Github
    q-btn.q-ml-sm(dense, flat, round, icon="fab fa-codepen", color="grey-7", @click="$refs.codepen.open()")
      q-tooltip Edit in Codepen
    q-btn.q-ml-sm(dense, flat, round, icon="code", @click="expanded = !expanded", color="grey-7")
      q-tooltip View Source

  q-separator

  q-slide-transition
    div(v-show="expanded")
      q-tabs.text-grey-7.bg-grey-3(v-model="currentTab", align="left", dense, :breakpoint="0")
        q-tab(
          v-for="tab in tabs"
          :key="`tab-${tab}`"
          :name="tab"
          :label="tab"
        )

      q-tab-panels.text-grey-3.text-weight-regular(v-model="currentTab", animated, style="background-color: #272822")
        q-tab-panel.q-pa-none(
          v-for="tab in tabs"
          :key="`pane-${tab}`"
          :name="tab"
        )
          doc-code(lang="markup", copy) {{ parts[tab] }}

  component(:is="component")

  codepen(ref="codepen", :title="title", :parts="parts")
</template>

<script>
import { openURL } from 'quasar'

import DocCode from './DocCode.vue'
import Codepen from './Codepen.vue'
import CardTitle from './CardTitle.vue'

export default {
  name: 'DocExample',

  components: {
    DocCode,
    Codepen,
    CardTitle
  },

  props: {
    title: String,
    file: String
  },

  data () {
    return {
      component: null,
      tabs: [],
      currentTab: 'template',
      expanded: false,
      parts: {}
    }
  },

  mounted () {
    import(
      /* webpackChunkName: "demo" */
      /* webpackMode: "lazy-once" */
      `examples/${this.file}.vue`
    ).then(comp => {
      this.component = comp.default
    })

    import(
      /* webpackChunkName: "demo-source" */
      /* webpackMode: "lazy-once" */
      `!raw-loader!examples/${this.file}.vue`
    ).then(comp => {
      this.parseComponent(comp.default)
    })
  },

  methods: {
    parseComponent (comp) {
      const
        template = this.parseTemplate('template', comp),
        script = this.parseTemplate('script', comp),
        style = this.parseTemplate('style', comp)

      this.parts = {
        template,
        script,
        style
      }
      this.tabs = ['template', 'script', 'style'].filter(type => this.parts[type])
    },

    parseTemplate (target, template) {
      const
        string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
        regex = new RegExp(string, 'g'),
        parsed = regex.exec(template) || []

      return parsed[1] || ''
    },

    openGithub () {
      openURL(`https://github.com/quasarframework/quasar/tree/dev/docs/src/examples/${this.file}.vue`)
    }
  }
}
</script>

<style lang="stylus">
.code-example .code-markup
  pre
    border-radius 0
</style>
