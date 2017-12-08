<template>
  <div>
    <div class="layout-padding">
      <h1>WIP</h1>
      <div class="row sm-gutter items-center">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
          <q-select v-model="selection" :options="[{label: 'None', value: 'none'}, {label: 'Single', value: 'single'}, {label: 'Multiple', value: 'multiple'}]" stack-label="Selection" />
        </div>
      </div>

      <q-tree
        v-model="treeModel"
        node-key="label"
        :selection="selection"
        @expand="onExpand"
        @select="onSelect"
      >
        <div slot="content-2-1-2-1" slot-scope="prop">
          Content for 2-1-2-1: {{prop.node.__key}}
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
          expanded: true,
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
              expanded: true,
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
                      label: 'Node 2.1.2.1',
                      expanded: true,
                      selected: false,
                      body: '2-1-2-1'
                    },
                    {
                      label: 'Node 2.1.2.2',
                      expanded: false,
                      selected: false,
                      header: '2-1-2-2'
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
              lazyLoad: node => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    node.children = [
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
                    ]
                    /*
                    const prevLabel = node.label
                    const prevHandler = node.handler
                    node.label = 'Node 2.3 - Click to remove children from it'
                    node.handler = node => {
                      node.label = prevLabel
                      node.children = []
                      node.handler = prevHandler
                      this.$q.notify('Children removed')
                    } */
                    this.$q.notify('Children added')
                    resolve()
                  }, 2000)
                })
              }
            },
            {
              label: 'Node 2.4 - Lazy load empty',
              expanded: false,
              selected: false,
              children: [],
              lazyLoad: node => {
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    node.children = []
                    resolve()
                  }, 2000)
                })
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    onExpand (node, val) {
      console.log(`@expand(${val})`, node.__key, node)
    },
    onSelect (node, val) {
      console.log(`@select(${val})`, node.__key, node)
    }
  }
}
</script>
