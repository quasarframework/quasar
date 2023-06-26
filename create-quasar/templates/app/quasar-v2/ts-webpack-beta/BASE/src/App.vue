<template>
  <router-view />
</template>

<% if (typescriptConfig === 'composition-setup') { %><script setup lang="ts">
<% } else if (typescriptConfig === 'composition') { %><script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
})<% } else if (typescriptConfig === 'options') { %><script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
})<% } else if (typescriptConfig === 'class') { %><script lang="ts">
import { Vue } from 'vue-class-component';

export default class App extends Vue {}<% } %>
</script>
