<template>
  <router-view />
</template>

<% if (sfcStyle === 'composition-setup') { %><script setup lang="ts">
<% } else if (sfcStyle === 'composition') { %><script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});<% } else if (sfcStyle === 'options') { %><script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});<% } else if (sfcStyle === 'class') { %><script lang="ts">
import { Vue } from 'vue-class-component'

export default class App extends Vue {}<% } %>
</script>
