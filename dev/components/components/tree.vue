<template>
  <div>
    <div class="layout-padding">
      <p class="caption">
        <span class="desktop-only">Click</span>
        <span class="mobile-only">Tap</span>
        on items to expand/contract and especially on "Item 1.3"
        to trigger an event.
      </p>
      <p class="caption">
        Trees are stripped out of any design by default so you can
        turn them into anything you want.
      </p>

      <q-tree
        :model="treeModel"
        contract-html="<i class='material-icons'>remove_circle</i>"
        expand-html="<i class='material-icons'>add_circle</i>"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      treeModel: [
        {
          title: 'Item 1',
          expanded: true,
          icon: 'alarm',
          children: [
            {
              title: 'Item 1.1',
              expanded: false,
              children: [
                {
                  title: 'Item 1.1.1',
                  expanded: false,
                  children: [
                    {
                      title: 'Item 1.1.1.1',
                      expanded: false,
                      children: []
                    }
                  ]
                },
                {
                  title: 'Item 1.1.2',
                  expanded: false,
                  children: []
                }
              ]
            },
            {
              title: 'Item 1.2',
              expanded: false,
              children: []
            },
            {
              title: 'Item 1.3',
              expanded: false,
              handler: () => {
                this.$q.notify('Tapped on item 1.3')
              },
              children: []
            }
          ]
        },
        {
          title: 'Item 2',
          expanded: false,
          children: [
            {
              title: 'Item 2.1',
              expanded: false,
              children: [
                {
                  title: 'Item 2.1.1',
                  expanded: false,
                  children: []
                },
                {
                  title: 'Item 2.1.2',
                  expanded: false,
                  children: [
                    {
                      title: 'Item 2.1.2.1',
                      expanded: false,
                      children: []
                    },
                    {
                      title: 'Item 2.1.2.2',
                      expanded: false,
                      children: []
                    }
                  ]
                }
              ]
            },
            {
              title: 'Item 2.2',
              expanded: false,
              children: []
            },
            {
              title: 'Item 2.3 - Click to add children to it',
              expanded: false,
              handler: (item) => {
                item.children = [
                  { title: 'Item 2.3.1', expanded: false },
                  { title: 'Item 2.3.2', expanded: false },
                  { title: 'Item 2.3.3', expanded: false },
                  {
                    title: 'Item 2.3.4',
                    expanded: false,
                    children: [
                      { title: 'Item 2.3.4.1', expanded: false },
                      { title: 'Item 2.3.4.2', expanded: false }
                    ]
                  }
                ]
                item.expanded = true
                const prevTitle = item.title
                const prevHandler = item.handler
                item.title = 'Item 2.3 - Click to remove children from it'
                item.handler = (item) => {
                  item.title = prevTitle
                  delete item.children
                  item.handler = prevHandler
                  this.$q.notify('Children removed')
                }
                this.$q.notify('Children added')
              }
            }
          ]
        }
      ]
    }
  }
}
</script>
