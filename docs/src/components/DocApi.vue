<template lang="pug">
q-card.doc-api.q-my-lg(flat bordered)
  q-toolbar.text-grey-8
    card-title(:title="nameBanner" prefix="api--")
    q-space

    .col-auto(v-if="pageLink")
      q-btn(icon="launch" label="Docs" color="brand-primary" no-caps unelevated :to="docPath")
    .col-auto.text-grey(v-else) {{ typeBanner }}

  q-linear-progress(v-if="loading", color="brand-primary", indeterminate)

  template(v-else-if="nothingToShow")
    q-separator
    .doc-api__nothing-to-show Nothing to display

  template(v-else)
    q-separator

    div.bg-grey-2.text-grey-7.flex.no-wrap
      q-tabs.col(v-model="currentTab", active-color="brand-primary", indicator-color="brand-primary", align="left", :breakpoint="0", dense)
        q-tab(
          v-for="tab in tabsList"
          :key="`api-tab-${tab}`"
          :name="tab"
        )
          .row.no-wrap.items-center
            span.q-mr-xs.text-capitalize.text-weight-medium {{ tab }}
            q-badge(v-if="filteredApiCount[tab].overall" :label="filteredApiCount[tab].overall")

      q-input.q-mx-sm(
        v-if="$q.screen.gt.xs"
        ref="inputRef",
        v-model="filter",
        dense,
        input-class="text-right",
        borderless,
        placeholder="Filter..."
        style="min-width: 150px"
      )
        template(v-slot:append)
          q-icon.cursor-pointer(
            :name="inputIcon"
            @click="onFilterClick"
          )

    q-separator

    q-tab-panels(v-model="currentTab", animated)
      q-tab-panel.q-pa-none(v-for="tab in tabsList", :name="tab", :key="tab")
        .row.no-wrap.api-container(v-if="innerTabsList[tab].length !== 1")
          .col-auto.row.no-wrap.text-grey-7.q-py-sm
            q-tabs(
              v-model="currentInnerTab",
              active-color="brand-primary",
              indicator-color="brand-primary",
              :breakpoint="0",
              vertical,
              dense,
              shrink
            )
              q-tab(
                v-for="innerTab in innerTabsList[tab]"
                :key="`api-inner-tab-${innerTab}`"
                class="inner-tab"
                :name="innerTab"
              )
                .row.no-wrap.items-center.self-stretch
                  span.q-mr-xs.text-capitalize.text-weight-medium {{ innerTab }}
                  .col
                  q-badge(v-if="filteredApiCount[tab].category[innerTab]" :label="filteredApiCount[tab].category[innerTab]")

          q-separator(vertical)

          q-tab-panels.col(
            v-model="currentInnerTab"
            animated
            transition-prev="slide-down"
            transition-next="slide-up"
          )
            q-tab-panel.q-pa-none(v-for="innerTab in innerTabsList[tab]" :name="innerTab" :key="innerTab")
              DocApiEntry(:type="tab" :definition="filteredApi[tab][innerTab]")

        .api-container(v-else)
          DocApiEntry(:type="tab" :definition="filteredApi[tab][defaultInnerTabName]")
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { mdiClose, mdiMagnify } from '@quasar/extras/mdi-v5'

import CardTitle from './CardTitle.vue'
import DocApiEntry from './DocApiEntry.js'

const defaultInnerTabName = '__default'

function getPropsCategories (props) {
  const acc = new Set()

  for (const key in props) {
    if (props[ key ] !== void 0) {
      const value = props[ key ]

      value.category.split('|').forEach(groupKey => {
        acc.add(groupKey)
      })
    }
  }

  return acc.size === 1
    ? [defaultInnerTabName]
    : Array.from(acc).sort()
}

function getInnerTabs (api, tabs, apiType) {
  const acc = {}

  tabs.forEach(tab => {
    acc[ tab ] = apiType === 'component' && tab === 'props'
      ? getPropsCategories(api[ tab ])
      : [defaultInnerTabName]
  })

  return acc
}

function parseApi (api, tabs, innerTabs) {
  const acc = {}

  tabs.forEach(tab => {
    const apiValue = api[ tab ]

    if (innerTabs[ tab ].length > 1) {
      const inner = {}

      innerTabs[ tab ].forEach(subTab => {
        inner[ subTab ] = {}
      })

      for (const key in apiValue) {
        if (apiValue[ key ] !== void 0) {
          const value = apiValue[ key ]

          value.category.split('|').forEach(groupKey => {
            inner[ groupKey ][ key ] = value
          })
        }
      }

      acc[ tab ] = inner
    }
    else {
      acc[ tab ] = {}
      acc[ tab ][ defaultInnerTabName ] = apiValue
    }
  })

  return acc
}

