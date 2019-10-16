<template>
  <div class="q-pa-md row justify-center">
    <div class="q-layout-padding q-ma-lg scroll relative-position container">
      <div class="header row justify-around items-center" :style="visibleStyle">
        {{ visible === true ? 'Been Seen Once' : 'Hidden' }}
      </div>
      <div style="width: 100%; height: 2400px;">
        <div style="width: 100%; padding-top: 1600px;" />
        <div v-visible.once="onVisible" class="observed">
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
      visible: false
    }
  },

  computed: {
    visibleStyle () {
      return {
        background: this.visible === true ? 'green' : 'red',
        color: 'white'
      }
    }
  },

  methods: {
    onVisible (data) {
      this.visible = data.isIntersecting || data.isVisible
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 400px
  height: 400px
  border: #ccc solid 1px

.header
  background: #ccc
  font-size: 20px
  color: #282a37
  padding: 10px
  position: -webkit-sticky
  position: sticky
  top: 0

.observed
  width: 100%
  font-size: 20px
  color: #ccc
  background: #282a37
  padding: 10px
</style>
