<template>
  <q-page padding>
    <q-card class="inline-block q-mt-md">
      <q-card-section class="text-subtitle text-primary">
        Current page: first
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="row no-wrap items-center">
          <div class="text-caption q-mr-sm">Layout 1:</div>
          <q-btn-group>
            <q-btn no-caps color="primary" to="/meta/layout_1/first" label="first" />
            <q-btn no-caps color="secondary" to="/meta/layout_1/second" label="second" />
            <q-btn no-caps color="orange" to="/meta/layout_1/third" label="third" />
          </q-btn-group>
        </div>
        <div class="row no-wrap items-center q-mt-sm">
          <div class="text-caption q-mr-sm">Layout 2:</div>
          <q-btn-group>
            <q-btn no-caps color="primary" to="/meta/layout_2/first" label="first" />
            <q-btn no-caps color="secondary" to="/meta/layout_2/second" label="second" />
            <q-btn no-caps color="orange" to="/meta/layout_2/third" label="third" />
          </q-btn-group>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-btn no-caps color="secondary" @click="toggleTitle" label="Toggle first page title" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style>
</style>

<script>
import { useMeta } from 'quasar'
import { ref, onMounted, onUnmounted } from 'vue'

function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  name: 'PageIndex',

  async preFetch () {
    console.log('called prefetch')
    await timeout(1000)
  },

  setup () {
    console.log('created first.vue')

    const title = ref('Page 1')

    useMeta(() => {
      console.log('running meta fn in first.vue')
      return {
        title: title.value,
        meta: {
          description: { name: 'description', content: 'Page 1' }
        },
        link: {
          google: { rel: 'stylesheet', href: 'http://bogus.com/1' }
        },
        noscript: {
          default: 'This is for non-JS'
        }
      }
    })

    onMounted(() => {
      console.log('mounted first.vue')
    })

    onUnmounted(() => {
      console.log('unmounted first.vue')
    })

    return {
      toggleTitle () {
        title.value = title.value === 'Page 1'
          ? 'Page 1 Extended'
          : 'Page 1'
      }
    }
  }
}
</script>
