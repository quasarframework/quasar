<template>
  <q-card class="doc-api q-my-xl" flat bordered>
    <div class="row items-center q-pr-sm">
      <doc-card-title :title="nameBanner" />

      <q-btn class="q-mr-sm" v-if="props.pageLink" size="sm" padding="xs sm" color="brand-primary" no-caps unelevated :to="docPath">
        <q-icon name="launch" />
        <div class="q-ml-xs">Docs</div>
      </q-btn>

      <q-input class="col doc-api__search" ref="inputRef" v-model="filter" dense input-class="text-right" borderless placeholder="Filter...">
        <template #append>
          <q-icon class="cursor-pointer" :name="inputIcon" @click="onFilterClick" />
        </template>
      </q-input>
    </div>

    <q-linear-progress v-if="loading" color="brand-primary" indeterminate />
    <template v-else-if="nothingToShow">
      <q-separator />
      <div class="doc-api__nothing-to-show">Nothing to display</div>
    </template>
    <template v-else>
      <q-separator />

      <q-tabs class="doc-api__tabs-list" v-model="currentTab" active-color="brand-primary" indicator-color="brand-primary" align="left" :breakpoint="0" dense>
        <q-tab class="doc-api__tab" v-for="tab in tabsList" :key="`api-tab-${tab}`" :name="tab">
          <div class="row no-wrap items-center">
            <span class="q-mr-xs text-capitalize text-weight-medium">{{ tab }}</span>
            <q-badge v-if="filteredApiCount[tab].overall" :label="filteredApiCount[tab].overall" />
          </div>
        </q-tab>
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="currentTab" animated>
        <q-tab-panel class="q-pa-none" v-for="tab in tabsList" :name="tab" :key="tab">
          <div class="doc-api__container row no-wrap" v-if="innerTabsList[tab].length !== 1">
            <div class="col-auto row no-wrap text-grey-7 q-py-sm">
              <q-tabs v-model="currentInnerTab" active-color="brand-primary" indicator-color="brand-primary" :breakpoint="0" vertical dense shrink>
                <q-tab class="doc-api__tab doc-api__tab--inner doc-api__inner-tab" v-for="innerTab in innerTabsList[tab]" :key="`api-inner-tab-${innerTab}`" :name="innerTab">
                  <div class="row no-wrap items-center self-stretch">
                    <span class="q-mr-xs text-capitalize text-weight-medium">{{ innerTab }}</span>
                    <div class="col" />
                    <q-badge v-if="filteredApiCount[tab].category[innerTab]" :label="filteredApiCount[tab].category[innerTab]" />
                  </div>
                </q-tab>
              </q-tabs>
            </div>

            <q-separator vertical />

            <q-tab-panels class="col" v-model="currentInnerTab" animated transition-prev="slide-down" transition-next="slide-up">
              <q-tab-panel class="q-pa-none" v-for="innerTab in innerTabsList[tab]" :name="innerTab" :key="innerTab">
                <doc-api-entry :type="tab" :definition="filteredApi[tab][innerTab]" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <div class="doc-api__container" v-else>
            <doc-api-entry :type="tab" :definition="filteredApi[tab][defaultInnerTabName]" />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { mdiClose, mdiMagnify } from '@quasar/extras/mdi-v6'

import DocCardTitle from './DocCardTitle.vue'
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

const getJsonUrl = process.env.DEV === true
  ? file => `/node_modules/quasar/dist/api/${ file }.json`
  : file => `/quasar-api/${ file }.json`

const props = defineProps({
  file: {
    type: String,
    required: true
  },

  pageLink: Boolean
})

const inputRef = ref(null)

const loading = ref(true)
const nameBanner = ref(`Loading ${ props.file } API...`)
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
  nameBanner.value = `${ name } API`
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

process.env.CLIENT && onMounted(() => {
  fetch(getJsonUrl(props.file))
    .then(response => response.json())
    .then(json => {
      parseApiFile(props.file, json)
      loading.value = false
    })
})
</script>

<style lang="sass">
.doc-api
  &__tab
    height: 40px

    &--inner
      justify-content: left
      .q-tab__content
        width: 100%

  &__container
    max-height: 600px

  &__nothing-to-show
    padding: 16px
    color: $grey
    font-size: .8em
    font-style: italic

  &__search
    min-width: 10em !important

.doc-api-entry
  padding: 8px 16px 4px
  font-weight: 300
  color: $grey

  & + &
    border-top: 1px solid #ddd

  &__expand-btn
    margin-left: 4px
    color: $dark

  &__item
    min-height: 25px
    margin-bottom: 4px

  &__subitem
    padding: 4px 0 0 16px
    border-radius: 5px
    > div
      border: 1px solid rgba(0,0,0,.12) !important
      border-radius: inherit
    > div + div
      margin-top: 4px

  &__type
    font-family: $font-family-avenir

  &__value
    font-weight: 400
    color: #000

  &--indent
    padding-left: 16px

  .doc-token
    margin: 4px
    display: inline-block

  &__pill
    font-size: 1em
    line-height: 1.2em

body.body--light .doc-api
  &__tabs-list
    background: $grey-2
  &__tab
    color: $grey-7
  .doc-token
    background-color: #eee
    border: 1px solid #ddd
    color: $light-text

body.body--dark
  .doc-api
    &__tab
      color: $dark-text

  .doc-api-entry
    & + .doc-api-entry,
    &__subitem > div
      border-color: $separator-dark-color !important
    &__value
      color: $dark-text
    &__example
      background-color: transparent
      color: $brand-primary
      border-color: $brand-primary
    &__expand-btn
      color: #fff
</style>
