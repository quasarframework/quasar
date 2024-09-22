<template>
  <router-view />
</template>
<% if (sfcStyle === 'composition-setup') { %>
<script setup lang="ts">
//
</script><% } else if (sfcStyle === 'composition' || sfcStyle === 'options') { %>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script><% } %>
