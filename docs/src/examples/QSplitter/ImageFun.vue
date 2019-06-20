<template>
  <div class="overflow-hidden">
    <q-resize-observer @resize="onResize" :debounce="0" />

    <q-splitter
      id="photos"
      v-model="splitterModel"
      :limits="[0, 100]"
      :style="splitterStyle"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
    >

      <template v-slot:before>
        <img
          src="https://cdn.quasar.dev/img/parallax1.jpg"
          :width="width"
          class="absolute-top-left"
        />
      </template>

      <template v-slot:after>
        <img
          src="https://cdn.quasar.dev/img/parallax1-bw.jpg"
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
    // we are using QResizeObserver to keep
    // this example mobile-friendly
    onResize ({ width }) {
      this.width = width
    }
  },

  computed: {
    splitterStyle () {
      return {
        height: Math.min(600, 0.66 * this.width) + 'px',
        width: this.width + 'px'
      }
    }
  }
}
</script>
