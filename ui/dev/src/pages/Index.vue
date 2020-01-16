<template>
  <div>
    <div class="q-layout-padding q-mx-auto" style="max-width: 500px">
      <router-link tag="a" to="/layout-quick/a" class="cursor-pointer row justify-center" style="margin-bottom: 25px">
        <img src="https://cdn.quasar.dev/img/quasar-logo.png">
      </router-link>
      <div class="text-caption text-center">
        Quasar v{{ $q.version }}
      </div>

      <div class="q-py-md">
        <q-input clearable outlined v-model="filter" autofocus>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <q-list
        dense
        v-for="(category, title) in filteredList"
        :key="`category-${title}`"
        class="q-mb-xl"
      >
        <q-item-label header class="text-uppercase text-weight-bold">
          {{ title }}
        </q-item-label>

        <q-item
          v-for="feature in category"
          :key="`${feature.route}${feature.title}`"
          :to="feature.route"
        >
          <q-item-section>{{ feature.title }}</q-item-section>
          <q-item-section side>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import pages from 'src/router/pages-list'

let list = {}
pages.map(page => page.slice(0, page.length - 4)).forEach(page => {
  let [folder, file] = page.split('/')
  if (!list[folder]) {
    list[folder] = []
  }
  list[folder].push({
    route: page,
    title: file.split(/-/).map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(' ')
  })
})

export default {
  created () {
    this.list = list
  },

  computed: {
    filteredList () {
      if (!this.filter) {
        return this.list
      }

      const newList = {}

      Object.keys(this.list).forEach(categName => {
        const filtered = this.list[categName]
          .filter(feature => feature.title.toLowerCase().indexOf(this.filter) > -1)

        console.log(filtered)
        if (filtered.length > 0) {
          newList[categName] = filtered
        }
      })

      return newList
    }
  },

  data () {
    return {
      filter: ''
    }
  }
}
</script>
