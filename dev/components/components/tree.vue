<template>
  <div>
    <div class="layout-padding">
      <h1>WIP</h1>
      <div class="row sm-gutter items-center">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="selection" :options="[{label: 'None', value: 'none'}, {label: 'Single', value: 'single'}, {label: 'Multiple', value: 'multiple'}]" stack-label="Selection" />
        </div>
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-btn @click="getNodeByKey" no-caps label="getNodeByKey test" />
        </div>
      </div>

      <q-tree
        v-model="treeModel"
        ref="gigi"
        node-key="label"
        :selection="selection"
        @expand="onExpand"
        @select="onSelect"
        @lazyLoad="onLazyLoad"
      >
        <div slot="body-2-1-2-1" slot-scope="prop" class="text-italic text-faded">
          Content for 2-1-2-1: {{prop.key}}
        </div>
      </q-tree>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selection: 'multiple',
      treeModel: [
        {
          label: 'Node 1',
          expanded: false,
          selected: false,
          icon: 'alarm',
          children: [
            {
              label: 'Node 1.1',
              expanded: false,
              selected: false,
              children: [
                {
                  label: 'Node 1.1.1',
                  expanded: false,
                  selected: false,
                  children: [
                    {
                      label: 'Node 1.1.1.1',
                      expanded: false,
                      selected: false
                    }
                  ]
                },
                {
                  label: 'Node 1.1.2',
                  expanded: false,
                  selected: false
                }
              ]
            },
            {
              label: 'Node 1.2',
              expanded: false,
              selected: false
            },
            {
              label: 'Node 1.3',
              expanded: false,
              selected: false,
              handler: () => {
                this.$q.notify('Tapped on node 1.3')
              }
            }
          ]
        },
        {
          label: 'Node 2',
          expanded: true,
          selected: false,
          children: [
            {
              label: 'Node 2.1',
              expanded: false,
              selected: false,
              children: [
                {
                  label: 'Node 2.1.1',
                  expanded: false,
                  selected: false
                },
                {
                  label: 'Node 2.1.2',
                  expanded: true,
                  selected: false,
                  children: [
                    {
                      label: 'Node 2.1.2.1 - body slot',
                      expanded: true,
                      selected: false,
                      body: '2-1-2-1'
                    },
                    {
                      label: 'Node 2.1.2.2 - body slot & children',
                      expanded: true,
                      selected: false,
                      body: '2-1-2-1',
                      children: [
                        {
                          label: 'Node 2.1.2.2.1',
                          expanded: false,
                          selected: false
                        },
                        {
                          label: 'Node 2.1.2.2.2',
                          expanded: false,
                          selected: false
                        }
                      ]
                    },
                    {
                      label: 'Node 2.1.2.3 - header slot',
                      expanded: false,
                      selected: false,
                      header: '2-1-2-2'
                    }
                  ]
                },
                {
                  label: 'Node 2.1.3 - freeze exp/sel',
                  expanded: true,
                  selected: false,
                  freezeExpand: true,
                  freezeSelect: true,
                  children: [
                    {
                      label: 'Node 2.1.3.1',
                      expanded: true,
                      selected: false
                    },
                    {
                      label: 'Node 2.1.3.2',
                      expanded: false,
                      selected: false
                    }
                  ]
                },
                {
                  label: 'Node 2.1.4 - Disabled',
                  expanded: true,
                  selected: false,
                  disabled: true,
                  children: [
                    {
                      label: 'Node 2.1.4.1',
                      expanded: true,
                      selected: false
                    },
                    {
                      label: 'Node 2.1.4.2',
                      expanded: false,
                      selected: false
                    }
                  ]
                }
              ]
            },
            {
              label: 'Node 2.2',
              expanded: false,
              selected: false
            },
            {
              label: 'Node 2.3 - Lazy load',
              expanded: false,
              selected: false,
              lazyLoad: true
            },
            {
              label: 'Node 2.4 - Lazy load empty',
              expanded: false,
              selected: false,
              children: [],
              lazyLoad: true
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
    onExpand ({ node, key }) {
      console.log(`@expand(${node.expanded})`, key, node)
    },
    onSelect ({ node, key }) {
      console.log(`@select(${node.selected})`, key, node)
    },
    onLazyLoad ({ node, key, done }) {
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
