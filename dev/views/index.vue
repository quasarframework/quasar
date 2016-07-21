<template>
  <div class="column">
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
        'Flex',
        'Form',
        'Loading',
        'Label',
        'List',
        'Modal',
        'Notify',
        'Pagination',
        'Progressbar',
        'Rating',
        'Spinners',
        'Table',
        'Timeline',
        'Tree',
        'Typography'
      ]
    }
  },
  methods: {
    link (page) {
      return page.toLowerCase().replace(/ /, '-')
    }
  }
}
</script>
