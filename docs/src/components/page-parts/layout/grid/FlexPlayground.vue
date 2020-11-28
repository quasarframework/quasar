<template>
  <div>
    <div class="text-subtitle2 q-pb-md">Parent Properties (container)</div>
    <div class="row wrap justify-start content-stretch">
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="group.containerGroup" :options="containerOptions" label="Container" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="group.directionGroup" :options="directionOptions" label="Direction" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="group.wrapGroup" :options="wrapOptions" label="Wrap" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="group.justifyGroup" :options="justifyOptions" label="Justify Content" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="group.itemsGroup" :options="itemsOptions" label="Align Items" emit-value map-options dense options-dense />
      </div>
      <div class="col-lg-2 col-xs-6">
        <q-select color="blue-12" v-model="group.contentGroup" :options="contentOptions" label="Align Content" emit-value map-options dense options-dense />
      </div>
    </div>

    <div class="text-weight-medium q-mt-sm">Container Classes</div>
    <q-input filled v-model="classes" dense readonly class="q-py-sm">
      <template #append>
        <copy-button :text="classes" />
      </template>
    </q-input>

    <div class="text-subtitle2 float-left">
      Results <span class="text-weight-thin">(children: {{ group.children.length }}/10)</span>
    </div>

    <q-btn class="float-right" round dense flat :icon="mdiShareVariant" @click="share">
      <q-tooltip>{{ copied ? 'Copied to clipboard' : 'Share URL' }}</q-tooltip>
    </q-btn>
    <q-btn class="float-right" round dense flat :icon="fabCodepen" @click="editInCodepen">
      <q-tooltip>Edit in Codepen</q-tooltip>
    </q-btn>

    <q-btn class="float-right" label="Add Child" :icon="mdiPlus" dense flat :disabled="group.children.length >= 10" @click="addChild" />
    <div class="row full-width bg-blue-grey-2" style="min-height: 400px">
      <div id="parent" :class="classes" style="overflow: hidden;">
        <child v-for="(child, index) in group.children" :key="index"
          :child="child"
          :ref="el => { childRef[index] = el }"
          :index="index"
          :selected-index="selectedIndex"
          @delete="onDelete"
          @change="onChange"
        />
      </div>
    </div>

    <div class="text-weight-medium q-mt-sm">Child Classes</div>
    <q-input filled v-model="group.childClasses" dense readonly class="q-py-sm">
      <template #append>
        <copy-button :text="group.childClasses" />
      </template>
    </q-input>

    <div class="text-weight-medium q-mt-sm">Child Styles</div>
    <q-input filled v-model="group.childStyles" dense readonly class="q-py-sm">
      <template #append>
        <copy-button :text="group.childStyles" />
      </template>
    </q-input>

    <doc-codepen ref="codepenRef" title="Flex example" slugifiedTitle="flex-example" />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUpdate } from 'vue'
import { useRoute } from 'vue-router'
import { copyToClipboard } from 'quasar'
import { fabCodepen } from '@quasar/extras/fontawesome-v5'
import { mdiPlus, mdiShareVariant } from '@quasar/extras/mdi-v5'

import Child from './FlexChild'
import DocCodepen from '../../../DocCodepen'
import CopyButton from '../../../CopyButton'

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

export default {
  name: 'FlexPlayground',

  components: {
    Child,
    DocCodepen,
    CopyButton
  },

  setup () {
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
      const children = group.children.map((child, index) => {
        const kid = childRef.value[ index ]
        return `<div class="${kid.classes} bg-grey-6" style="${kid.styles}">
          <q-card class="no-border-radius">
            <q-card-section>
              Child #${index}
            </q-card-section>
          </q-card>
        </div>`
      })

      const template = `
        <div class="flex flex-center column">
          <div class="text-h6">Flex playground example</div>
          <div class="row bg-blue-grey-2" style="min-height: 400px; width: 80%; padding: 24px;">
            <div id="parent" class="${classes.value}" style="overflow: hidden;">
              ${children.join('')}
            </div>
          </div>
        </div>
      `
      codepenRef.value.open({ template })
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

    return {
      fabCodepen,
      mdiPlus,
      mdiShareVariant,

      childRef,
      codepenRef,

      group,

      queryParams,
      containerOptions,
      directionOptions,
      wrapOptions,
      justifyOptions,
      itemsOptions,
      contentOptions,

      selectedIndex,
      copied,

      classes,

      addChild,
      onDelete,
      onChange,
      share,
      editInCodepen
    }
  }
}
</script>

<style lang="sass" scoped>
.row:not(.q-field__append) > div
  padding: 8px
  background: rgba(227,242,253,.6)
  border: 1px solid rgba(187,222,251,.9)

.row + .row
  margin-top: 1rem

.column > div
  padding: 8px
  background: rgba(227,242,253,.6)
  border: 1px solid rgba(187,222,251,.9)

.column > .col
  padding: 5px 2px
</style>
