<template>
  <div>
    <figure>
      <q-zoom
        color="blue-grey-1"
        restore-on-scroll
      >
        <img
          src="https://cdn.quasar.dev/img/parallax2.jpg"
          alt="QZoom with restore on scroll"
          class="my-image"
        >
      </q-zoom>
    </figure>
  </div>
</template>

<style scoped lang="sass">
.my-image
  width: 100%
  height: auto
  max-width: 100%
  max-height: 100%
  margin: auto
</style>
