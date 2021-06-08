import { ref, watch, onMounted, onBeforeUnmount, markRaw } from 'vue'
import { useRouter } from 'vue-router'

import { apiTypeToComponentMap } from 'components/AppSearchResults'
import ResultEmpty from 'components/search-results/ResultEmpty'
import ResultError from 'components/search-results/ResultError'

let requestId = 0

function fetchQuery (val, onResult, onError) {
  requestId++
  const localRequestId = requestId

  const xhr = new XMLHttpRequest()
  const data = JSON.stringify({
    q: val, limit: 10, cropLength: 50, attributesToCrop: ['content'], attributesToHighlight: ['content']
  })

  xhr.addEventListener('load', function () {
    // console.log(this.responseText)
    // console.log(JSON.parse(this.responseText))
    localRequestId === requestId && onResult(JSON.parse(this.responseText))
  })

  xhr.addEventListener('error', () => {
    localRequestId === requestId && onError()
  })

  xhr.open('POST', 'https://search.quasar.dev/indexes/quasar-v2/search')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('X-Meili-API-Key', 'a7c3283824a29d1b0e8042f0266690670b00f7c81d92021b80117563577d2106')
  xhr.send(data)
}

export default function useSearch (scope, $q, $route) {
  const searchTerms = ref('')
  const searchResults = ref(null)
  const searchHasFocus = ref(false)
  const searchActiveId = ref(null)
  const searchInputRef = ref(null)

  const $router = useRouter()

  function parseResults (hits) {
    if (hits.length === 0) {
      return { masterComponent: markRaw(ResultEmpty) }
    }

    const acc = {
      groupList: [],
      entries: {},
      ids: []
    }

    hits.forEach(hit => {
      const component = apiTypeToComponentMap[ hit.type || 'page-content' ]

      // if we don't know how to display this API type then just abort
      if (component === void 0) {
        return
      }

      if (acc.entries[ hit.group ] === void 0) {
        acc.groupList.push(hit.group)
        acc.entries[ hit.group ] = []
      }

      const entry = {
        component: component.name,
        ...component.extractProps(hit),

        onMouseenter () {
          if (searchHasFocus.value === true) {
            searchActiveId.value = entry.id
          }
        },
        onClick () {
          $router.push(hit.url).catch(() => {})
          searchTerms.value = ''
          searchInputRef.value.blur()
        }
      }

      acc.entries[ hit.group ].push(entry)
    })

    // ensure that the ids are assigned in the right order
    // otherwise keyboard up/down will not work correctly
    let globalId = 0
    acc.groupList.forEach(group => {
      acc.entries[ group ].forEach(hit => {
        const id = 'search--' + (++globalId)
        hit.id = id
        acc.ids.push(id)
      })
    })

    return acc
  }

  function focusOnSearch (evt) {
    if (
      evt.target.tagName !== 'INPUT' &&
      String.fromCharCode(evt.keyCode) === '/'
    ) {
      evt.preventDefault()

      if (scope.leftDrawerState.value !== true) {
        scope.leftDrawerState.value = true
      }

      setTimeout(() => {
        searchInputRef.value.focus()
      })
    }
  }

  function onSearchFocus () {
    searchHasFocus.value = true
  }

  function onSearchBlur () {
    searchHasFocus.value = false
    searchActiveId.value = null
  }

  function resetSearch () {
    searchTerms.value = ''
    searchResults.value = null
    searchActiveId.value = null
  }

  function onSearchClear () {
    resetSearch()
    searchInputRef.value.focus()
  }

  const onSearchKeydown = $q.platform.is.desktop === true
    ? evt => {
      switch (evt.keyCode) {
        case 27: // escape
          evt.preventDefault()
          resetSearch()
          break
        case 38: // up
        case 40: // down
          evt.preventDefault()
          if (searchResults.value !== null) {
            if (searchActiveId.value === null) {
              searchActiveId.value = searchResults.value.ids[ 0 ]
            }
            else {
              const ids = searchResults.value.ids
              const index = ids.indexOf(searchActiveId.value)
              searchActiveId.value = ids[ (ids.length + index + (evt.keyCode === 38 ? -1 : 1)) % ids.length ]
            }

            const target = document.getElementById(searchActiveId.value)
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
          if (searchResults.value !== null && searchActiveId.value !== null) {
            document.getElementById(searchActiveId.value).click(evt)
          }
          break
      }
    }
    : () => {}

  function onResultSuccess (response) {
    searchResults.value = parseResults(response.hits)
  }

  function onResultError () {
    searchResults.value = { masterComponent: markRaw(ResultError) }
  }

  watch(searchTerms, val => {
    if (!val) {
      resetSearch()
    }
    else {
      fetchQuery(val, onResultSuccess, onResultError)
    }
  })

  onMounted(() => {
    // If we have a search string in the query (mostly from tab-to-search functionality),
    // we need to open the drawer to fill in the search string in the input later
    const searchQuery = $route.query.search

    if (searchQuery) {
      scope.leftDrawerState.value = true
    }

    if ($q.platform.is.desktop === true) {
      window.addEventListener('keypress', focusOnSearch)
    }

    if (searchQuery) {
      // Here we put search string from query into the input and open the search popup.
      // Unfortunately, this input is managed completely by Meilisearch and their code doesn't seem to
      // have a method of opening the popup programmatically, so we need to simulate typing on that input element.
      // We also need to dispatch the event only after the input text is populated and Vue will
      // do that in next render, so we schedule it on the next event loop iteration with setTimeout.
      searchTerms.value = searchQuery
    }
  })

  $q.platform.is.desktop === true && onBeforeUnmount(() => {
    window.removeEventListener('keypress', focusOnSearch)
  })

  Object.assign(scope, {
    searchTerms,
    searchResults,
    searchHasFocus,
    searchActiveId,
    searchInputRef,
    resetSearch,
    onSearchKeydown,
    onSearchFocus,
    onSearchBlur,
    onSearchClear
  })
}
