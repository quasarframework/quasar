<template>
  <div>
    <q-splitter
      id="photos"
      v-model="splitterModel"
      :limits="[0, 100]"
      style="height: 300px; width: 400px;"
      class="no-scroll"
    >

      <template v-slot:before class="no-scroll">
        <img
          src="https://cdn.quasar-framework.org/img/parallax1.jpg"
          :width="width"
          class="absolute-top-left"
        />
      </template>

      <template v-slot:after class="no-scroll">
        <img
          src="https://cdn.quasar-framework.org/img/parallax1-bw.jpg"
          :width="width"
          class="absolute-top-right"
        />
      </template>

    </q-splitter>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: 400,
      splitterModel: 50 // start at 50%
    }
  }
}
</script>
<style>
.no-scroll > .q-splitter__before, .no-scroll > .q-splitter__after {
  overflow: hidden !important;
}
</style>
