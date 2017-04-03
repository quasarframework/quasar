<template>
  <q-icon :name="icon" class="cursor-pointer"></q-icon>
</template>

<script>
import { QIcon } from '../../../icon'

export default {
  name: 'q-sort-icon',
  components: {
    QIcon
  },
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
