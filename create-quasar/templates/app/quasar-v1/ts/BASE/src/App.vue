<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
<% if (typescriptConfig === 'composition') { %>import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});<% } else if (typescriptConfig === 'class') { %>import { Vue, Component } from 'vue-property-decorator';

@Component
export default class App extends Vue {}<% } else if (typescriptConfig === 'options') { %>import Vue from 'vue';

export default Vue.extend({
  name: 'App'
});<% } %>
</script>
