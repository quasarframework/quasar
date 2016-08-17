<template>
  <div class="column group">
    <button
      class="primary"
      v-for="page in pages"
      v-link="link(page)"
    >
      {{page}}
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pages: [
        'Action Sheet',
        'Buttons',
        'Card',
        'Chat',
        'Collapsible',
        'CSS Elements',
        'Dialog',
        'Dropdown',
        'Fab',
        'Flex',
        'Form',
        'Grid',
        'Infinite Scroll',
        'Loading',
        'Label',
        'List',
        'Modal',
        'Pagination',
        'Parallax',
        'Progress',
        'Pull to Refresh',
        'Rating',
        'Scroll Fire',
        'Slider',
        'Spinners',
        'Table',
        'Tabs',
        'Timeline',
        'Toast',
        'Tree',
        'Typography'
      ]
    }
  },
  methods: {
    link (page) {
      return page.toLowerCase().replace(/ /g, '-')
    }
  }
}
</script>
