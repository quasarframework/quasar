<template>
  <div class="q-layout-padding avatar-page">
    <p>Basic</p>
    <div>
      <q-avatar color="red" text-color="white" icon="directions" />
      <q-avatar color="primary" text-color="white">
        J
      </q-avatar>
      <q-avatar size="100px" font-size="52px" color="teal" text-color="white" icon="fas fa-address-book" />
      <q-avatar size="24px" color="orange">
        J
      </q-avatar>
      <q-avatar>
        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
      </q-avatar>
    </div>

    <p>Square</p>
    <div>
      <q-avatar square color="red" text-color="white" icon="directions" />
      <q-avatar square color="primary" text-color="white">
        J
      </q-avatar>
      <q-avatar square size="100px" font-size="82px" color="teal" text-color="white" icon="directions" />
      <q-avatar square size="24px" color="orange">
        J
      </q-avatar>
      <q-avatar square>
        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
      </q-avatar>
    </div>

    <p>Rounded</p>
    <div>
      <q-avatar rounded color="red" text-color="white" icon="directions" />
      <q-avatar rounded color="primary" text-color="white">
        J
      </q-avatar>
      <q-avatar rounded size="100px" font-size="82px" color="teal" text-color="white" icon="directions" />
      <q-avatar rounded size="24px" color="orange">
        J
      </q-avatar>
      <q-avatar rounded>
        <img src="https://cdn.quasar.dev/img/boy-avatar.png">
      </q-avatar>
    </div>
  </div>
</template>

<style lang="sass">
.avatar-page .q-avatar
  margin: 4px
  // box-shadow: $shadow-4
</style>
