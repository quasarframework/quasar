<template>
  <div class="q-pa-md">
    <q-toolbar class="bg-purple text-white shadow-2 generic-border-radius">
      <q-btn flat label="Homepage" />
      <q-space />
      <q-tabs v-model="tab">
        <q-tab name="tab1" label="Tab 1" />
        <q-tab name="tab2" label="Tab 2" />
        <q-tab name="tab3" label="Tab 3" />
      </q-tabs>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tab: ''
    }
  }
}
</script>
