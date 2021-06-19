<template>
  <div>
    <div class="q-layout-padding">
      <div>
        <div class="row q-gutter-sm items-center">
          <div class="col-xs-12 col-md-4">
            <q-select v-model="tickStrategy" map-options emit-value :options="[
              {label: 'None', value: 'none'},
              {label: 'Leaf', value: 'leaf'},
              {label: 'Leaf Filtered', value: 'leaf-filtered'},
              {label: 'Strict', value: 'strict'}
            ]" label="Tick Strategy"
            />
          </div>
          <div class="col-xs-12 col-md-4">
            <q-toggle v-model="accordion" label="Accordion mode" />
            <q-toggle v-model="dark" label="On dark background" :false-value="null" />
            <q-toggle v-model="selectableNodes" label="Selectable nodes" />
            <q-toggle v-model="noConnectors" label="No connectors" />
          </div>
          <div class="col-xs-12 col-md-4">
            <q-input v-model="filter" label="Filter" />
          </div>
          <div class="col-6 scroll" style="height: 6em;">
            <span class="text-bold">Ticked</span>:<br>{{ ticked }}
          </div>
          <div class="col-6 scroll" style="height: 6em;">
            <span class="text-bold">Expanded</span>:<br>{{ expanded }}
          </div>
          <div v-if="selectableNodes" class="col-xs-12 col-md-6" style="min-height: 60px">
            <span class="text-bold">Selected</span>:<br>{{ selected || 'null' }}
          </div>
          <div class="col-xs-12 col-md-6">
            <q-btn @click="getNodeByKey" no-caps label="getNodeByKey test" />
            <q-btn @click="expandAll" no-caps label="Expand all" />
          </div>
        </div>
      </div>

      <div class="q-mt-lg q-pa-lg" :class="{'bg-black': dark}">
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
          :accordion="accordion"
          :color="color"
          :filter="filter"
          :no-connectors="noConnectors"
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
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
              <div>
                <div class="row items-center">
                  <span>{{ prop.node.label }}</span>
                  <q-chip color="red" text-color="white" dense>
                    New
                  </q-chip>
                </div>
                <div>Wooooow. Custom</div>
              </div>
            </div>
          </template>

          <template v-slot:body-2-1-2-1="prop">
            Content for: {{ prop.key }}
          </template>
        </q-tree>
      </div>

      <div class="invisible" style="height: 500px">
        Scroll (on purpose)
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    color () {
      return this.dark ? 'red' : 'secondary'
    }
  },
  watch: {
    selectableNodes (v) {
      this.selected = v
        ? this.selected || null
        : undefined
    }
  },
  data () {
    /*
    let children = []
    for (let i = 0; i < 500; i += 1) {
      children.push({
        key: 'KEY: Node 1.1.1.1.' + (i + 1),
        label: 'Node 1.1.1.1.' + (i + 1)
      })
    }
    */

    return {
      noConnectors: false,
      selected: null,
      tickStrategy: 'leaf',
      ticked: [
        'KEY: Node 2.2',
        'KEY: Node child - 1 - disabled',
        'KEY: Node child - 3 - disabled',
        'KEY: Node child - 1 - enabled - untickable',
        'KEY: Node child - 4 - enabled - untickable'
      ],
      expanded: [
        'KEY: Node 2.1.4 - Disabled',
        'KEY: Node 2.1.3 - freeze exp / tickable',
        'KEY: Node parent - untickable ticked child',
        'KEY: Node parent - untickable unticked child',
        'KEY: Node parent - all untickable ticked children',
        'KEY: Node parent - all untickable unticked children',
        'KEY: Node parent - all untickable mix ticked children',
        'KEY: Node child - 5 - disabled'
      ],
      selectableNodes: true,
      dark: null,
      accordion: false,
      filter: '',
      defaultExpandAll: false,
      nodes: [
        {
          key: 'KEY: Node 1 - filter',
          label: 'Node 1 - filter',
          icon: 'alarm',
          iconColor: 'red',
          subnodes: [
            {
              key: 'KEY: Node 1.1 - accordion test on children',
              label: 'Node 1.1 - accordion test on children',
              avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
              subnodes: [
                {
                  key: 'KEY: Node 1.1.1 - tick strategy leaf-filtered',
                  label: 'Node 1.1.1 - tick strategy leaf-filtered',
                  tickStrategy: 'leaf-filtered',
                  subnodes: [
                    {
                      key: 'KEY: Node 1.1.1.1 - lots of leafs',
                      label: 'Node 1.1.1.1 - lots of leafs'/* ,
                      children */
                    }
                  ]
                },
                {
                  key: 'KEY: Node 1.1.2 - tick strategy leaf',
                  label: 'Node 1.1.2 - tick strategy leaf',
                  tickStrategy: 'leaf',
                  subnodes: [
                    {
                      key: 'KEY: Node 1.1.2.1',
                      label: 'Node 1.1.2.1'
                    }
                  ]
                },
                {
                  key: 'KEY: Node 1.1.3 -- not selectable',
                  label: 'Node 1.1.3 -- not selectable',
                  selectable: false
                },
                {
                  key: 'KEY: Node 1.1.4 - not tickable',
                  label: 'Node 1.1.4 - not tickable',
                  tickable: false,
                  subnodes: [
                    {
                      key: 'KEY: Node 1.1.4.1',
                      label: 'Node 1.1.4.1'
                    }
                  ]
                }
              ]
            },
            {
              key: 'KEY: Node 1.2',
              label: 'Node 1.2',
              icon: 'map',
              header: 'custom'
            },
            {
              key: 'KEY: Node 1.3 - tap on me!',
              label: 'Node 1.3 - tap on me!',
              img: 'https://cdn.quasar.dev/img/mountains.jpg',
              handler: () => {
                this.$q.notify('Tapped on node 1.3')
              }
            }
          ]
        },
        {
          key: 'KEY: Node 2',
          label: 'Node 2',
          subnodes: [
            {
              key: 'KEY: Node 2.1',
              label: 'Node 2.1',
              subnodes: [
                {
                  key: 'KEY: Node 2.1.1',
                  label: 'Node 2.1.1'
                },
                {
                  key: 'KEY: Node 2.1.1 BIS - no tick present',
                  label: 'Node 2.1.1 BIS - no tick present',
                  noTick: true
                },
                {
                  key: 'KEY: Node 2.1.2 - tick strategy strict',
                  label: 'Node 2.1.2 - tick strategy strict',
                  tickStrategy: 'strict',
                  subnodes: [
                    {
                      key: 'KEY: Node 2.1.2.1 - body slot',
                      label: 'Node 2.1.2.1 - body slot',
                      body: '2-1-2-1',
                      subnodes: [
                        {
                          key: 'KEY: Node q',
                          label: 'Node q',
                          lazy: true
                        },
                        {
                          key: 'KEY: Node a',
                          label: 'Node a',
                          lazy: true
                        }
                      ]
                    },
                    {
                      key: 'KEY: Node 2.1.2.2 - body slot & children',
                      label: 'Node 2.1.2.2 - body slot & children',
                      body: '2-1-2-1',
                      subnodes: [
                        {
                          key: 'KEY: Node 2.1.2.2.1',
                          label: 'Node 2.1.2.2.1'
                        },
                        {
                          key: 'KEY: Node 2.1.2.2.2',
                          label: 'Node 2.1.2.2.2'
                        }
                      ]
                    },
                    {
                      key: 'KEY: Node 2.1.2.3 - header slot',
                      label: 'Node 2.1.2.3 - header slot',
                      header: '2-1-2-2'
                    }
                  ]
                },
                {
                  key: 'KEY: Node 2.1.x - Disabled',
                  label: 'Node 2.1.x - Disabled',
                  disabled: true,
                  subnodes: [
                    {
                      key: 'KEY: Node 2.1.x.1',
                      label: 'Node 2.1.x.1'
                    },
                    {
                      key: 'KEY: Node 2.1.x.2',
                      label: 'Node 2.1.x.2'
                    }
                  ]
                },
                {
                  key: 'KEY: Node 2.1.3 - freeze exp / tickable',
                  label: 'Node 2.1.3 - freeze exp / tickable',
                  expandable: false,
                  tickable: true,
                  subnodes: [
                    {
                      key: 'KEY: Node 2.1.3.1',
                      label: 'Node 2.1.3.1'
                    },
                    {
                      key: 'KEY: Node 2.1.3.2',
                      label: 'Node 2.1.3.2'
                    }
                  ]
                },
                {
                  key: 'KEY: Node 2.1.4 - Disabled',
                  label: 'Node 2.1.4 - Disabled',
                  disabled: true,
                  subnodes: [
                    {
                      key: 'KEY: Node 2.1.4.1',
                      label: 'Node 2.1.4.1'
                    },
                    {
                      key: 'KEY: Node 2.1.4.2',
                      label: 'Node 2.1.4.2'
                    }
                  ]
                }
              ]
            },
            {
              key: 'KEY: Node 2.2',
              label: 'Node 2.2'
            },
            {
              key: 'KEY: Node 2.3',
              label: 'Node 2.3',
              subnodes: [
                {
                  key: 'KEY: Node 2.3.1',
                  label: 'Node 2.3.1',
                  body: '2-1-2-1'
                },
                {
                  key: 'KEY: Node 2.3.2',
                  label: 'Node 2.3.2',
                  body: '2-1-2-1'
                }
              ]
            },
            {
              key: 'KEY: Node 2.4 - Lazy load',
              label: 'Node 2.4 - Lazy load',
              lazy: true
            },
            {
              key: 'KEY: Node 2.5 - Lazy load empty',
              label: 'Node 2.5 - Lazy load empty',
              lazy: true
            }
          ]
        },
        {
          key: 'KEY: Node parent - untickable ticked child',
          label: 'Node parent - untickable ticked child',
          subnodes: [
            {
              key: 'KEY: Node child - 1 - disabled',
              label: 'Node child - 1 - disabled',
              disabled: true
            },
            {
              key: 'KEY: Node child - 1 - enabled - 1',
              label: 'Node child - 1 - enabled - 1'
            },
            {
              key: 'KEY: Node child - 1 - enabled - 2',
              label: 'Node child - 1 - enabled - 2'
            },
            {
              key: 'KEY: Node child - 1 - enabled - untickable',
              label: 'Node child - 1 - enabled - untickable',
              tickable: false
            }
          ]
        },
        {
          key: 'KEY: Node parent - untickable unticked child',
          label: 'Node parent - untickable unticked child',
          subnodes: [
            {
              key: 'KEY: Node child - 2 - disabled',
              label: 'Node child - 2 - disabled',
              disabled: true
            },
            {
              key: 'KEY: Node child - 2 - enabled - 1',
              label: 'Node child - 2 - enabled - 1'
            },
            {
              key: 'KEY: Node child - 2 - enabled - 2',
              label: 'Node child - 2 - enabled - 2'
            },
            {
              key: 'KEY: Node child - 2 - enabled - untickable',
              label: 'Node child - 2 - enabled - untickable',
              tickable: false
            }
          ]
        },
        {
          key: 'KEY: Node parent - all untickable ticked children',
          label: 'Node parent - all untickable ticked children',
          subnodes: [
            {
              key: 'KEY: Node child - 3 - disabled',
              label: 'Node child - 3 - disabled',
              disabled: true
            }
          ]
        },
        {
          key: 'KEY: Node parent - all untickable mix ticked children',
          label: 'Node parent - all untickable mix ticked children',
          subnodes: [
            {
              key: 'KEY: Node child - 4 - disabled',
              label: 'Node child - 4 - disabled',
              disabled: true
            },
            {
              key: 'KEY: Node child - 4 - enabled - untickable',
              label: 'Node child - 4 - enabled - untickable',
              tickable: false
            }
          ]
        },
        {
          key: 'KEY: Node parent - all untickable unticked children',
          label: 'Node parent - all untickable unticked children',
          subnodes: [
            {
              key: 'KEY: Node child - 5 - disabled',
              label: 'Node child - 5 - disabled',
              disabled: true,
              subnodes: [
                {
                  key: 'KEY: Node child - 5.1 - disabled',
                  label: 'Node child - 5.1 - disabled',
                  disabled: true
                },
                {
                  key: 'KEY: Node child - 5.2 - enabled - untickable',
                  label: 'Node child - 5.2 - enabled - untickable',
                  tickable: false
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    getNodeByKey () {
      console.log(this.$refs.tree.getNodeByKey('Node 2.1.1'))
    },
    expandAll () {
      this.$refs.tree.expandAll()
    },
    onLazyLoad ({ node, key, done, fail }) {
      // call fail() if any error occurs

      setTimeout(() => {
        if (key.indexOf('Lazy load empty') > -1) {
          done([])
          return
        }

        const label = node.label.replace(' - Lazy load', '')

        done([
          { label: `${ label }.1`, key: `${ label }.1` },
          { label: `${ label }.2`, key: `${ label }.2` },
          { label: `${ label }.3`, key: `${ label }.3`, lazy: true },
          {
            label: `${ label }.4`,
            key: `${ label }.4`,
            subnodes: [
              { label: `${ label }.4.1`, key: `${ label }.4.1`, lazy: true },
              { label: `${ label }.4.2`, key: `${ label }.4.2`, lazy: true }
            ]
          }
        ])
      }, 1000)
    }
  }
}
</script>
