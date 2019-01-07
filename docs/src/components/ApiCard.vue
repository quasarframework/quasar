<template lang="pug">
q-card.q-my-xl(v-if="ready")
  q-toolbar.text-grey-7.bg-white
    .text-subtitle1 {{ name }} API
    q-space
    .text-subtitle2 {{ type }}

  q-separator

  div.bg-grey-2.text-grey-7.flex.items-center.no-wrap
    q-tabs(v-model="currentTab", align="left", dense)
      q-tab(
        v-for="tab in tabs"
        :key="`api-tab-${tab}`"
        :name="tab"
        :label="tab"
      )

  q-separator

  ApiRows(:which="currentTab", :api="api", :api-type="apiType")
</template>

<script>
import ApiRows from './ApiRows.js'

export default {
  name: 'ApiCard',

  components: {
    ApiRows
  },

  props: {
    file: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      ready: false,
      currentTab: null,
      filter: ''
    }
  },

  methods: {
    parseJson (name, { type, ...api }) {
      this.api = api
      this.apiType = type

      this.name = name
      this.type = `${type === 'plugin' ? 'Quasar' : 'Vue'} ${type.charAt(0).toUpperCase()}${type.substring(1)}`
      this.tabs = Object.keys(api)
      this.currentTab = this.tabs[0]
    }
  },

  mounted () {
    import(
      /* webpackChunkName: "quasar-api" */
      /* webpackMode: "lazy-once" */
      `quasar/dist/api/${this.file}.json`
    ).then(json => {
      this.parseJson(this.file, json.default)
      this.ready = true
    })
  }
}
</script>
