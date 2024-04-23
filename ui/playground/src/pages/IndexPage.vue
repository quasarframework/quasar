<template>
  <div>
    <div class="q-layout-padding q-mx-auto" style="max-width: 500px">
      <router-link to="/layout-quick/a" class="cursor-pointer row justify-center" style="margin-bottom: 25px">
        <img style="height:128px;width:128px" src="https://cdn.quasar.dev/logo-v2/128/logo.png">
      </router-link>
      <div class="text-caption text-center">
        Quasar v{{ $q.version }}
      </div>
      <div class="text-caption text-center">
        Vue v{{ vueVersion }}
      </div>

      <div class="q-pt-md">
        <q-input ref="filterRef" clearable outlined v-model="filter">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <q-list dense class="q-mb-xl">
        <template v-for="(category, title) in filteredList" :key="`category-${title}`">
          <q-item-label header class="q-mt-lg text-uppercase text-weight-bold">
            {{ title }}
          </q-item-label>

          <q-item
            v-for="feature in category"
            :key="`elem-${feature.title}`"
            :to="feature.route"
          >
            <q-item-section>{{ feature.title }}</q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar'
import {
  version as vueVersion,
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'

import { pagesRoutes } from 'src/router/pages'

const STORAGE_KEY = 'index-filter'
const list = {}

pagesRoutes.map(page => page.slice(1, page.length - 4)).forEach(page => {
  const [ folder, file ] = page.split('/')
  if (!list[ folder ]) {
    list[ folder ] = []
  }
  list[ folder ].push({
    route: '/' + page,
    title: file.split(/-/).map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(' ')
  })
})

list.Meta = [
  { route: '/meta/layout_1/first', title: 'Meta Layout 1' },
  { route: '/meta/layout_2/first', title: 'Meta Layout 2' },
  { route: '/meta/title', title: 'Meta Title page' }
]

list[ 'web-tests' ].push({ route: '/tabs-router', title: 'Tabs Router' })

const $q = useQuasar()
const filterRef = ref(null)
const store = ref({ filter: '' })

if (process.env.MODE !== 'ssr') {
  clientInitStore(store)
}

onMounted(() => {
  if (process.env.MODE === 'ssr') {
    clientInitStore(store)
  }

  window.addEventListener('keydown', onKeyup, { passive: false, capture: true })
  $q.platform.is.desktop === true && filterRef.value.focus()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyup, { passive: false, capture: true })
})

const filteredList = computed(() => {
  if (!filter.value) {
    return list
  }

  const newList = {}
  const localFilter = filter.value.toLowerCase()

  Object.keys(list).forEach(categName => {
    const filtered = list[ categName ]
      .filter(feature => feature.title.toLowerCase().indexOf(localFilter) > -1)

    if (filtered.length > 0) {
      newList[ categName ] = filtered
    }
  })

  return newList
})

const filter = computed({
  get () {
    return store.value.filter
  },

  set (val) {
    const filter = val || ''
    store.value.filter = filter
    $q.localStorage.set(STORAGE_KEY, filter)
  }
})

function onKeyup (evt) {
  if (evt.keyCode === 38) { // up
    moveSelection(evt, 'previousSibling')
  }
  else if (evt.keyCode === 40) { // down
    moveSelection(evt, 'nextSibling')
  }
}

function moveSelection (evt, op) {
  evt.preventDefault()

  let el = document.activeElement

  if (!el || el === document.body || el.tagName.toUpperCase() === 'INPUT') {
    let nextEl
    if (op === 'nextSibling') {
      nextEl = document.querySelector('.q-item')
    }
    else {
      const nodes = document.querySelectorAll('.q-item')
      if (nodes.length > 0) {
        nextEl = nodes[ nodes.length - 1 ]
      }
    }

    if (nextEl) {
      focus(nextEl)
    }
    return
  }

  if (el[ op ]) {
    do {
      el = el[ op ]
    }
    while (el && (el.nodeType === 3 || el.tagName.toUpperCase() !== 'A'))

    if (!el || el.nodeType === 3) {
      focus(filterRef.value.$el)
    }
    else if (el.tagName.toUpperCase() === 'A') {
      focus(el)
    }
  }
}

function focus (el) {
  el.focus()
  el.scrollIntoView(false)
}

function clientInitStore (store) {
  const filter = $q.localStorage.getItem(STORAGE_KEY)
  if (filter) {
    store.value.filter = filter
  }
}
</script>
