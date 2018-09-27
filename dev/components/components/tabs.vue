<template>
  <div class="tabs-demo bg-grey-3">
    <div class="text-primary">
      <q-tabs-bar>
        <q-tab label="Item one" />
        <q-tab label="Item two" />
        <q-tab label="Item three" />
      </q-tabs-bar>

      <q-tabs-bar align="right">
        <q-tab icon="phone" />
        <q-tab icon="favorite" />
        <q-tab icon="location_on" />
      </q-tabs-bar>

      <q-tabs-bar>
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs-bar>

      <q-tabs-bar narrow-indicator>
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs-bar>

      <q-tabs-bar inline-label>
        <q-tab icon="phone" label="Item one Item one Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
      </q-tabs-bar>

      <q-tabs-bar inline-label align="justify">
        <q-tab icon="phone" label="Item one" />
        <q-tab icon="favorite" label="Item two" />
        <q-tab icon="location_on" label="Item three" />
        <q-tab icon="phone" label="Item four" />
        <q-tab icon="favorite" label="Item five" />
        <q-tab icon="location_on" label="Item six" />
      </q-tabs-bar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  methods: {
    //
  }
}
</script>

<style lang="stylus">
.tabs-demo .q-tabs-bar
  margin-bottom 24px
</style>
