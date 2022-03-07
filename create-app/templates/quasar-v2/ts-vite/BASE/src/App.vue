<template>
  <router-view />
</template>

<script lang="ts">
<% if (typescriptConfig === 'composition') { %>import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});<% } else if (typescriptConfig === 'options') { %>import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});<% } else if (typescriptConfig === 'class') { %>
import { Vue } from 'vue-class-component'

export default class App extends Vue {}<% } %>
</script>
