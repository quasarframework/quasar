<template>
  <div class="row q-ma-md">
    <div class="col-12">
      <q-scroll-area
        :delay="200"
        style="height: 100px;"
      >
        <p>The bar will show in 200ms scrollbars become visible after mouse is hovering the container.</p>
        <div v-for="n in 100" :key="n">
          Lorem ipsum dolor sit amet, consectetur adipisicing
          elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua.
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
export default {}
</script>
