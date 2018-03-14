<script>
  export default {
    name: 'q-document',
    props: {
      title: String
    },
    render (h) {
      document.title = this.title
    }
  }
</script>
