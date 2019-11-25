<template lang="pug">
q-card
  img(src="https://cdn.quasar.dev/img/mountains.jpg" style="max-height: 200px")
  q-card-section
    .text-h6 Card title
  q-card-section {{ lorem }}
  q-card-actions
    q-btn(flat) Action 1
    q-btn(flat) Action 2

</template>

<script>
export default {
  data () {
    return {
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  }
}
</script>
