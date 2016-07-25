<template>
  <tree
    :model="treeModel"
    contract-html="<i>remove_circle</i>"
    expand-html="<i>add_circle</i>"
  ></tree>
</template>

<script>
import { Notify } from 'quasar'

export default {
  data () {
    return {
      treeModel: [
        {
          title: 'Item 1',
          expanded: true,
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
              handler () { Notify.create('Tapped on item 1.3') },
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
              title: 'Item 2.3',
              expanded: false,
              children: []
            }
          ]
        }
      ]
    }
  }
}
</script>
