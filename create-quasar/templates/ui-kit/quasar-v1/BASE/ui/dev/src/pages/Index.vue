<template>
  <q-page padding class="row justify-center">
    <q-list dense class="list">
      <div class="text-h4 q-mb-md">Test pages</div>
      <q-item
        v-for="page in pages"
        :key="page.path"
        :to="page.path"
      >
        <q-item-section avatar>
          <q-icon name="pages" />
        </q-item-section>
        <q-item-section>
          {{ page.title }}
        </q-item-section>
        <q-item-section side>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import pages from '../router/pages'

export default {
  created () {
    this.pages = pages
  }
}
</script>

<style lang="sass" scoped>
.list
  width: 700px
  max-width: 100%
</style>
