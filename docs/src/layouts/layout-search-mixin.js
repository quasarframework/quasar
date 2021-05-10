import { apiTypeToComponentMap } from 'components/AppSearchResults'
import ResultEmpty from 'components/search-results/ResultEmpty'
import ResultError from 'components/search-results/ResultError'

let requestId = 0

function fetchQuery (val, onResult, onError) {
  requestId++
  const localRequestId = requestId

  const xhr = new XMLHttpRequest()
  const data = JSON.stringify({
    q: val, limit: 10, cropLength: 50, attributesToCrop: [ 'content' ], attributesToHighlight: [ 'content' ]
  })

  xhr.addEventListener('load', function () {
    // console.log(this.responseText)
    // console.log(JSON.parse(this.responseText))
    localRequestId === requestId && onResult(JSON.parse(this.responseText))
  })

  xhr.addEventListener('error', () => {
    localRequestId === requestId && onError()
  })

  xhr.open('POST', 'https://search.quasar.dev/indexes/quasar-v1/search')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('X-Meili-API-Key', 'a7c3283824a29d1b0e8042f0266690670b00f7c81d92021b80117563577d2106')
  xhr.send(data)
}

export default {
  mounted () {
    // If we have a search string in the query (mostly from tab-to-search functionality),
    // we need to open the drawer to fill in the search string in the input later
    const searchQuery = this.$route.query.search

    if (searchQuery) {
      this.leftDrawerState = true
    }

    if (this.$q.platform.is.desktop === true) {
      window.addEventListener('keypress', this.focusOnSearch)
    }

    if (searchQuery) {
      // Here we put search string from query into the input and open the search popup.
      // Unfortunately, this input is managed completely by Meilisearch and their code doesn't seem to
      // have a method of opening the popup programmatically, so we need to simulate typing on that input element.
      // We also need to dispatch the event only after the input text is populated and Vue will
      // do that in next render, so we schedule it on the next event loop iteration with setTimeout.
      this.searchTerms = searchQuery
    }
  },

  beforeDestroy () {
    if (this.$q.platform.is.desktop === true) {
      window.removeEventListener('keypress', this.focusOnSearch)
    }
  },

  data () {
    return {
      searchTerms: '',
      searchResults: null,
      searchHasFocus: false,
      searchActiveId: null
    }
  },

  watch: {
    searchTerms (val) {
      if (!val) {
        this.resetSearch()
      }
      else {
        fetchQuery(
          val,
          response => {
            this.searchResults = this.parseSearchResults(response.hits)
          },
          () => {
            this.searchResults = {
              masterComponent: ResultError
            }
          }
        )
      }
    }
  },

  methods: {
    onSearchKeydown (evt) {
      if (this.$q.platform.is.desktop !== true) {
        return
      }

      switch (evt.keyCode) {
        case 27: // escape
          evt.preventDefault()
          this.resetSearch()
          break
        case 38: // up
        case 40: // down
          evt.preventDefault()
          if (this.searchResults !== null) {
            if (this.searchActiveId === null) {
              this.searchActiveId = this.searchResults.ids[0]
            }
            else {
              const ids = this.searchResults.ids
              const index = ids.indexOf(this.searchActiveId)
              this.searchActiveId = ids[(ids.length + index + (evt.keyCode === 38 ? -1 : 1)) % ids.length]
            }

            const target = document.getElementById(this.searchActiveId)
            if (target.scrollIntoViewIfNeeded) {
              target.scrollIntoViewIfNeeded()
            }
            else {
              target.scrollIntoView({ block: 'center' })
            }
          }
          break
        case 13: // enter
          evt.preventDefault()
          evt.stopPropagation()
          if (this.searchResults !== null && this.searchActiveId !== null) {
            document.getElementById(this.searchActiveId).click(evt)
          }
          break
      }
    },

    onSearchFocus () {
      this.searchHasFocus = true
    },

    onSearchBlur () {
      this.searchHasFocus = false
      this.searchActiveId = null
    },

    resetSearch () {
      this.searchTerms = ''
      this.searchResults = null
      this.searchActiveId = null
    },

    onSearchClear () {
      this.resetSearch()
      this.$refs.searchInputRef.focus()
    },

    focusOnSearch (evt) {
      if (
        evt.target.tagName !== 'INPUT' &&
        String.fromCharCode(evt.keyCode) === '/'
      ) {
        evt.preventDefault()

        if (this.leftDrawerState !== true) {
          this.leftDrawerState = true
        }

        setTimeout(() => {
          this.$refs.searchInputRef.focus()
        })
      }
    },

    parseSearchResults (hits) {
      if (hits.length === 0) {
        return { masterComponent: ResultEmpty }
      }

      const acc = {
        groupList: [],
        entries: {},
        ids: []
      }

      hits.forEach(hit => {
        const component = apiTypeToComponentMap[hit.type || 'page-content']

        // if we don't know how to display this API type then just abort
        if (component === void 0) {
          return
        }

        if (acc.entries[hit.group] === void 0) {
          acc.groupList.push(hit.group)
          acc.entries[hit.group] = []
        }

        const entry = {
          component: component.name,
          ...component.extractProps(hit),

          onMouseenter: () => {
            if (this.searchHasFocus === true) {
              this.searchActiveId = entry.id
            }
          },
          onClick: () => {
            this.$router.push(hit.url).catch(() => {})
            this.searchTerms = ''
            this.$refs.searchInputRef.blur()
          }
        }

        acc.entries[hit.group].push(entry)
      })

      // ensure that the ids are assigned in the right order
      // otherwise keyboard up/down will not work correctly
      let globalId = 0
      acc.groupList.forEach(group => {
        acc.entries[group].forEach(hit => {
          const id = 'search--' + (++globalId)
          hit.id = id
          acc.ids.push(id)
        })
      })

      return acc
    }
  }
}
