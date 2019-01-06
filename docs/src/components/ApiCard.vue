<template lang="pug">
q-card.q-my-xl(v-if="ready")
  q-toolbar.text-grey-7.bg-white
    .text-subtitle1 {{ name }}
    q-space
    .text-subtitle2 {{ type }}

  q-separator

  div.bg-grey-2.text-grey-7.flex.items-center.no-wrap
    q-tabs(v-model="currentTab", align="left", :breakpoint="0")
      q-tab(
        v-for="tab in tabs"
        :key="`api-tab-${tab}`"
        :name="tab"
        :label="tab"
      )

    q-space

    .q-pr-sm
      q-input(v-model="filter", dense, borderless, :debounce="300")
        q-icon(slot="append", name="search", color="primary")

  q-separator
</template>

<script>
export default {
  name: 'ApiCard',

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
    parseJson ({ name, type, ...api }) {
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
      this.parseJson(json.default)
      this.ready = true
    })
  }
}
</script>
