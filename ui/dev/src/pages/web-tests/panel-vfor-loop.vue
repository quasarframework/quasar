<template>
  <div class="q-layout-padding">
    <q-tabs v-model="currentTab">
      <q-tab v-for="tab in tabs" :key="tab" :name="tab" :label="tab" />
    </q-tabs>

    <q-tab-panels v-model="currentTab">
      <div>Gigi</div>
      <q-tab-panel key="a" name="a">
        Tab A
      </q-tab-panel>
      <q-tab-panel v-for="tab in tabs" :key="tab" :name="tab">
        Tab {{ tab }}
      </q-tab-panel>
    </q-tab-panels>

    <q-breadcrumbs class="text-teal">
      <q-breadcrumbs-el label="Home" icon="home" />
      <q-breadcrumbs-el v-for="tab in tabs" :key="tab" :label="tab" />
    </q-breadcrumbs>

    <q-breadcrumbs class="text-teal">
      <q-breadcrumbs-el label="Home" icon="home" />
      <q-breadcrumbs-el label="Components" icon="widgets" />
      <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" />
    </q-breadcrumbs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentTab: 'one',
      tabs: [ 'a', 'one', 'two', 'three' ]
    }
  }
}
</script>
