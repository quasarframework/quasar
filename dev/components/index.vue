<template>
  <div>
    <div class="layout-padding" style="max-width: 500px">
      <router-link tag="a" to="/layout-quick/a" class="cursor-pointer row justify-center" style="margin-bottom: 25px">
        <img src="statics/quasar-logo.png">
      </router-link>
      <q-list
        v-for="(category, title) in list"
        :key="`category-${title}`"
      >
        <h4 class="text-uppercase">
          {{ title }}
        </h4>
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
import pages from '../pages'

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
  data () {
    return {
      list
    }
  }
}
</script>
