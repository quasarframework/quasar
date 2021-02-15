import { provideDocStore } from 'src/assets/doc-store'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
// import { ref } from 'vue'

export default function useAlgolia (scope, $q, $route) {
  const search = ref('')
  const searchFocused = ref(false)
  const algoliaInputRef = ref(null)

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
        algoliaInputRef.value.focus()
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

    // import(
    //   /* webpackChunkName: "algolia" */
    //   'docsearch.js'
    // ).then(docsearch => {
    //   docsearch.default({
    //     apiKey: '5c15f3938ef24ae49e3a0e69dc4a140f',
    //     indexName: 'quasar-framework',
    //     inputSelector: '.doc-algolia input',
    //     algoliaOptions: {
    //       hitsPerPage: 7
    //     },
    //     handleSelected: (a, b, suggestion, c, context) => {
    //       const url = suggestion.url.replace('https://quasar.dev', '')

    //       search.value = ''
    //       $router.push(url).catch(() => {})
    //       algoliaInputRef.value.blur()
    //     }
    //   })
    import(
      /* webpackChunkName: "algolia" */
      'docs-searchbar.js'
    ).then(docsearch => {
      // console.log({
      //   apiKey: process.env.search.apiKey,
      //   hostUrl: process.env.search.hostUrl,
      //   indexName: process.env.search.indexUid,
      //   inputSelector: process.env.search.inputSelector,
      //   debug: process.env.search.debug,
      // })
      docsearch.default({
        apiKey: process.env.search.apiKey,
        hostUrl: process.env.search.hostUrl,
        indexUid: process.env.search.indexUid,
        inputSelector: process.env.search.inputSelector,
        debug: process.env.search.debug,
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
         * @param {Any} context additional information about the selection. Contains a .selectionMethod key that can be either click, enterKey, tabKey or blur, depending on how the suggestion was selected.
         */
        handleSelected: (input, event, suggestion, datasetNumber, context) => {
          const url = suggestion.url.replace('https://quasar.dev', '')

          search.value = ''
          $router.push(url).catch(() => {})
          algoliaInputRef.value.blur()
        }
      })

      if ($q.platform.is.desktop === true) {
        window.addEventListener('keypress', focusOnSearch)
      }

      if (searchQuery) {
        // Here we put search string from query into the input and open the search popup.
        // Unfortunately, this input is managed completely by Algolia and their code doesn't seem to
        // have a method of opening the popup programmatically, so we need to simulate typing on that input element.
        // We also need to dispatch the event only after the input text is populated and Vue will
        // do that in next render, so we schedule it on the next event loop iteration with setTimeout.
        search.value = searchQuery
        algoliaInputRef.value.focus()
        setTimeout(() => {
          algoliaInputRef.value.$refs.input.dispatchEvent(new Event('input', {}))
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
    algoliaInputRef,

    searchPlaceholder: 'Search is not available yet',
    // searchPlaceholder: computed(() => {
    //   return searchFocused.value === true
    //     ? 'Type to start searching...'
    //     : ($q.platform.is.desktop === true ? 'Type \' / \' to focus here...' : 'Search...')
    // }),

    onSearchFocus () {
      searchFocused.value = true
    },

    onSearchBlur () {
      searchFocused.value = false
    }
  })
}
