<template>
  <quasar-layout>
    <div slot="header" class="toolbar">
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
    <div slot="header" class="toolbar primary">
      <quasar-search :model.sync="search"></quasar-search>
    </div>

    <quasar-tabs slot="navbar">
      <quasar-tab icon="mail">Mails</quasar-tab>
      <quasar-tab icon="alarm">Alarms</quasar-tab>
      <quasar-tab icon="help">Help</quasar-tab>
    </quasar-tabs>

    <quasar-layout-view>
      <div>Search: '{{ search }}'</div>
      <div v-for="n in 100">text</div>
    </quasar-layout-view>
  </div>
</template>

<script>
export default {
  methods: {}
}
</script>
