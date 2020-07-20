<template>
  <div class="q-pa-md relative-position" style="height: 600px; max-height: 80vh">
    <div
      class="absolute-top-left bg-red text-white q-ma-md q-pa-lg"
      style="border-radius: 10px; font-size: 32px"
      v-morph:test:800="triggers[0]"
    >
      Top left
    </div>

    <div
      class="absolute-top-right bg-blue text-white q-ma-lg q-pa-xl"
      style="border-radius: 20px; font-size: 18px"
      v-morph:test:600.tween="triggers[1]"
    >
      Top right
    </div>

    <div
      class="absolute-bottom-right bg-orange text-white q-ma-lg q-pa-lg"
      style="border-radius: 0"
      v-morph:test:400="triggers[2]"
    >
      Bottom right
    </div>

    <div
      class="absolute-bottom-left bg-green text-white q-ma-xl q-pa-md"
      style="border-radius: 40px; font-size: 24px"
      v-morph:test:600.resize="triggers[3]"
    >
      Bottom left
    </div>

    <q-btn
      class="absolute-center"
      size="lg"
      color="orange"
      :label="`Trigger [ ${current} ]`"
      @click="activateTrigger()"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 1,
      triggers: Array(4).fill(null).map((_, i) => i === 1 ? i : void 0)
    }
  },

  methods: {
    activateTrigger () {
      const i = Math.floor(Math.random() * this.triggers.length)

      if (i === this.current) {
        this.activateTrigger()
      }
      else {
        this.current = i
        this.$set(this.triggers, i, (this.triggers[i] || 0) + 1)
      }
    }
  }
}
</script>
