// import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default function useAlgolia (scope/* , $q, $route */) {
  const search = ref('')
  const searchFocused = ref(false)
  const algoliaInputRef = ref(null)

  // function focusOnSearch (evt) {
  //   if (
  //     evt.target.tagName !== 'INPUT' &&
  //     String.fromCharCode(evt.keyCode) === '/'
  //   ) {
  //     evt.preventDefault()
  //     search.value = ''

  //     if (scope.leftDrawerState.value !== true) {
  //       scope.leftDrawerState.value = true
  //     }

  //     setTimeout(() => {
  //       algoliaInputRef.value.focus()
  //     })
  //   }
  // }

  // onMounted(() => {
  //   const $router = useRouter()

  //   // If we have a search string in the query (mostly from tab-to-search functionality),
  //   // we need to open the drawer to fill in the search string in the input later
  //   const searchQuery = $route.query.search

  //   if (searchQuery) {
  //     scope.leftDrawerState.value = true
  //   }

  //   import(
  //     /* webpackChunkName: "algolia" */
  //     'docsearch.js'
  //   ).then(docsearch => {
  //     docsearch.default({
  //       apiKey: '5c15f3938ef24ae49e3a0e69dc4a140f',
  //       indexName: 'quasar-framework',
  //       inputSelector: '.doc-algolia input',
  //       algoliaOptions: {
  //         hitsPerPage: 7
  //       },
  //       handleSelected: (a, b, suggestion, c, context) => {
  //         const url = suggestion.url.replace('https://quasar.dev', '')

  //         search.value = ''
  //         $router.push(url).catch(() => {})
  //         algoliaInputRef.value.blur()
  //       }
  //     })

  //     if ($q.platform.is.desktop === true) {
  //       window.addEventListener('keypress', focusOnSearch)
  //     }

  //     if (searchQuery) {
  //       // Here we put search string from query into the input and open the search popup.
  //       // Unfortunately, this input is managed completely by Algolia and their code doesn't seem to
  //       // have a method of opening the popup programmatically, so we need to simulate typing on that input element.
  //       // We also need to dispatch the event only after the input text is populated and Vue will
  //       // do that in next render, so we schedule it on the next event loop iteration with setTimeout.
  //       search.value = searchQuery
  //       algoliaInputRef.value.focus()
  //       setTimeout(() => {
  //         algoliaInputRef.value.$refs.input.dispatchEvent(new Event('input', {}))
  //       })
  //     }
  //   })
  // })

  // onBeforeUnmount(() => {
  //   if ($q.platform.is.desktop === true) {
  //     window.removeEventListener('keypress', focusOnSearch)
  //   }
  // })

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
