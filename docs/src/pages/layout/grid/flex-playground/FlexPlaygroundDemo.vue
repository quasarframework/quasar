<template>
  <div class="flex-playground-demo" :class="demoClasses">
    <div class="q-pb-lg">
      <q-btn
        color="secondary"
        @click="toggleFullscreen"
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Try playground in Fullscreen'"
      />
    </div>

    <div class="text-h6 q-mb-md">Configure parent (container):</div>
    <div class="row q-col-gutter-sm content-stretch q-mb-md">
      <div class="col-lg-2 col-xs-12 col-sm-6">
        <q-select color="blue-12" v-model="group.containerGroup" :options="containerOptions" label="Container" emit-value map-options dense options-dense outlined />
      </div>
      <div class="col-lg-2 col-xs-12 col-sm-6">
        <q-select color="blue-12" v-model="group.directionGroup" :options="directionOptions" label="Direction" emit-value map-options dense options-dense outlined />
      </div>
      <div class="col-lg-2 col-xs-12 col-sm-6">
        <q-select color="blue-12" v-model="group.wrapGroup" :options="wrapOptions" label="Wrap" emit-value map-options dense options-dense outlined />
      </div>
      <div class="col-lg-2 col-xs-12 col-sm-6">
        <q-select color="blue-12" v-model="group.justifyGroup" :options="justifyOptions" label="Justify Content" emit-value map-options dense options-dense outlined />
      </div>
      <div class="col-lg-2 col-xs-12 col-sm-6">
        <q-select color="blue-12" v-model="group.itemsGroup" :options="itemsOptions" label="Align Items" emit-value map-options dense options-dense outlined />
      </div>
      <div class="col-lg-2 col-xs-12 col-sm-6">
        <q-select color="blue-12" v-model="group.contentGroup" :options="contentOptions" label="Align Content" emit-value map-options dense options-dense outlined />
      </div>
    </div>

    <div class="row items-center q-gutter-md q-mb-md">
      <div>Resulting container classes:</div>
      <div class="flex-playground-demo__result row inline no-wrap items-center no-wrap rounded-borders q-px-sm relative-position" :class="resultClasses">
        <div class="text-subtitle2 q-mr-sm">{{ classes }}</div>
        <copy-button :text="classes" />
      </div>
    </div>

    <div class="row items-center q-gutter-md q-mb-md">
      <div class="text-h6">Configure children: {{ group.children.length }} / 10</div>

      <q-btn label="Add Child" :icon="mdiPlus" size="10px" outline :disabled="group.children.length >= 10" @click="addChild" />

      <q-space />

      <q-btn round dense flat :icon="mdiShareVariant" @click="share">
        <q-tooltip>{{ copied ? 'Copied to clipboard' : 'Share URL' }}</q-tooltip>
      </q-btn>

      <q-btn round dense flat :icon="fabCodepen" @click="editInCodepen">
        <q-tooltip>Edit in Codepen</q-tooltip>
      </q-btn>
    </div>

    <div class="flex-playground-demo__container rounded-borders" :class="containerClass">
      <div :class="classes" class="row full-width" style="overflow: hidden">
        <flex-child
          v-for="(child, index) in group.children"
          :key="index"
          class="flex-playground-demo__child rounded-borders"
          :child="child"
          :ref="el => { childRef[index] = el }"
          :index="index"
          :selected-index="selectedIndex"
          @delete="onDelete"
          @change="onChange"
        />
      </div>
    </div>

    <q-markup-table flat bordered class="text-left q-mt-md">
      <thead>
        <tr>
          <th>Where to apply</th>
          <th>What to apply</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Container classes</td>
          <td>
            <div class="flex-playground-demo__result row inline no-wrap items-center no-wrap rounded-borders q-px-sm relative-position" :class="resultClasses">
              <div class="text-subtitle2 q-mr-sm">{{ classes }}</div>
              <copy-button :text="classes" />
            </div>
          </td>
        </tr>

        <tr>
          <td>Child #{{ selectedIndex + 1 }} classes</td>
          <td>
            <div class="flex-playground-demo__result row inline no-wrap items-center no-wrap rounded-borders q-px-sm relative-position" :class="resultClasses">
              <div class="text-subtitle2 q-mr-sm">{{ group.childClasses || '* none *' }}</div>
              <copy-button v-if="group.childClasses" :text="group.childClasses" />
            </div>
          </td>
        </tr>

        <tr>
          <td>Child #{{ selectedIndex + 1 }} styles</td>
          <td>
            <div class="flex-playground-demo__result row inline no-wrap items-center no-wrap rounded-borders q-px-sm relative-position" :class="resultClasses">
              <div class="text-subtitle2 q-mr-sm">{{ group.childStyles || '* none *' }}</div>
              <copy-button v-if="group.childStyles" :text="group.childStyles" />
            </div>
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <doc-codepen ref="codepenRef" title="Flex example" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUpdate } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, copyToClipboard } from 'quasar'
import { fabCodepen } from '@quasar/extras/fontawesome-v6'
import { mdiPlus, mdiShareVariant } from '@quasar/extras/mdi-v6'

