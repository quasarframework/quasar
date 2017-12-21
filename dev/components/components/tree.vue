<template>
  <div>
    <div class="layout-padding">
      <div>
        <div class="row sm-gutter items-center">
          <div class="col-xs-12 col-md-4">
            <q-select v-model="tickStrategy" :options="[
              {label: 'None', value: 'none'},
              {label: 'Leaf', value: 'leaf'},
              {label: 'Leaf Filtered', value: 'leaf-filtered'},
              {label: 'Strict', value: 'strict'}
            ]" stack-label="Tick Strategy" />
          </div>
          <div class="col-xs-12 col-md-4">
            <q-toggle v-model="accordion" label="Accordion mode" />
            <q-toggle v-model="dark" label="On dark background" />
            <q-toggle v-model="selectableNodes" label="Selectable nodes" />
          </div>
          <div class="col-xs-12 col-md-4">
            <q-input v-model="filter" stack-label="Filter" />
          </div>
          <div class="col-6 scroll" style="height: 6em;">
            <span class="text-bold">Ticked</span>:<br>{{ticked}}
          </div>
          <div class="col-6 scroll" style="height: 6em;">
            <span class="text-bold">Expanded</span>:<br>{{expanded}}
          </div>
          <div v-if="selectableNodes" class="col-xs-12 col-md-6">
            <span class="text-bold">Selected</span>:<br>{{selected}}
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
          node-key="label"
          :selected.sync="selected"
          :tick-strategy="tickStrategy"
          :ticked.sync="ticked"
          :expanded.sync="expanded"
          :dark="dark"
          :accordion="accordion"
          :color="color"
          :filter="filter"
          @lazy-load="onLazyLoad"
        >
          <!--
            <div slot="default-header" slot-scope="prop">
              Default H: {{prop.node.label}}
            </div>
            <div slot="default-body" slot-scope="prop">
              Default body
            </div>
          -->
          <div slot="header-custom" slot-scope="prop" class="row items-center">
            <q-icon :name="prop.node.icon" size="32px" class="q-mr-sm" />
            <div>
              {{prop.node.label}} <q-chip color="red">New</q-chip>
              <br>Wooooow. Custom
            </div>
          </div>

          <div slot="body-2-1-2-1" slot-scope="prop">
            Content for: {{prop.key}}
          </div>
        </q-tree>
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
    let children = []
    for (let i = 0; i < 500; i += 1) {
      children.push({
        label: 'Node 1.1.1.1.' + (i + 1)
      })
    }

    return {
      selected: null,
      tickStrategy: 'leaf',
      ticked: ['Node 2.2'],
      expanded: ['Node 2.1.4 - Disabled', 'Node 2.1.3 - freeze exp / tickable'],
      selectableNodes: true,
      dark: false,
      accordion: false,
      filter: '',
      defaultExpandAll: false,
      nodes: [
        {
          label: 'Node 1 - filter',
          icon: 'alarm',
          children: [
            {
              label: 'Node 1.1 - accordion test on children',
              avatar: 'statics/boy-avatar.png',
              children: [
                {
                  label: 'Node 1.1.1 - tick strategy leaf-filtered',
                  tickStrategy: 'leaf-filtered',
                  children: [
                    {
                      label: 'Node 1.1.1.1 - lots of leafs',
                      children
                    }
                  ]
                },
                {
                  label: 'Node 1.1.2 - tick strategy leaf',
                  tickStrategy: 'leaf',
                  children: [
                    {
                      label: 'Node 1.1.2.1'
                    }
                  ]
                },
                {
                  label: 'Node 1.1.3 -- not selectable',
                  selectable: false
                },
                {
                  label: 'Node 1.1.4 - not tickable',
                  tickable: false,
                  children: [
                    {
                      label: 'Node 1.1.4.1'
                    }
                  ]
                }
              ]
            },
            {
              label: 'Node 1.2',
              icon: 'map',
              header: 'custom'
            },
            {
              label: 'Node 1.3 - tap on me!',
              img: 'statics/mountains.jpg',
              handler: () => {
                this.$q.notify('Tapped on node 1.3')
              }
            }
          ]
        },
        {
          label: 'Node 2',
          children: [
            {
              label: 'Node 2.1',
              children: [
                {
                  label: 'Node 2.1.1'
                },
                {
                  label: 'Node 2.1.1 BIS - no tick present',
                  noTick: true
                },
                {
                  label: 'Node 2.1.2 - tick strategy strict',
                  tickStrategy: 'strict',
                  children: [
                    {
                      label: 'Node 2.1.2.1 - body slot',
                      body: '2-1-2-1',
                      children: [
                        {
                          label: 'Node q',
                          lazy: true
                        },
                        {
                          label: 'Node a',
                          lazy: true
                        }
                      ]
                    },
                    {
                      label: 'Node 2.1.2.2 - body slot & children',
                      body: '2-1-2-1',
                      children: [
                        {
                          label: 'Node 2.1.2.2.1'
                        },
                        {
                          label: 'Node 2.1.2.2.2'
                        }
                      ]
                    },
                    {
                      label: 'Node 2.1.2.3 - header slot',
                      header: '2-1-2-2'
                    }
                  ]
                },
                {
                  label: 'Node 2.1.x - Disabled',
                  disabled: true,
                  children: [
                    {
                      label: 'Node 2.1.x.1'
                    },
                    {
                      label: 'Node 2.1.x.2'
                    }
                  ]
                },
                {
                  label: 'Node 2.1.3 - freeze exp / tickable',
                  expandable: false,
                  tickable: true,
                  children: [
                    {
                      label: 'Node 2.1.3.1'
                    },
                    {
                      label: 'Node 2.1.3.2'
                    }
                  ]
                },
                {
                  label: 'Node 2.1.4 - Disabled',
                  disabled: true,
                  children: [
                    {
                      label: 'Node 2.1.4.1'
                    },
                    {
                      label: 'Node 2.1.4.2'
                    }
                  ]
                }
              ]
            },
            {
              label: 'Node 2.2'
            },
            {
              label: 'Node 2.3 - Lazy load',
              lazy: true
            },
            {
              label: 'Node 2.4 - Lazy load empty',
              lazy: true
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
          { label: `${label}.1` },
          { label: `${label}.2` },
          { label: `${label}.3`, lazy: true },
          {
            label: `${label}.4`,
            children: [
              { label: `${label}.4.1`, lazy: true },
              { label: `${label}.4.2`, lazy: true }
            ]
          }
        ])
      }, 1000)
    }
  }
}
</script>
