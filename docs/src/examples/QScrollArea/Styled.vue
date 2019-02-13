<template>
  <div class="row q-ma-md">
    <div class="col-12">
      <q-scroll-area
        :thumb-style="thumbStyle"
        :content-style="contentStyle"
        :content-active-style="contentActiveStyle"
        style="height: 100px; max-width: 300px;"
      >
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
export default {
  computed: {
    contentStyle () {
      return {
        backgroundColor: 'rgba(0,0,0,0.1)'
      }
    },
    contentActiveStyle () {
      return {
        backgroundColor: 'white',
        color: 'red'
      }
    },
    thumbStyle () {
      return {
        right: '4px',
        borderRadius: '5px',
        background: 'blue',
        width: '5px',
        opacity: 0.75
      }
    }
  }
}
</script>
