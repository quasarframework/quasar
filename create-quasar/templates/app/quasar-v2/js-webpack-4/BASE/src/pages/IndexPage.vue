<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
  </q-page>
</template>
<% if (sfcStyle === 'composition-setup') { %>
<script setup>
defineOptions({
  name: 'IndexPage'
});
</script><% } else if (sfcStyle === 'composition' || sfcStyle === 'options') { %>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage'
});
</script><% } %>
