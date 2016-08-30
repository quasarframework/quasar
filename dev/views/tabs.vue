<template>
  <div>
    <input v-model="target1">
    <input v-model="target2">
    <input v-model="target3">
    <div class="layout-padding">
      <quasar-tabs class="primary inverted">
        <quasar-tab icon="mail" :target="target1">
          Tab 1
        </quasar-tab>
        <quasar-tab icon="mail" :target="target2" active="true">
          Tab 2
        </quasar-tab>
        <quasar-tab icon="mail" :target="target3">
          Tab 3
        </quasar-tab>
      </quasar-tabs>
      <br>
      <quasar-tabs class="primary">
        <quasar-tab icon="mail" :target="target1">
          Tab 1
        </quasar-tab>
        <quasar-tab icon="mail" :target="target2" active="true">
          Tab 2
        </quasar-tab>
        <quasar-tab icon="mail" :target="target3">
          Tab 3
        </quasar-tab>
      </quasar-tabs>
      <br>
      <quasar-tabs class="orange inverted">
        <quasar-tab icon="mail" :target="target1">
          Tab 1
        </quasar-tab>
        <quasar-tab icon="mail" :target="target2" active="true">
          Tab 2
        </quasar-tab>
        <quasar-tab icon="mail" :target="target3">
          Tab 3
        </quasar-tab>
      </quasar-tabs>

      <div id="tab-1" class="tab">
        <div v-for="n in 5">Tab 1</div>
      </div>
      <div id="tab-2" class="tab">
        <div v-for="n in 10">Tab 2</div>
      </div>
      <div id="tab-3" class="tab">
        <div v-for="n in 7">Tab 3</div>
      </div>
      <div id="tab-4" class="tab">
        <div v-for="n in 7">Tab 4</div>
      </div>

      <button>Click me</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      target1: '#tab-1',
      target2: '#tab-2',
      target3: '#tab-3'
    }
  }
}
</script>

<style scoped>
div.tab {
  margin-top: 20px;
}
</style>
