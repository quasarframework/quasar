<template>
  <div class="layout">
    <div class="layout-header">
      <div class="toolbar">
        <button @click="close()"><i>arrow_back</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-2">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button><i>search</i></button>
          <button><i>help</i></button>
        </div>
      </div>
      <div class="toolbar primary">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
    </div>

    <quasar-tabs class="layout-navbar">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>

    <div class="layout-content">
      <div>Search: '{{ search }}'</div>
      <div v-for="n in 100">text</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {}
}
</script>
