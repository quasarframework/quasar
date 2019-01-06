<template lang="pug">
q-card.component-installation.shadow-2.q-my-xl
  q-toolbar.text-grey-7.bg-white
    .text-subtitle1 {{ title }}

  q-separator

  q-tabs.text-grey-7.bg-grey-3(v-model="currentTab", align="left", :breakpoint="0")
    q-tab(
      v-for="tab in ['Quasar CLI', 'UMD', 'Vue CLI']"
      :key="`installation-${tab}`"
      :name="tab"
      :label="tab"
    )

  q-tab-panels(v-model="currentTab", animated, style="background-color: #272822")
    q-tab-panel.q-pa-none(name="Quasar CLI")
      code-markup(copy) {{ QuasarCli }}

    q-tab-panel.q-pa-none(name="UMD")
      code-markup(copy) {{ UMD }}

    q-tab-panel.q-pa-none(name="Vue CLI")
      code-markup(copy) {{ VueCli }}
</template>

<script>
import CodeMarkup from './CodeMarkup.vue'

export default {
  name: 'InstallationCard',

  components: {
    CodeMarkup
  },

  props: {
    title: {
      type: String,
      default: 'Installation'
    },
    components: [Array, String],
    directives: [Array, String],
    plugins: [Array, String],
    config: Object // TODO
  },

  data () {
    return {
      currentTab: 'Quasar CLI'
    }
  },

  methods: {
    nameAsString (name, indent, quotes = true) {
      const wrapper = quotes
        ? str => `'${str}'`
        : str => str

      return Array.isArray(name)
        ? name.map(wrapper).join(',\n' + ''.padStart(indent, ' '))
        : wrapper(name)
    }
  },

  computed: {
    computedConfig () {
      return Object.keys(this.config)
        .map(name => `${name}: { /* ${this.config[name]} defaults */ }`)
    },

    QuasarCli () {
      const parts = []

      ;['components', 'directives', 'plugins'].forEach(type => {
        if (this[type]) {
          parts.push(`${type}: [
      ${this.nameAsString(this[type], 6)}
    ]`)
        }
      })

      if (this.config) {
        parts.push(`config: {
      // optional (v0.17+)
      ${this.computedConfig.join('\n' + ''.padStart(6, ' '))}
    }`)
      }

      return `// quasar.conf.js

return {
  framework: {
    ${parts.join(',\n    ')}
  }
}`
    },

    UMD () {
      return `/*
 * No installation step is necessary.
 * It gets installed by default.
 */`
    },

    VueCli () {
      const types = [], imports = [], parts = []

      ;['components', 'directives', 'plugins'].forEach(type => {
        if (this[type]) {
          types.push(type)
          imports.push(this.nameAsString(this[type], 2, false))
          parts.push(`const ${type} = {
  ${this.nameAsString(this[type], 2, false)}
}
`)
        }
      })

      if (this.config) {
        types.push(`config: {
    // optional (v0.17+)
    ${this.computedConfig.join('\n' + ''.padStart(4, ' '))}
  }`)
      }

      return `// main.js

// This is needed ONLY if NOT chosen to import everything from Quasar
// when you installed vue-cli-plugin-quasar.

import {
  Quasar,
  ${imports.join(',\n  ')}
} from 'quasar'

${parts.join('\n')}
Vue.use(Quasar, {
  ${types.join(',\n  ')}
})`
    }
  }
}
</script>

<style lang="stylus">
.component-installation
  .code-markup pre
    border-radius 0
</style>
