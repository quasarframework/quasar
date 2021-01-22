<template>
  <q-layout view="lHh LpR fFf">
    <q-page-container>
      <q-page>
        <q-virtual-scroll
          :items="rows"
          virtual-scroll-item-size="72"
          scroll-target="body"
          class="sample-placeholder"
        >
          <template v-slot="{ item }">
            <q-item :key="item.id">
              <q-item-section>
                <q-input v-model="item.text" />
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.sample-placeholder
  .q-virtual-scroll__padding
    background-image: url('data:image/svg+xml,%3Csvg width="64" height="64" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M 8 16 c 4.418 0 8 -3.582 8 -8 s -3.582 -8 -8 -8 s -8 3.582 -8 8 s 3.582 8 8 8 z m 0 -2 c 3.314 0 6 -2.686 6 -6 s -2.686 -6 -6 -6 s -6 2.686 -6 6 s 2.686 6 6 6 z m 33.414 -6 l 5.95 -5.95 L 45.95 0.636 L 40 6.586 L 34.05 0.636 L 32.636 2.05 L 38.586 8 l -5.95 5.95 l 1.414 1.414 L 40 9.414 l 5.95 5.95 l 1.414 -1.414 L 41.414 8 z" fill="grey" fill-rule="evenodd"/%3E%3C/svg%3E')
    background-size: auto var(--q-virtual-scroll-item-height, 50px)
</style>

<script>
const virtualScrollElements = 1000

export default {
  data () {
    return {
      rows: Array(virtualScrollElements).fill(null).map((_, id) => ({
        id: `k_${id + 1}`,
        text: `text ${id + 1}`
      }))
    }
  }
}
</script>
