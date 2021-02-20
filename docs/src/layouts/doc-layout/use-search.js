import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

function fetchQuery (val, onResult, onError) {
  const xhr = new XMLHttpRequest()
  const data = JSON.stringify({
    q: val, limit: 7, cropLength: 30, attributesToCrop: ['content'], attributesToHighlight: ['*']
  })

  xhr.addEventListener('load', function () {
    onResult(JSON.parse(this.responseText))
  })

  xhr.addEventListener('error', () => {
    onError()
  })

  xhr.open('POST', 'https://search.quasar.dev/indexes/quasar-v2/search')
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('X-Meili-API-Key', 'a7c3283824a29d1b0e8042f0266690670b00f7c81d92021b80117563577d2106')
  xhr.send(data)
}

const contentRE = /(<em>|<\/em>)/

function parseContent (str) {
  let inToken = false
  const acc = []
  str.split(contentRE).forEach(str => {
    if (str === '') {
      inToken = true
    }
    else if (str !== '<em>' && str !== '</em>') {
      acc.push({
        str,
        class: inToken ? 'app-search__result-content--token' : null
      })
      inToken = !inToken
    }
  })
  return acc
}

export default function useSearch (scope, $q, $route) {
  const searchTerms = ref('')
  const searchResults = ref(null)
  const searchIsUnfocused = ref(true)
  const searchInputRef = ref(null)

  const $router = useRouter()

  function parseResults (hits) {
    const acc = {
      categories: [],
      data: {}
    }

    hits.forEach(entry => {
      const hit = entry._formatted

      if (acc.data[ hit.l0 ] === void 0) {
        acc.categories.push(hit.l0)
        acc.data[ hit.l0 ] = []
      }

      acc.data[ hit.l0 ].push({
        id: hit.objectID,
        title: [ hit.l1, hit.l2, hit.l3, hit.l4, hit.l5 ].filter(e => e).join(' » '),
        content: parseContent(hit.content),
        onClick () {
          searchTerms.value = ''
          searchInputRef.value.blur()
          $router.push(hit.url + '#' + hit.anchor).catch(() => {})
        }
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
      searchTerms.value = ''

      if (scope.leftDrawerState.value !== true) {
        scope.leftDrawerState.value = true
      }

      setTimeout(() => {
        searchInputRef.value.focus()
      })
    }
  }

  function onSearchFocus () {
    searchIsUnfocused.value = false
  }

  function onSearchBlur () {
    searchIsUnfocused.value = true
  }

  function resetSearch () {
    searchTerms.value = ''
    searchResults.value = null
  }

  function onSearchClear () {
    resetSearch()
    searchInputRef.value.focus()
  }

  function onSearchKeydown (evt) {
    switch (evt.keyCode) {
      case 27: // escape
        resetSearch()
        break
      case 38: // up
      case 40: // down
        break
      case 13: // enter
        break
    }
  }

  function onResult (response) {
    searchResults.value = parseResults(response.hits)
  }

  function onError () {}

  watch(searchTerms, val => {
    if (!val) {
      resetSearch()
    }
    else if (val.length > 1) {
      fetchQuery(val, onResult, onError)
      // onResult(hardcoded)
    }
  })

  // onResult(hardcoded)

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
    searchIsUnfocused,
    searchInputRef,
    resetSearch,
    onSearchKeydown,
    onSearchFocus,
    onSearchBlur,
    onSearchClear
  })
}
