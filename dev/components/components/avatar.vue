<template>
  <div class="layout-padding avatar-page">
    <q-avatar color="red" text-color="white" icon="directions" />
    <q-avatar color="primary" text-color="white">J</q-avatar>
    <q-avatar :size="100" color="teal" text-color="white" icon="directions" />
    <q-avatar :size="24" color="orange">J</q-avatar>

    <q-avatar>
      <img src="statics/boy-avatar.png">
    </q-avatar>
  </div>
</template>

<style lang="stylus">
.avatar-page .q-avatar
  margin 4px
</style>
