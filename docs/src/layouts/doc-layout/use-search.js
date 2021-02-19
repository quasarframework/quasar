import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

export default function useSearch (scope, $q, $route) {
  const search = ref('')
  const searchFocused = ref(false)
  const searchInputRef = ref(null)

  function focusOnSearch (evt) {
    if (
      evt.target.tagName !== 'INPUT' &&
      String.fromCharCode(evt.keyCode) === '/'
    ) {
      evt.preventDefault()
      search.value = ''

      if (scope.leftDrawerState.value !== true) {
        scope.leftDrawerState.value = true
      }

      setTimeout(() => {
        searchInputRef.value.focus()
      })
    }
  }

  onMounted(() => {
    const $router = useRouter()

    // If we have a search string in the query (mostly from tab-to-search functionality),
    // we need to open the drawer to fill in the search string in the input later
    const searchQuery = $route.query.search

    if (searchQuery) {
      scope.leftDrawerState.value = true
    }

    import(
      /* webpackChunkName: "search" */
      'docs-searchbar.js/dist/npm/index'
    ).then(docsearch => {
      docsearch.default({
        apiKey: 'a7c3283824a29d1b0e8042f0266690670b00f7c81d92021b80117563577d2106',
        hostUrl: 'https://search.quasar.dev',
        indexUid: 'quasar-v2',
        inputSelector: '.doc-search input',
        // layout: 'simple',
        debug: false,
        meilisearchOptions: {
          limit: 7
        },
        // autocompleteOptions: {
        // }
        /**
         * queryHook takes a callback function as value. This function will be
         * called on every keystroke to transform the typed keywords before
         * querying MeiliSearch. By default, it does not do anything, but it
         * is the perfect place for you to add some preprocessing or custom
         * functionality.
         */
        // queryHook () {
        // },
        /**
         * transformData takes a callback function as value. This function
         * will be called on every hit before displaying them. By default,
         * it does not do anything, but it lets you add any post-processing
         * around the data you received from MeiliSearch.
         */
        // transformData () {
        // },
        /**
         * https://github.com/meilisearch/docs-searchbar.js#handleselected-
         * @param {Element} input a reference to the search input element. It comes with the .open(), .close(), .getVal() and .setVal() methods.
         * @param {Event} event the actual event triggering the selection.
         * @param {Object} suggestion the object representing the current selection. It contains a .url key representing the destination.
         * @param {Number} datasetNumber this should always be equal to 1 as docs-searchbar.js is searching into one dataset at a time. You can ignore this attribute.
         * @param {Object} context additional information about the selection. Contains a .selectionMethod key that can be either click, enterKey, tabKey or blur, depending on how the suggestion was selected.
         */
        handleSelected: (input, event, suggestion, datasetNumber, context) => {
          debugger
          const url = suggestion.url.replace('https://next.quasar.dev', '')

          search.value = ''
          $router.push(url).catch(() => {})
          searchInputRef.value.blur()
        }
      })

      if ($q.platform.is.desktop === true) {
        window.addEventListener('keypress', focusOnSearch)
      }

      if (searchQuery) {
        // Here we put search string from query into the input and open the search popup.
        // Unfortunately, this input is managed completely by Meilisearch and their code doesn't seem to
        // have a method of opening the popup programmatically, so we need to simulate typing on that input element.
        // We also need to dispatch the event only after the input text is populated and Vue will
        // do that in next render, so we schedule it on the next event loop iteration with setTimeout.
        search.value = searchQuery
        searchInputRef.value.focus()
        setTimeout(() => {
          searchInputRef.value.$refs.input.dispatchEvent(new Event('input', {}))
        })
      }
    })
  })

  onBeforeUnmount(() => {
    if ($q.platform.is.desktop === true) {
      window.removeEventListener('keypress', focusOnSearch)
    }
  })

  Object.assign(scope, {
    search,
    searchInputRef,

    // searchPlaceholder: 'Search is not available yet',
    searchPlaceholder: computed(() => {
      return searchFocused.value === true
        ? 'Type to start searching...'
        : ($q.platform.is.desktop === true ? 'Type \' / \' to focus here...' : 'Search...')
    }),

    onSearchFocus () {
      searchFocused.value = true
    },

    onSearchBlur () {
      searchFocused.value = false
    }
  })
}
