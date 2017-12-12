<template>
  <div>
    <div class="layout-padding">
      <h1>WIP</h1>
      <div class="row sm-gutter items-center">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="selection" :options="[{label: 'None', value: 'none'}, {label: 'Leaf', value: 'leaf'}, {label: 'Strict', value: 'strict'}]" stack-label="Selection" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-toggle v-model="accordion" label="Accordion mode" />
          <q-toggle v-model="dark" label="On dark background" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-input v-model="filter" stack-label="Filter" />
        </div>
      </div>

      <div class="row sm-gutter items-center">
        <div class="col-6">
          <span class="text-bold">Selected</span>:<br>{{selected}}
        </div>
        <div class="col-6">
          <span class="text-bold">Expanded</span>:<br>{{expanded}}
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <span class="text-bold">Focused</span>:<br>{{focused}}
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-btn @click="getNodeByKey" no-caps label="getNodeByKey test" />
        </div>
      </div>

      <div class="q-mt-lg q-pa-lg" :class="{'bg-black': dark}">
        <q-tree
          :nodes="nodes"
          ref="gigi"
          node-key="label"
          :focused.sync="focused"
          :selection="selection"
          :selected.sync="selected"
          :expanded.sync="expanded"
          :dark="dark"
          :accordion="accordion"
          :color="color"
          :filter="filter"
          default-expand-all
          @lazy-load="onLazyLoad"
        >
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
      return this.dark ? 'amber' : 'secondary'
    }
  },
  data () {
    return {
      focused: null,
      selection: 'leaf',
      selected: ['Node 2.2'],
      expanded: ['Node 2.1.4 - Disabled'],
      dark: false,
      accordion: false,
      filter: '',
      nodes: [
        {
          label: 'Node 1 - filter',
          icon: 'alarm',
          children: [
            {
              label: 'Node 1.1 - accordion test on children',
              children: [
                {
                  label: 'Node 1.1.1',
                  children: [
                    {
                      label: 'Node 1.1.1.1'
                    }
                  ]
                },
                {
                  label: 'Node 1.1.2',
                  children: [
                    {
                      label: 'Node 1.1.2.1'
                    }
                  ]
                },
                {
                  label: 'Node 1.1.3 -- not focusable',
                  focusable: false
                }
              ]
            },
            {
              label: 'Node 1.2'
            },
            {
              label: 'Node 1.3',
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
                  label: 'Node 2.1.1 BIS - not selectable',
                  selectable: false
                },
                {
                  label: 'Node 2.1.2',
                  children: [
                    {
                      label: 'Node 2.1.2.1 - body slot',
                      body: '2-1-2-1'
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
                  label: 'Node 2.1.3 - freeze exp/sel',
                  freezeExpand: true,
                  freezeSelect: true,
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
      console.log(this.$refs.gigi.getNodeByKey('Node 2.1.1'))
    },
    onLazyLoad ({ node, key, done, fail }) {
      // call fail() if any error occurs

      setTimeout(() => {
        if (key === 'Node 2.4 - Lazy load empty') {
          done([])
          return
        }

        done([
          { label: 'Node 2.3.1', expanded: false },
          { label: 'Node 2.3.2', expanded: false },
          { label: 'Node 2.3.3', expanded: false },
          {
            label: 'Node 2.3.4',
            expanded: false,
            selected: false,
            children: [
              { label: 'Node 2.3.4.1', expanded: false, selected: true },
              { label: 'Node 2.3.4.2', expanded: false, selected: false }
            ]
          }
        ])
      }, 1000)
    }
  }
}
</script>
