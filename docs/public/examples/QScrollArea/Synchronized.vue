<template>
  <div class="q-ma-md row no-wrap">
    <q-scroll-area
      visible
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px;"
      class="col"
      ref="firstRef"
      @scroll="onScrollFirst"
    >
      <div v-for="n in 100" :key="n" class="q-pa-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>

    <q-scroll-area
      visible
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      style="height: 200px;"
      class="col"
      ref="secondRef"
      @scroll="onScrollSecond"
    >
      <div v-for="n in 100" :key="n" class="q-pa-sm">
        Lorem ipsum dolor sit amet, consectetur adipisicing
        elit, sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua.
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const firstRef = ref(null)
    const secondRef = ref(null)

    let ignoreSource

    function scroll (source, position) {
      // if we previously just updated
      // the scroll position, then ignore
      // this update as otherwise we'll flicker
      // the position from one scroll area to
      // the other in an infinite loop
      if (ignoreSource === source) {
        ignoreSource = null
        return
      }

      // we'll now update the other scroll area,
      // which will also trigger a @scroll event...
      // and we need to ignore that one
      ignoreSource = source === 'first'
        ? 'second'
        : 'first'

      const areaRef = source === 'first'
        ? secondRef
        : firstRef

      areaRef.value.setScrollPosition('vertical', position)
    }

    return {
      firstRef,
      secondRef,

      thumbStyle: {
        right: '4px',
        borderRadius: '7px',
        backgroundColor: '#027be3',
        width: '4px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '8px',
        opacity: 0.2
      },

      onScrollFirst ({ verticalPosition }) {
        scroll('first', verticalPosition)
      },

      onScrollSecond ({ verticalPosition }) {
        scroll('second', verticalPosition)
      }
    }
  }
}
</script>
