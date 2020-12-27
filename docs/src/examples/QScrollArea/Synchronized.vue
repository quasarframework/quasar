<template>
  <div class="q-ma-md row no-wrap">
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px;"
      class="col"
      ref="first"
      @scroll="onScrollFirst"
    >
      <div v-for="n in 100" :key="n" class="q-pa-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>

    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px;"
      class="col"
      ref="second"
      @scroll="onScrollSecond"
    >
      <div v-for="n in 100" :key="n" class="q-pa-xs">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  data () {
    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
    }
  },

  methods: {
    scroll (source, position) {
      // if we previously just updated
      // the scroll position, then ignore
      // this update as otherwise we'll flicker
      // the position from one scroll area to
      // the other in an infinite loop
      if (this.ignoreSource === source) {
        this.ignoreSource = null
        return
      }

      const target = source === 'first'
        ? 'second'
        : 'first'

      // we'll now update the other scroll area,
      // which will also trigger a @scroll event...
      // and we need to ignore that one
      this.ignoreSource = target
      this.$refs[target].setScrollPosition(position)
    },

    onScrollFirst ({ verticalPosition }) {
      this.scroll('first', verticalPosition)
    },

    onScrollSecond ({ verticalPosition }) {
      this.scroll('second', verticalPosition)
    }
  }
}
</script>
