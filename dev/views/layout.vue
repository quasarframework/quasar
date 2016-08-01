<template>
  <div class="layout">
    <div class="layout-header">
      <div class="toolbar">
        <button><i>menu</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-1">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button><i>help</i></button>
        </div>
      </div>
      <div class="toolbar">
        <button><i>menu</i></button>
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
      <div class="toolbar">
        <button><i>menu</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-3">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button><i>search</i></button>
          <button><i>search</i></button>
          <button><i>help</i></button>
        </div>
      </div>
      <div class="toolbar">
        <button><i>menu</i></button>
        <div class="toolbar-content">
          <div class="toolbar-title padding-4">
            <div>Some very very very very long title here</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button><i>search</i></button>
          <button><i>search</i></button>
          <button><i>search</i></button>
          <button><i>help</i></button>
        </div>
      </div>
      <div class="toolbar">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      <div class="toolbar primary">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      <div class="toolbar secondary">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
      <div class="toolbar light">
        <quasar-searchbar :model.sync="search"></quasar-searchbar>
      </div>
    </div>

    <div class="layout-content">
      <div>Search: '{{ search }}'</div>
      <div v-for="n in 100">text</div>
    </div>

    <div class="layout-footer">
      <div class="toolbar light">
        <div class="toolbar-buttons">
          <button><i>menu</i></button>
        </div>
        <div class="toolbar-content">
          <div class="toolbar-title">
            <div>Toolbar</div>
          </div>
        </div>
        <div class="toolbar-buttons">
          <button class="text-red"><i>search</i></button>
          <button class="text-yellow"><i>help</i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  }
}
</script>
