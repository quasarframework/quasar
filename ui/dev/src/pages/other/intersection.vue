<template>
  <div>
    <p class="q-pl-lg">
      Fires on entry and leaving
    </p>
    <div class="q-layout-padding q-ma-lg scroll relative-position" style="width: 300px; height: 400px; border: #ccc solid 1px; ">
      <div class="header row justify-around items-center" :style="visible1Style">
        {{ visible1 ? 'Visible' : 'Hidden' }}
      </div>
      <div style="width: 100%; height: 2400px;">
        <div style="width: 100%; padding-top: 1600px;" />
        <div v-intersection="onVisible1" class="observed">
          Observed Element
        </div>
      </div>
    </div>

    <p class="q-pl-lg">
      Fires once on entry
    </p>
    <div class="q-layout-padding q-ma-lg scroll relative-position" style="width: 300px; height: 400px; border: #ccc solid 1px; ">
      <div class="header row justify-around items-center" :style="visible2Style">
        {{ visible2 ? 'Visible' : 'Hidden' }}
      </div>
      <div style="width: 100%; height: 2400px;">
        <div style="width: 100%; padding-top: 1600px;" />
        <div v-intersection.once="onVisible2" class="observed">
          Observed Element
        </div>
      </div>
    </div>

    <div class="q-layout-padding q-ma-lg scroll relative-position" style="width: 300px; height: 400px; border: #ccc solid 1px; ">
      <div class="header row justify-around items-center">
        Percent: {{ percent }}%
      </div>
      <div style="width: 100%; height: 2400px;">
        <div style="width: 100%; padding-top: 1600px;" />
        <div v-intersection="options" class="observed">
          Observed Element
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      visible1: false,
      visible2: false,
      percent: 0
    }
  },
  computed: {
    visible1Style () {
      return {
        background: this.visible1 === true ? 'green' : 'red',
        color: 'white'
      }
    },
    visible2Style () {
      return {
        background: this.visible2 === true ? 'green' : 'red',
        color: 'white'
      }
    },
    options () {
      return {
        handler: this.onVisible3,
        cfg: {
          threshold: [ 0, 0.25, 0.5, 0.75, 1 ]
        }
      }
    }
  },
  methods: {
    onVisible1 (data) {
      this.visible1 = data.isIntersecting || data.isVisible
      console.log(data)
    },
    onVisible2 (data) {
      this.visible2 = data.isIntersecting
    },
    onVisible3 (data) {
      this.percent = (data.intersectionRatio * 100).toFixed(2)
      this.visible3 = data.isVisible
      this.intersecting3 = data.isIntersecting
    }
  }
}
</script>

<style>
.header {
  background: #ccc;
  font-size: 20px;
  color: #282a37;
  padding: 10px;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

.observed {
  font-size: 20px;
  color: #ccc;
  background: #282a37;
  padding: 10px;
}
</style>
