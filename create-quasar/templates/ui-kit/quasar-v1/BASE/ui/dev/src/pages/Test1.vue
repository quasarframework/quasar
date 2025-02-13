<template>
  <q-page padding>
    <% if (features.component) { %>
    <<%= componentName %> />
    <% } %>
    <% if (features.directive) { %>
    <div v-<%= directiveName %> class="directive-target">
      x
    </div>
    <% } %>
  </q-page>
</template>

<style lang="sass" scoped>
.directive-target
  width: 50px
  height: 50px
</style>
