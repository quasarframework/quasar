<template>
  <div>
    <q-resize-observer @resize="onResize" />
    <q-splitter
      id="photos"
      v-model="splitterModel"
      :limits="[0, 100]"
      :style="splitterStyle"
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
  },
  methods: {
    // we are using q-resize-observer to keep this example mobile-friendly
    onResize (size) {
      let potentialWidth = Math.abs(size.width)
      this.width = Math.min(potentialWidth, 400)
    }
  },
  computed: {
    splitterStyle () {
      return {
        height: '300px',
        width: this.width + 'px'
      }
    }
  }
}
</script>
<style>
.no-scroll > .q-splitter__before, .no-scroll > .q-splitter__after {
  overflow: hidden !important;
}
</style>
