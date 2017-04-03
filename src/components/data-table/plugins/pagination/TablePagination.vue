<template>
  <div class="q-data-table-toolbar bottom-toolbar row reverse-wrap items-center justify-end">
    <div>
      {{labels.rows}}
      <q-select
        v-model="pagination.rowsPerPage"
        :options="pagination.options"
        @input="resetPage"
        class="text-right inline no-margin"
        simple
      ></q-select>
    </div>
    <div v-if="entries > 0">
      {{start}} - {{end}} / {{entries}}
    </div>
    <q-pagination
      v-if="pagination.rowsPerPage > 0"
      v-model="pagination.page"
      :max="max"
    ></q-pagination>
  </div>
</template>

<script>
import { QSelect } from '../../../select'
import { QPagination } from '../../../pagination'

export default {
  name: 'q-table-pagination',
  components: {
    QSelect,
    QPagination
  },
  props: ['pagination', 'entries', 'labels'],
  watch: {
    entries () {
      this.resetPage()
    }
  },
  computed: {
    start () {
      return (this.pagination.page - 1) * this.pagination.rowsPerPage + 1
    },
    end () {
      if (this.pagination.page === this.max || this.pagination.rowsPerPage === 0) {
        return this.entries
      }
      return this.pagination.page * this.pagination.rowsPerPage
    },
    max () {
      return Math.max(1, Math.ceil(this.entries / this.pagination.rowsPerPage))
    }
  },
  methods: {
    resetPage () {
      this.pagination.page = 1
    }
  }
}
</script>
