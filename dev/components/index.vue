<template>
  <div>
    <div class="layout-padding">
      <div
        class="list no-border"
        v-for="(category, title) in list"
      >
        <h4 class="uppercase">
          {{ title }}
        </h4>
        <router-link
          v-for="feature in category"
          tag="div"
          class="item item-link item-delimiter"
          :to="feature.route"
        >
          <div class="item-content has-secondary">
            <div>{{ feature.title }}</div>
          </div>
          <i class="item-secondary">chevron_right</i>
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
