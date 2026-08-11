<template>
  <div>
    <div class="q-layout-padding">
      <div>
        <div class="row q-gutter-sm items-center">
          <div class="col-xs-12 col-md-4">
            <q-select
              v-model="tickStrategy"
              map-options
              emit-value
              :options="[
                { label: 'None', value: 'none' },
                { label: 'Leaf', value: 'leaf' },
                { label: 'Leaf Filtered', value: 'leaf-filtered' },
                { label: 'Strict', value: 'strict' }
              ]"
              label="Tick Strategy"
            />
          </div>
          <div class="col-xs-12 col-md-4">
            <q-toggle v-model="accordion" label="Accordion mode" />
            <q-toggle
              v-model="dark"
              label="On dark background"
              :false-value="null"
            />
            <q-toggle v-model="dense" label="Dense" />
            <q-toggle v-model="selectableNodes" label="Selectable nodes" />
            <q-toggle v-model="noSelectionUnset" label="noSelectionUnset" />
            <q-toggle v-model="noConnectors" label="No connectors" />
          </div>
          <div class="col-xs-12 col-md-4">
            <q-input v-model="filter" label="Filter" />
          </div>
          <div class="col-6 scroll" style="height: 6em">
            <span class="text-bold">Ticked</span>:<br />{{ ticked }}
          </div>
          <div class="col-6 scroll" style="height: 6em">
            <span class="text-bold">Expanded</span>:<br />{{ expanded }}
          </div>
          <div
            v-if="selectableNodes"
            class="col-xs-12 col-md-6"
            style="min-height: 60px"
          >
            <span class="text-bold">Selected</span>:<br />{{
              selected || 'null'
            }}
          </div>
          <div class="col-xs-12 col-md-6 q-gutter-x-sm">
            <q-btn @click="getNodeByKey" no-caps label="getNodeByKey test" />
            <q-toggle v-model="isBigTree" label="Load Big Tree" />
            <q-toggle v-model="noTransition" label="noTransition" />
            <q-btn @click="expandAll" no-caps label="Expand all" />
            <q-btn @click="collapseAll" no-caps label="Collapse all" />
          </div>
        </div>
      </div>

      <div class="q-mt-lg q-pa-lg" :class="{ 'bg-black': dark }">
        <q-tree
          ref="tree"
          :nodes="nodes"
          node-key="key"
          children-key="subnodes"
          v-model:selected="selected"
          :tick-strategy="tickStrategy"
          v-model:ticked="ticked"
          v-model:expanded="expanded"
          :dark="dark"
          :dense="dense"
          :accordion="accordion"
          :color="color"
          :filter="filter"
          :no-connectors="noConnectors"
          :no-transition="noTransition"
          :no-selection-unset="noSelectionUnset"
          @lazy-load="onLazyLoad"
        >
          <!--
            <template v-slot:default-header="prop">
              <div>
                Default H: {{prop.node.label}}
              </div>
            </template>
            <template v-slot:default-body>
              Default body
            </template>
          -->
          <template v-slot:header-custom="prop">
            <div class="row items-center">
              <q-icon :name="prop.node.icon" class="q-tree__icon q-mr-sm" />
              <q-avatar class="q-mr-sm">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              <div>
                <div class="row items-center">
                  <span>{{ prop.node.label }}</span>
                  <q-chip color="red" text-color="white" dense> New </q-chip>
                </div>
                <div>Wooooow. Custom</div>
              </div>
            </div>
          </template>

          <template v-slot:body-2-1-2-1="prop">
            Content for: {{ prop.key }}
          </template>

          <template v-slot:body-2-1-2-2-1="prop">
            Content for: {{ prop.key }}
          </template>
        </q-tree>
      </div>

      <div class="invisible" style="height: 500px">Scroll (on purpose)</div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

import smallTree from '@/mock-data/tree/smallTree.json'

const findNode = (key, nodes) => {
  for (let node of nodes) {
    if (node.key === key) return node
    if (node.subnodes) {
      node = findNode(key, node.subnodes)
      if (node) return node
    }
  }
}

const $q = useQuasar()

/*
let children = []
for (let i = 0; i < 500; i += 1) {
  children.push({
    key: 'KEY: Node 1.1.1.1.' + (i + 1),
    label: 'Node 1.1.1.1.' + (i + 1)
  })
}
*/
// Patch the smallTree's node 1.3 as we can't save function to JSON
findNode('KEY: Node 1.3 - tap on me!', smallTree).handler = () =>
  $q.notify('Tapped on node 1.3')

const noConnectors = ref(false)
const noTransition = ref(false)
const selected = ref(null)
const noSelectionUnset = ref(false)
const tickStrategy = ref('leaf')
const ticked = ref([
  'KEY: Node 2.2',
  'KEY: Node child - 1 - disabled',
  'KEY: Node child - 3 - disabled',
  'KEY: Node child - 1 - enabled - untickable',
  'KEY: Node child - 4 - enabled - untickable'
])
const expanded = ref([
  'KEY: Node 2.1.4 - Disabled',
  'KEY: Node 2.1.3 - freeze exp / tickable',
  'KEY: Node parent - untickable ticked child',
  'KEY: Node parent - untickable unticked child',
  'KEY: Node parent - all untickable ticked children',
  'KEY: Node parent - all untickable unticked children',
  'KEY: Node parent - all untickable mix ticked children',
  'KEY: Node child - 5 - disabled'
])
const selectableNodes = ref(true)
const dark = ref(null)
const dense = ref(false)
const accordion = ref(false)
const filter = ref('')
const defaultExpandAll = ref(false)
const isBigTree = ref(false)
const nodes = ref(smallTree)

const tree = ref(null)

const color = computed(() => (dark.value ? 'red' : 'secondary'))

watch(selectableNodes, v => {
  selected.value = v ? selected.value || null : void 0
})

watch(isBigTree, async v => {
  if (v) {
    console.log('Loading big tree...')
    const json = await import('@/mock-data/tree/bigTree.json')
    nodes.value = json.default
    console.log('Big tree loaded')
    return
  }
  nodes.value = smallTree
})

function getNodeByKey() {
  console.log(tree.value.getNodeByKey('Node 2.1.1'))
}

function expandAll() {
  tree.value.expandAll()
}

function collapseAll() {
  tree.value.collapseAll()
}

function onLazyLoad({ node, key, done, fail }) {
  // call fail() if any error occurs

  setTimeout(() => {
    if (key.includes('Lazy load empty')) {
      done([])
      return
    }

    const label = node.label.replace(' - Lazy load', '')

    done([
      { label: `${label}.1`, key: `${label}.1` },
      { label: `${label}.2`, key: `${label}.2` },
      { label: `${label}.3`, key: `${label}.3`, lazy: true },
      {
        label: `${label}.4`,
        key: `${label}.4`,
        subnodes: [
          { label: `${label}.4.1`, key: `${label}.4.1`, lazy: true },
          { label: `${label}.4.2`, key: `${label}.4.2`, lazy: true }
        ]
      }
    ])
  }, 1000)
}
</script>
