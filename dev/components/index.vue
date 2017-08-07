<template>
  <div>
    <div class="layout-padding" style="max-width: 500px">
      <div class="row justify-center" style="padding-bottom: 25px">
        <img src="statics/quasar-logo.png">
      </div>
      <div
        class="list no-border"
        v-for="(category, title) in list"
      >
        <h4 class="uppercase">
          {{ title }}
        </h4>
        <router-link
          v-for="feature in category"
          :key="`${feature.route}${feature.title}`"
          tag="div"
          class="q-item q-item-link"
          :to="feature.route"
        >
          <q-item-main :label="feature.title" />
          <q-item-side right icon="chevron_right" />
        </router-link>
      </div>
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
    title: file.charAt(0).toUpperCase() + file.slice(1)
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