import FlexChild from './FlexChild.vue'
import DocCodepen from 'src/components/DocCodepen.vue'
import CopyButton from 'src/components/CopyButton.vue'

const queryParams = {
  containerGroup: 'string',
  directionGroup: 'string',
  wrapGroup: 'string',
  justifyGroup: 'string',
  itemsGroup: 'string',
  contentGroup: 'string',
  children: 'object',
  childClasses: 'string',
  childStyles: 'string'
}

const containerOptions = [
  { label: 'none', value: '' },
  { label: 'fit', value: 'fit' },
  { label: 'full-width', value: 'full-width' },
  { label: 'full-height', value: 'full-height' }
]
const directionOptions = [
  { label: 'row', value: 'row' },
  { label: 'row inline', value: 'row inline' },
  { label: 'column', value: 'column' },
  { label: 'column inline', value: 'column inline' },
  { label: 'row reverse', value: 'row reverse' },
  { label: 'column reverse', value: 'column reverse' }
]
const wrapOptions = [
  { label: 'none', value: '' },
  { label: 'wrap', value: 'wrap' },
  { label: 'no-wrap', value: 'no-wrap' },
  { label: 'reverse-wrap', value: 'reverse-wrap' }
]
const justifyOptions = [
  { label: 'none', value: '' },
  { label: 'justify-start', value: 'justify-start' },
  { label: 'justify-end', value: 'justify-end' },
  { label: 'justify-center', value: 'justify-center' },
  { label: 'justify-between', value: 'justify-between' },
  { label: 'justify-around', value: 'justify-around' },
  { label: 'justify-evenly', value: 'justify-evenly' }
]
const itemsOptions = [
  { label: 'none', value: '' },
  { label: 'items-start', value: 'items-start' },
  { label: 'items-end', value: 'items-end' },
  { label: 'items-center', value: 'items-center' },
  { label: 'items-stretch', value: 'items-stretch' },
  { label: 'items-baseline', value: 'items-baseline' }
]
const contentOptions = [
  { label: 'none', value: '' },
  { label: 'content-start', value: 'content-start' },
  { label: 'content-end', value: 'content-end' },
  { label: 'content-center', value: 'content-center' },
  { label: 'content-stretch', value: 'content-stretch' },
  { label: 'content-between', value: 'content-between' },
  { label: 'content-around', value: 'content-around' }
]

const $q = useQuasar()
const $route = useRoute()

const childRef = ref([])
const codepenRef = ref(null)

const group = reactive({
  containerGroup: 'fit',
  directionGroup: 'row',
  wrapGroup: 'wrap',
  justifyGroup: 'justify-start',
  itemsGroup: 'items-start',
  contentGroup: 'content-start',
  children: [],
  childClasses: '',
  childStyles: ''
})

