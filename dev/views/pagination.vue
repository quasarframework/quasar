<template>
  <h1>Pagination</h1>
  <p>Page: {{page}}</p>
  <pagination :model.sync="page" :max="17"></pagination>
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