function passesFilter (filter, name, desc) {
  return (name.toLowerCase().indexOf(filter) > -1) ||
    (desc !== void 0 && desc.toLowerCase().indexOf(filter) > -1)
}

function getFilteredApi (parsedApi, filter, tabs, innerTabs) {
  if (filter === '') {
    return parsedApi
  }

  const acc = {}

  tabs.forEach(tab => {
    const tabApi = parsedApi[ tab ]
    const tabCategories = innerTabs[ tab ]

    acc[ tab ] = {}
    tabCategories.forEach(categ => {
      const subTabs = {}
      const categoryEntries = tabApi[ categ ]

      for (const name in categoryEntries) {
        const entry = categoryEntries[ name ]
        if (passesFilter(filter, name, entry.desc) === true) {
          subTabs[ name ] = entry
        }
      }

      acc[ tab ][ categ ] = subTabs
    })
  })

  return acc
}

function getApiCount (parsedApi, tabs, innerTabs) {
  const acc = {}

  tabs.forEach(tab => {
    const tabApi = parsedApi[ tab ]
    const tabCategories = innerTabs[ tab ]

    if ([ 'value', 'arg', 'quasarConfOptions', 'injection' ].includes(tab)) {
      acc[ tab ] = {
        overall: Object.keys(tabApi[ tabCategories[ 0 ] ]).length === 0
          ? 0
          : 1
      }
      return
    }

    acc[ tab ] = { overall: 0 }

    if (tabCategories.length === 1) {
      const categ = tabCategories[ 0 ]
      const count = Object.keys(tabApi[ categ ]).length

      acc[ tab ] = {
        overall: count,
        category: { [ categ ]: count }
      }
    }
    else {
      acc[ tab ].category = {}

      tabCategories.forEach(categ => {
        const count = Object.keys(tabApi[ categ ]).length
        acc[ tab ].category[ categ ] = count
        acc[ tab ].overall += count
      })
    }
  })

  return acc
}

export default {
  name: 'DocApi',

  components: {
    CardTitle,
    DocApiEntry
  },

  props: {
    file: {
      type: String,
      required: true
    },

    pageLink: Boolean
  },

  setup (props) {
    const inputRef = ref(null)

    const loading = ref(true)
    const nameBanner = ref('Loading API...')
    const typeBanner = ref('Please wait...')
    const nothingToShow = ref(false)

    const docPath = ref('')

    const filter = ref('')
    const apiDef = ref({})

    const tabsList = ref([])
    const innerTabsList = ref({})

    const currentTab = ref(null)
    const currentInnerTab = ref(null)

    watch(currentTab, val => {
      currentInnerTab.value = innerTabsList.value[ val ][ 0 ]
    })

    const inputIcon = computed(() => filter.value !== '' ? mdiClose : mdiMagnify)
    const filteredApi = computed(() => getFilteredApi(apiDef.value, filter.value.toLowerCase(), tabsList.value, innerTabsList.value))
    const filteredApiCount = computed(() => getApiCount(filteredApi.value, tabsList.value, innerTabsList.value))

    function parseApiFile (name, { type, behavior, meta, addedIn, ...api }) {
      nameBanner.value = name
      typeBanner.value = `${type === 'plugin' ? 'Quasar' : 'Vue'} ${type.charAt(0).toUpperCase()}${type.substring(1)}`
      docPath.value = meta.docsUrl.replace(/^https:\/\/v[\d]+\.quasar\.dev/, '')

      const tabs = Object.keys(api)

      if (tabs.length === 0) {
        nothingToShow.value = true
        return
      }

      tabsList.value = tabs
      currentTab.value = tabs[ 0 ]

      const subTabs = getInnerTabs(api, tabs, type)
      innerTabsList.value = subTabs
      apiDef.value = parseApi(api, tabs, subTabs)
    }

    function onFilterClick () {
      if (filter.value !== '') {
        filter.value = ''
      }

      inputRef.value.focus()
    }

    onMounted(() => {
      import(
        /* webpackChunkName: "quasar-api" */
        /* webpackMode: "lazy-once" */
        'quasar/dist/api/' + props.file + '.json'
      ).then(json => {
        parseApiFile(props.file, json.default)
        loading.value = false
      })
    })

    return {
      loading,
      nameBanner,
      typeBanner,
      nothingToShow,
      docPath,

      filteredApi,
      filteredApiCount,

      tabsList,
      innerTabsList,
      defaultInnerTabName,

      currentTab,
      currentInnerTab,

      inputRef,
      filter,
      inputIcon,
      onFilterClick
    }
  }
}
</script>

<style lang="sass">
.doc-api
  .q-tab
    height: 40px

  .inner-tab
    justify-content: left
    .q-tab__content
      width: 100%

  .api-container
    max-height: 600px

  &__nothing-to-show
    padding: 16px
    color: $grey
    font-size: .8em
    font-style: italic
</style>
