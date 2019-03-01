<template>
  <!-- <div class="q-layout-padding fixed" style="top: 0; bottom: 0; left: 0; right: 0; overflow: auto; -webkit-overflow-scrolling: touch;"> -->
  <div class="q-layout-padding">
    <div class="fixed" :style="myStyle">
      <div class="absolute-top">
        <div class="bg-red text-white">
          height W: {{ $q.screen.height }} / width W: {{ $q.screen.width }}
        </div>
        <div class="bg-red text-white">
          height F: {{ size.height }} / width F: {{ size.width }}
        </div>
      </div>

      <div class="absolute-bottom">
        <div class="bg-red text-white">
          height W: {{ $q.screen.height }} / width W: {{ $q.screen.width }}
        </div>
        <div class="bg-red text-white">
          height F: {{ size.height }} / width F: {{ size.width }}
        </div>
      </div>

      <q-resize-observer
        @resize="(s) => { size = s }"
      />
    </div>
    <q-btn @click="$router.replace('/web-tests/b')">
      Go to B
    </q-btn>
    <q-input standout value="Field 1" class="q-my-lg" label="Field 1" />
    <div class="bg-red-2" style="height: 10vh" v-for="n in 10" :key="n">
      Spacer {{ n }}
    </div>
    <q-input standout value="Field 2" class="q-my-lg" label="Field 2" />
    <div class="bg-red-2" style="height: 300vh">
      Spacer
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      size: {}
    }
  },
  computed: {
    myStyle () {
      const h = this.$q.screen.height
      return {
        top: '50px',
        height: `${h - 100}px`,
        left: '50px',
        right: '50px',
        background: 'rgba(0,100, 0, .2)',
        pointerEvents: 'none',
        zIndex: '1'
      }
    }
  }
}
</script>
