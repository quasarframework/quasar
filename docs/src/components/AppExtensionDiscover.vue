<template>
  <div class="q-pa-md">
    <q-table
      title="App Extensions"
      :data="data"
      :columns="columns"
      row-key="__index"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click.native="onPackageClick(props.row)" class="cursor-pointer">
          <q-td key="package" :props="props">
              {{ props.row.package.name }}
              <q-badge color="primary">{{ props.row.package.version }}</q-badge>
              <q-badge v-for="(flag, value) in props.row.flags" :key="flag" color="secondary" class="q-ml-xs">
                  {{ value || flag }}
              </q-badge>
          </q-td>
          <q-td key="author" :props="props">{{ props.row.package.author.name }}</q-td>
          <q-tooltip>
            {{ props.row.package.description }}
          </q-tooltip>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script>
import axios from 'axios'
import { openURL } from 'quasar'

export default {
  data () {
    return {
      filter: null,
      loading: false,
      data: [],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 25,
        rowsNumber: null
      },
      columns: [
        {
          name: 'package',
          label: 'Package',
          align: 'left'
        },
        {
          name: 'author',
          label: 'Author',
          align: 'left'
        }
      ]
    }
  },
  methods: {
    onPackageClick (data) {
      openURL(data.package.links.homepage || data.package.links.repository || data.package.links.npm)
    },

    onRequest (props) {
      let {
        page,
        rowsPerPage,
        sortBy,
        descending
      } = props.pagination
      let filter = props.filter

      this.loading = true

      // don't forget to update local pagination object
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      // fetch data from server
      this.query(filter)
        .then(response => {
          // clear out existing data and add new
          this.data.splice(0, this.data.length, ...response.data.results)
          this.pagination.rowsNumber = response.data.total

          // ...and turn of loading indicator
          this.loading = false
        })
    },

    query (filter) {
      return axios
        .get('https://api.npms.io/v2/search', {
          params: {
            q: 'quasar app extension ' + filter,
            from: (this.pagination.page - 1) * this.pagination.rowsPerPage,
            size: this.pagination.rowsPerPage
          }
        })
    }
  }
}
</script>
