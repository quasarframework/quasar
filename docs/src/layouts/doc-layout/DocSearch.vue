<template>
  <div
    ref="rootRef"
    class="doc-search z-max self-center"
    :class="classes"
    @click.prevent="onClick"
    @focusin="onFocusin"
    @focusout="onFocusout"
  >
    <div class="doc-search__field rounded-borders row items-center no-wrap q-pl-sm q-pr-md">
      <input
        class="col"
        ref="inputRef"
        placeholder="Search Quasar v2..."
        v-model="terms"
        @keydown="onKeydown"
      />

      <q-icon class="doc-search__icon cursor-pointer" :name="icon.name" size="24px" @click="icon.onClick" />
      <q-no-ssr v-if="keysLabel">
        <kbd class="doc-search__kbd q-ma-none">{{ keysLabel }}</kbd>
      </q-no-ssr>
    </div>

    <div :class="resultsClass">
      <template v-if="results">
        <component
          v-if="results.masterComponent !== void 0"
          :is="results.masterComponent"
        />
        <app-search-results
          v-else
          :results="results"
          :search-active-id="activeId"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { computed, ref, watch, markRaw, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppSearchResults from './search/SearchResults.vue'
import ResultEmpty from './search/ResultEmpty.vue'
import ResultError from './search/ResultError.vue'

const $q = useQuasar()
const $route = useRoute()
const $router = useRouter()

const rootRef = ref(null)
const inputRef = ref(null)

const terms = ref('')
const results = ref(null)
const activeId = ref(null)

const icon = computed(() => (
  terms.value.length !== 0
    ? { name: 'clear', onClick: resetSearch }
    : { name: 'search', onClick: () => {} }
))

const keysLabel = computed(() => $q.platform.is.desktop === true ? ($q.platform.is.mac ? '⌘K' : 'Ctrl+K') : null)

let focusoutTimer
const hasFocus = ref(false)

function onFocusin () {
  clearTimeout(focusoutTimer)
  hasFocus.value = true
}

function onFocusout () {
  clearTimeout(focusoutTimer)
  focusoutTimer = setTimeout(() => {
    hasFocus.value = false
  }, 150)
}

const classes = computed(() => (hasFocus.value ? 'doc-search--focused' : null))
const resultsClass = computed(() => (
  'doc-search__results rounded-borders rounded-borders overflow-auto' +
  ` doc-search__results--${ results.value ? 'active' : 'hidden' }`
))

function closePopup () {
  hasFocus.value = false
  activeId.value = null
}

function resetSearch () {
  terms.value = ''
  results.value = null
  activeId.value = null
}

let requestId = 0, fetchTimer

function fetchQuery (val, onResult, onError) {
  const localRequestId = requestId
  clearTimeout(fetchTimer)

  fetchTimer = setTimeout(() => {
    if (localRequestId !== requestId) { return }

    const xhr = new XMLHttpRequest()
    const data = JSON.stringify({
      q: val, limit: 15, cropLength: 50, attributesToCrop: ['content'], attributesToHighlight: ['content']
    })

    xhr.addEventListener('load', function () {
      localRequestId === requestId && onResult(JSON.parse(this.responseText))
    })

    xhr.addEventListener('error', () => {
      localRequestId === requestId && onError()
    })

    xhr.open('POST', `https://search.quasar.dev/indexes/${ process.env.SEARCH_INDEX }/search`)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.setRequestHeader('X-Meili-API-Key', 'a7c3283824a29d1b0e8042f0266690670b00f7c81d92021b80117563577d2106')
    xhr.send(data)
  }, 200)
}

const contentRE = /(<em>|<\/em>)/
const startsWithRE = /^[a-z0-9]/
const endsWithRE = /[a-z0-9]$/

function parseContent (content) {
  if (!content) {
    return
  }

  let inToken = false

  const acc = []
  const str = (
    (startsWithRE.test(content) ? '...' : '') +
    content +
    (endsWithRE.test(content) ? '...' : '')
  )

  str.split(contentRE).forEach(str => {
    if (str === '') {
      inToken = true
    }
    else if (str !== '<em>' && str !== '</em>') {
      acc.push({
        str,
        class: inToken ? 'app-search__result-token' : null
      })
      inToken = !inToken
    }
  })

  return acc
}

const supportedHitTypes = [ 'page-content', 'page-link' ]

function parseResults (hits) {
  if (hits.length === 0) {
    return { masterComponent: markRaw(ResultEmpty) }
  }

  const acc = {
    entries: [],
    ids: []
  }

  hits.forEach(hit => {
    // if we don't know how to display this API type then just abort
    if (supportedHitTypes.includes(hit.type) === false) {
      return
    }

    const entry = {
      page: hit.menu.join(' » '),
      section: [ hit.l1, hit.l2, hit.l3, hit.l4, hit.l5, hit.l6 ].filter(e => e).join(' » ') || null,
      content: parseContent(hit._formatted.content),

      onMouseenter () {
        activeId.value = entry.id
      },
      onClick () {
        closePopup()
        $router.push(hit.url).catch(() => {})
      }
    }

    acc.entries.push(entry)
  })

  // ensure that the ids are assigned in the right order
  // otherwise keyboard up/down will not work correctly
  let globalId = 0
  acc.entries.forEach(hit => {
    const id = 'search--' + (++globalId)
    hit.id = id
    acc.ids.push(id)
  })

  return acc
}

function onKeydown (evt) {
  switch (evt.keyCode) {
    case 27: // escape
      evt.preventDefault()
      if (hasFocus.value === true) {
        closePopup()
      }
      else {
        resetSearch()
      }
      break
    case 38: // up
    case 40: // down
      evt.preventDefault()
      if (results.value !== null && results.value.ids !== void 0) {
        if (activeId.value === null) {
          activeId.value = results.value.ids[ 0 ]
        }
        else {
          const ids = results.value.ids
          const index = ids.indexOf(activeId.value)
          activeId.value = ids[ (ids.length + index + (evt.keyCode === 38 ? -1 : 1)) % ids.length ]
        }

        const target = document.getElementById(activeId.value)
        if (target.scrollIntoViewIfNeeded !== void 0) {
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
      if (results.value !== null) {
        if (hasFocus.value === false) {
          hasFocus.value = true
          return
        }

        if (activeId.value !== null) {
          document.getElementById(activeId.value).click(evt)
        }
      }
      break
  }
}

function onResultSuccess (response) {
  results.value = parseResults(response.hits)
  hasFocus.value = true
  activeId.value = results.value.ids?.[ 0 ] || null
}

function onResultError () {
  results.value = { masterComponent: markRaw(ResultError) }
}

watch(terms, val => {
  requestId++

  if (!val) {
    resetSearch()
  }
  else {
    fetchQuery(val, onResultSuccess, onResultError)
  }
})

function onClick () {
  inputRef.value.focus()
  onFocusin()
}

function onGlobalKeydown (e) {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 75 /* K */) {
    e.preventDefault()
    inputRef.value.focus()
  }
}

onMounted(() => {
  // If we have a search string in the query (mostly from tab-to-search functionality),
  // we need to open the drawer to fill in the search string in the input later
  const searchQuery = $route.query.search

  window.addEventListener('keydown', onGlobalKeydown)

  if (searchQuery) {
    terms.value = searchQuery
    inputRef.value.focus()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onGlobalKeydown)
})
</script>

<style lang="sass">
body.desktop
  .doc-search__icon
    display: none

.doc-search
  width: 400px
  height: 43px

  &__field
    height: inherit
    width: inherit
    cursor: text
    transition: box-shadow $header-quick-transition, background-color $header-quick-transition

  input
    font-size: $font-size
    width: 1px !important // required when on narrow width window to not overflow the page
    border: 0
    outline: 0
    background: none

  &__kbd
    box-shadow: none !important
    padding: 4px
    border: 1px solid $grey !important
    background: transparent !important

  &__results
    max-height: 80vh
    top: 45px
    left: 0
    right: 0
    transform: scale3d(1, 0, 1)
    transform-origin: top
    transition: transform .14s ease-in-out, box-shadow $header-quick-transition

  &--focused
    .doc-search__results--active
      transform: scale3d(1, 1, 1)

    .doc-search__icon
      display: inline-block !important
    .doc-search__kbd
      display: none

@media (max-width: 445px)
  .doc-search__results
    position: fixed
    top: 60px
    left: 16px
    right: 16px
@media (min-width: 446px)
  .doc-search
    position: relative
  .doc-search__results
    position: absolute

body.mobile
  .doc-search__results
    max-height: 50vh

body.body--light .doc-search
  input
    color: $light-text
  &__field
    background: $grey-4
  &__results
    background: #fff
    color: $light-text
  &--focused
    .doc-search__results--active
      border: 1px solid $separator-color
    .doc-search__field
      background-color: rgba(#000, .28)

body.body--dark .doc-search
  input
    color: #fff
  &__field
    background-color: rgba(#fff, .12)
  &__icon
    color: $brand-primary
  &__results
    background: $dark-bg
    color: $dark-text
  &--focused
    .doc-search__results--active
      border: 1px solid $separator-dark-color
    .doc-search__field
      background-color: rgba(#fff, .28)
</style>
