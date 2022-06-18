<template>
  <q-page padding>
    <q-card class="inline-block q-mt-md">
      <q-card-section class="text-subtitle text-orange">
        Current page: third
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
    </q-card>
  </q-page>
</template>

<script>
import { useMeta } from 'quasar'
import { onMounted, onUnmounted } from 'vue'

export default {
  name: 'PageThird',

  setup () {
    console.log('created third.vue')

    useMeta({
      bodyAttr: {
        some: 'value'
      },
      htmlAttr: {
        'third-page': ''
      }
    })

    onMounted(() => {
      console.log('mounted third.vue')
    })

    onUnmounted(() => {
      console.log('unmounted third.vue')
    })
  }
}
</script>
