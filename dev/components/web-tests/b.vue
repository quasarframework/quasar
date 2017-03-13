<template>
  <div class="layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-input-group
      type="radio"
      v-model="tab"
      :options="[
        {label: 'Route A', value: 'a'},
        {label: 'Route B', value: 'b'},
        {label: 'Route C', value: 'c'}
      ]"
    />
    <q-checkbox v-model="a" />

    <q-tabs class="secondary" inverted>
      <q-route-tab
        v-for="route in ['a', 'b', 'c']"
        :key="route"
        slot="title"
        :name="route"
        :to="`/web-tests/${route}`"
        :label="`Route ${route}`"
        icon="receipt"
      />

      <q-tab-pane
        v-for="route in ['a', 'b', 'c']"
        :key="route"
        :name="route"
      >
        Route {{route}}
      </q-tab-pane>
    </q-tabs>

    AAA
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'one',
      a: true
    }
  }
}
</script>
