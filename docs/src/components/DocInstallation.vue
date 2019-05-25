<template lang="pug">
q-card.doc-installation.q-my-lg(flat, bordered)
  q-tabs.text-grey-7.bg-white(v-model="currentTab", align="left", indicator-color="primary", dense, :breakpoint="0")
    q-tab(
      v-for="tab in ['Quasar CLI', 'UMD', 'Vue CLI']"
      :key="`installation-${tab}`"
      :name="tab"
      :label="tab"
    )

  q-separator

  q-tab-panels.bg-code(v-model="currentTab", animated)
    q-tab-panel.q-pa-none(name="Quasar CLI")
      doc-code {{ QuasarCli }}

    q-tab-panel.q-pa-none(name="UMD")
      doc-code {{ UMD }}

    q-tab-panel.q-pa-none(name="Vue CLI")
      doc-code {{ VueCli }}
</template>

<script>
import DocCode from './DocCode.vue'

export default {
  name: 'DocInstallation',

  components: {
    DocCode
  },

  props: {
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
        if (this[type] !== void 0) {
          parts.push(`${type}: [
      ${this.nameAsString(this[type], 6)}
    ]`)
        }
      })

      if (this.config !== void 0) {
        parts.push(`config: {
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
      const config = this.config !== void 0
        ? `

// Optional;
// Place the global quasarConfig Object in a script tag BEFORE your Quasar script tag
window.quasarConfig = {
  ${this.computedConfig.join('\n' + ''.padStart(6, ' '))}
}`
        : ''

      const content = `/*
 * No installation step is necessary.
 * It gets installed by default.
 */`

      return content + config
    },

    VueCli () {
      const types = [], imports = []

      ;['components', 'directives', 'plugins'].forEach(type => {
        if (this[type] !== void 0) {
          imports.push(this.nameAsString(this[type], 2, false))
          types.push(`${type}: {
    ${this.nameAsString(this[type], 4, false)}
  }`)
        }
      })

      if (this.config !== void 0) {
        types.push(`config: {
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

Vue.use(Quasar, {
  ${types.join(',\n  ')}
})`
    }
  }
}
</script>
