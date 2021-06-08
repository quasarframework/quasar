<template lang="pug">
div
  q-select(
    v-model="item"
    outlined
    use-input
    hide-selected
    fill-input
    placeholder="Names of Quasar components, directives or plugins"
    input-debounce="0"
    :options="options"
    clearable
    options-dense
    virtual-scroll-slice-size="50"
    @filter="filterFn"
  )
    template(v-slot:prepend)
      q-icon(name="travel_explore")

  doc-api(
    v-if="item"
    ref="apiRef"
    :key="item"
    :file="item"
    page-link
  )
</template>

<script>
import apiList from 'quasar/dist/api-list.json'

import DocApi from 'components/DocApi'

export default {
  name: 'DocApiExplorer',

  components: {
    DocApi
  },

  data () {
    return {
      item: '',
      options: [ ...apiList ]
    }
  },

  methods: {
    filterFn (val, update) {
      update(() => {
        const needle = val.toLowerCase()
        this.options = apiList.filter(v => v.toLowerCase().indexOf(needle) !== -1)
      })
    }
  }
}
</script>
