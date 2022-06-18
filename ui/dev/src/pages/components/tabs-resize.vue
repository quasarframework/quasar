<template>
  <div class="q-pa-md" style="width: 1920px; height: 1920px">
    <div class="row no-wrap shadow-1">
      <q-toolbar class="col-8 bg-grey-3">
        <q-btn flat round dense icon="menu" />
        <q-toolbar-title>Title</q-toolbar-title>
        <q-btn flat round dense icon="search" />
      </q-toolbar>
      <q-toolbar class="col-4 bg-primary text-white">
        <q-space />
        <q-tabs v-model="tab" inverted color="red-8" class="col-shrink">
          <q-tab name="tab1" label="T e s t 1" />
          <q-tab name="tab2" label="T e s t 2" />
          <q-tab name="tab3" label="T e s t 3" />
          <q-tab name="tab4" label="T e s t 4" />
        </q-tabs>
        <q-btn flat round dense icon="bluetooth" class="q-mr-sm" />
        <q-btn flat round dense icon="more_vert" />
      </q-toolbar>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: 'tab1'
    }
  }
}
</script>
