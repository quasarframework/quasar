<template>
  <div>
    <div class="layout-padding" style="max-width: 500px">
      <div class="row justify-center" style="padding-bottom: 25px">
        <img src="statics/quasar-logo.png">
      </div>
      <h4 class="uppercase">Date Ordinals:</h4>
      <p v-for="date in dateList">{{date}}: {{ fmt(date, 'Do MMMM YYYY') }}</p>
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
import { date } from 'quasar'
const { formatDate } = date

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
  },
  computed: {
    dateList () {
      const dl = []
      for (var i = 1; i <= 31; i++) {
        dl.push('2017-01-' + i)
      }
      return dl
    }
  },
  methods: {
    fmt (date, format) {
      return formatDate(new Date(date), format)
    }
  }

}
</script>
