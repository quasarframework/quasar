<template lang="pug">
.component-api.shadow-2.q-my-xl
  div.bg-grey-2.text-grey-7.flex.items-center.no-wrap
    q-tabs(v-model="currentTab")
      q-tab(
        v-for="tab in tabs"
        :key="`api-tab-${tab}`"
        :name="tab"
        :label="tab"
      )

    q-space

    .q-pr-sm
      q-input(v-model="filter", dense, borderless, :debounce="300")
        q-icon(slot="prepend", name="search", color="primary")

  q-separator

  q-table.component-api(
    grid
    :data="api[currentTab]"
    :columns="[]"
    :filter="filter"
    hide-header
    hide-bottom
    row-key="name"
    class="shadow-0"
  )
    .col-12(slot="item", slot-scope="props")
      .row.component-api-item
        .col-3
          .component-api-col Name
          .text-bold {{ props.row.name }}
        .col-3(v-if="props.row.default")
          .component-api-col Default
          div {{ props.row.default }}
        .col-3(v-if="props.row.type")
          .component-api-col Type
          .text-bold {{ props.row.type }}
        .col-3(v-if="props.row.example")
          .component-api-col Example
          .text-bold {{ props.row.example }}
        .component-api-desc.col-12.text-weight-light
          div {{ props.row.desc }}
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
      currentTab: 'props',
      filter: ''
    }
  },

  beforeMount () {
    this.currentTab = this.tabs[0]
  },

  computed: {
    tabs () {
      return Object.keys(this.api)
    }
  }
}
</script>

<style lang="stylus">
@import '~quasar-variables'

.component-api
  .q-hr
    margin 0
    bottom 1px

.component-api-item
  font-size 80%
  background linear-gradient(to bottom, white 40%, $grey-3 100%)

  > div
    padding 8px

.component-api-col
  font-size 80%
</style>
