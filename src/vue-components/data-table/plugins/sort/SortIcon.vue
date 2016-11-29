<template>
  <i class="cursor-pointer">{{icon}}</i>
</template>

<script>
export default {
  props: {
    field: String,
    sorting: Object
  },
  computed: {
    icon () {
      if (this.sorting.field !== this.field) {
        return 'import_export'
      }
      return this.sorting.dir === 1 ? 'arrow_downward' : 'arrow_upward'
    }
  }
}
</script>