const selectedIndex = ref(0)
const copied = ref(false)

function checkQueryParams () {
  const query = $route.query
  for (const param in queryParams) {
    if (param in query) {
      const paramType = queryParams[ param ]
      switch (paramType) {
        case 'object':
          group[ param ] = JSON.parse(query[ param ])
          break
        default:
          group[ param ] = query[ param ]
      }
    }
  }
  if (!query.children) {
    addChild()
  }
}

function addChild () {
  if (group.children.length < 10) {
    group.children.push({
      width: '',
      height: '',
      widthGroup: '',
      breakpointGroup: null,
      alignmentGroup: '',
      offsetGroup: '',
      gutterGroup: null,
      colGutterGroup: null
    })
  }
}

function onDelete (index) {
  group.children.splice(index, 1)
}

function onChange (index) {
  selectedIndex.value = index
  const child = childRef.value[ index ]
  group.childClasses = child.classes
  group.childStyles = child.styles
}

function share () {
  let playgroudUrl = window.location.href
  if (playgroudUrl.includes('?')) {
    playgroudUrl = playgroudUrl.substring(0, playgroudUrl.indexOf('?'))
  }
  let queryString = '',
    index = 0
  const paramsCount = Object.keys(queryParams).length
  for (const param in queryParams) {
    const paramType = queryParams[ param ]
    let value
    switch (paramType) {
      case 'object':
        value = JSON.stringify(group[ param ])
        break
      default:
        value = group[ param ]
    }
    queryString += `${param}=${encodeURIComponent(value)}`
    index++
    if (index < paramsCount) {
      queryString += '&'
    }
  }
  copyToClipboard(`${playgroudUrl}?${queryString}`)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

function editInCodepen () {
  const children = group.children.map((_, index) => {
    const kid = childRef.value[ index ]
    return `<div class="${kid.classes} bg-grey-6" style="${kid.styles}">
      <q-card class="no-border-radius">
        <q-card-section>
          Child #${index + 1}
        </q-card-section>
      </q-card>
    </div>`
  })

  const Template = `
    <div class="flex flex-center column">
      <div class="text-h6">Flex playground example</div>
      <div class="row bg-blue-grey-2" style="min-height: 400px; width: 80%; padding: 24px;">
        <div id="parent" class="${classes.value}" style="overflow: hidden;">
          ${children.join('')}
        </div>
      </div>
    </div>
  `
  codepenRef.value.open({ Template })
}

onMounted(checkQueryParams)

// Make sure to reset the dynamic refs before each update.
onBeforeUpdate(() => {
  childRef.value = []
})

const classes = computed(() => {
  return (group.containerGroup +
    ' ' + group.directionGroup +
    ' ' + group.wrapGroup +
    ' ' + group.justifyGroup +
    ' ' + group.itemsGroup +
    ' ' + group.contentGroup)
    .replace(/,/g, ' ')
    .replace(/'  +'/g, ' ')
    .trim()
})

const resultClasses = computed(() => ($q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2 text-dark'))
const demoClasses = computed(() => ($q.fullscreen.isActive ? 'bg-white q-pa-md' : null))
const containerClass = computed(() => `flex-playground-demo__container--${ $q.dark.isActive ? 'dark' : 'light' }`)

function toggleFullscreen () {
  const target = document.getElementById('flex-playground')
  target && $q.fullscreen.toggle(target)
}
</script>

<style lang="sass">
.flex-playground-demo

  &__result
    border-radius: $generic-border-radius
    border: 1px dotted currentColor

  &__child
    padding: 8px
    min-width: 220px

    > div,
    > .q-field
      margin-bottom: 2px

  &__container
    min-height: 400px
    padding: 8px

    &--light
      &,
      .flex-playground-demo__child
        background: rgba(227,242,253,.6)
        border: 1px solid $separator-color

    &--dark
      &,
      .flex-playground-demo__child
        background: rgba(#333,.6)
        border: 1px solid $separator-dark-color
</style>
