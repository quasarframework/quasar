<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      :loading="loading1"
      :percentage="percentage1"
      color="primary"
      @click="startComputing(1)"
      style="width: 150px"
    >
      Compute PI
      <template v-slot:loading>
        <q-spinner-gears class="on-left" />
        Computing...
      </template>
    </q-btn>

    <q-btn
      :loading="loading2"
      :percentage="percentage2"
      round
      color="secondary"
      @click="startComputing(2)"
      icon="cloud_upload"
    />

    <q-btn
      :loading="loading3"
      :percentage="percentage3"
      dark-percentage
      unelevated
      color="orange"
      text-color="grey-9"
      @click="startComputing(3)"
      icon="cloud_upload"
      style="width: 100px"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading1: false,
      percentage1: 0,

      loading2: false,
      percentage2: 0,

      loading3: false,
      percentage3: 0
    }
  },

  methods: {
    startComputing (id) {
      this[`loading${id}`] = true
      this[`percentage${id}`] = 0
      this[`interval${id}`] = setInterval(() => {
        this[`percentage${id}`] += Math.floor(Math.random() * 8 + 10)
        if (this[`percentage${id}`] >= 100) {
          clearInterval(this[`interval${id}`])
          this[`loading${id}`] = false
        }
      }, 700)
    }
  },

  beforeDestroy () {
    clearInterval(this.interval1)
    clearInterval(this.interval2)
  }
}
</script>
