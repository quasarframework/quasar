<template>
  <h1>Pagination</h1>
  <p>Page: {{page}}</p>
  <quasar-pagination :model.sync="page" :max="17"></quasar-pagination>
</template>

<script>
export default {
  data () {
    return {
      page: 1
    }
  }
}
</script>
