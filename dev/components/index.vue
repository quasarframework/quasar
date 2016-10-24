<template>
  <div>
    <div class="layout-padding">
      <div
        class="list no-border"
        v-for="category in pages"
      >
        <div class="list-label">
          {{ category.title }}
        </div>
        <router-link
          v-for="feature in category.features"
          tag="div"
          class="item item-link item-inset-delimiter"
          :to="'/' + category.hash + '/' + feature.hash"
        >
          <i class="item-primary">{{ feature.icon }}</i>
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

export default {
  data () {
    return {
      pages
    }
  }
}
</script>
