<template>
  <div class="q-pa-md">
    <q-img
      src="https://cdn.quasar.dev/img/parallax2.jpg"
      spinner-color="white"
      style="height: 170px; max-width: 300px"
      img-class="my-custom-image"
      class="rounded-borders"
    >
      <div class="absolute-bottom text-subtitle1 text-center">
        Caption
      </div>
    </q-img>
  </div>
</template>

<style lang="sass">
.my-custom-image
  filter: blur(1px) sepia()
</style>
