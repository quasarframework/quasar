<template lang="pug">
q-card.doc-installation.q-my-lg(flat, bordered)
  q-tabs.text-grey-7.bg-white(v-model="currentTab", align="left", indicator-color="brand-primary", dense, :breakpoint="0")
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
    components: [ Array, String ],
    directives: [ Array, String ],
    plugins: [ Array, String ],
    config: String
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
    quasarConf () {
      return this.config !== void 0
        ? `${this.config}: { /* look at QUASARCONFOPTIONS from the API card (bottom of page) */ }`
        : void 0
    },

    QuasarCli () {
      if (this.plugins === void 0 && this.quasarConf === void 0) {
        return `/*
 * No installation step is necessary.
 * It gets installed by default by @quasar/app v2+.
 */`
      }

      const parts = []

      if (this.plugins !== void 0) {
        parts.push(`plugins: [
      ${this.nameAsString(this.plugins, 6)}
    ]`)
      }

      if (this.quasarConf !== void 0) {
        parts.push(`config: {
      ${this.quasarConf}
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
      const config = this.quasarConf !== void 0
        ? `

// Optional;
// Place the global quasarConfig Object in a script tag BEFORE your Quasar script tag
window.quasarConfig = {
  ${this.quasarConf}
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

      ;[ 'components', 'directives', 'plugins' ].forEach(type => {
        if (this[type] !== void 0) {
          imports.push(this.nameAsString(this[type], 2, false))
          types.push(`${type}: {
    ${this.nameAsString(this[type], 4, false)}
  }`)
        }
      })

      if (this.quasarConf !== void 0) {
        types.push(`config: {
    ${this.quasarConf}
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
