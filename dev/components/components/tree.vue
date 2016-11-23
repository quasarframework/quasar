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
        contract-html="<i>remove_circle</i>"
        expand-html="<i>add_circle</i>"
      ></q-tree>
    </div>
  </div>
</template>

<script>
import { Toast } from 'quasar'

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
              handler () {
                Toast.create('Tapped on item 1.3')
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
