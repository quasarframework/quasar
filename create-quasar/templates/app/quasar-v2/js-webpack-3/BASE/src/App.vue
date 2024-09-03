<template>
  <router-view />
</template>
<% if (sfcStyle === 'composition-setup') { %>
<script setup>
defineOptions({
  name: 'App'
});
</script><% } else if (sfcStyle === 'composition' || sfcStyle === 'options') { %>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script><% } %>
