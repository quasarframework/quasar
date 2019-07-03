<template>
  <div>
    <q-input
      outlined
      dense
      debounce="300"
      v-model="filter"
      placeholder="Search"
      style="max-width: 300px"
      @input="query"
      :loading="loading"
      :error="errorMessage !== null"
      :error-message="errorMessage"
      hint="Discover official and community App Extensions"
      ref="searchInput"
    >
      <template v-slot:append>
        <q-icon
          class="cursor-pointer"
          :name="filter !== '' ? 'clear' : 'search'"
          @click="searchIconClick"
        />
      </template>
    </q-input>

    <q-list
      v-if="results.length > 0"
      class="q-mt-md bg-white rounded-borders"
      bordered
      separator
    >
      <q-item
        v-for="item in results"
        :key="item.name"
        clickable
        tag="a"
        :href="item.links"
        target="_blank"
        rel="noopener"
      >
        <q-item-section>
          <q-item-label class="q-gutter-sm">
            <strong>{{ item.extId }}</strong>
            <q-badge>{{ item.version }}</q-badge>
            <q-badge v-if="item.official" color="purple">official</q-badge>
          </q-item-label>
          <q-item-label>
            {{ item.description }}
          </q-item-label>
          <q-item-label caption>
            <em>by {{ item.author }}</em>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filter: '',
      errorMessage: null,
      results: [],
      loading: false
    }
  },

  watch: {
    filter (val) {
      if (val === '') {
        this.loading = false
        this.results = []
        this.errorMessage = null
      }
    }
  },

  methods: {
    searchIconClick () {
      if (this.filter !== '') {
        this.filter = ''
      }
      this.$refs.searchInput.focus()
    },

    query (filter) {
      if (this.xhr !== void 0) {
        this.xhr.abort()
        this.xhr = void 0
      }

      if (filter === '') {
        return
      }

      this.loading = true
      this.results = []

      const self = this
      const xhr = new XMLHttpRequest()

      xhr.addEventListener('load', function () {
        self.loading = false
        const json = JSON.parse(this.responseText)

        if (json.code !== void 0 || json.results === void 0) {
          self.errorMessage = 'NPM API service is currently unavailable. Please try again later.'
          return
        }

        if (json.results.length === 0) {
          self.errorMessage = 'Sorry, nothing found. Please refine search terms.'
          return
        }

        self.errorMessage = null
        self.results = json.results.map(item => {
          item = item.package

          item.official = item.name.startsWith('@quasar/')
          item.extId = item.name.replace('quasar-app-extension-', '')
          item.author = Object(item.author) === item.author
            ? item.author.name
            : item.author
          item.links = item.links.homepage || item.links.repository || item.links.npm

          return item
        })
      })
      xhr.addEventListener('error', () => {
        this.loading = false
        this.errorMessage = 'Cannot connect to NPM. Please try again later.'
      })

      const q = encodeURI('quasar-app-extension ' + filter)
      xhr.open('GET', `https://api.npms.io/v2/search?q=${q}&size=30`)
      xhr.send()

      this.xhr = xhr
    }
  }
}
</script>
