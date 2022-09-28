<template>
  <q-checkbox v-model="allowRouteChange" label="Allow route change" />

  <div class="q-ma-sm">
    <q-card flat class="bg-primary text-white inline-block">
      <q-card-section class="row items-center no-wrap">
        <q-icon class="q-mr-sm" name="warning" size="2em" />
        <div>Enable route change above when you want to navigate away</div>
      </q-card-section>
    </q-card>
  </div>

  <q-tabs v-model="tab">
    <q-route-tab name="one" to="/tabs-router/one" label="Tab one" />
    <q-route-tab name="two" to="/tabs-router/two" label="Tab two" />
    <q-route-tab name="three" to="/tabs-router/bogus" label="Tab bogus" />
  </q-tabs>

  <router-view v-bind:allowRouteChange="allowRouteChange" />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TabsLayout',

  setup () {
    const tab = ref('one')
    const allowRouteChange = ref(false)

    return {
      tab,
      allowRouteChange
    }
  }
})
</script>
