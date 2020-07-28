<template>
  <div class="q-pa-md relative-position bg-grey-1" style="width: 600px; max-width: 100vw; height: 600px; max-height: 80vh">
    <div
      class="absolute-top-left bg-red text-white q-ma-md q-pa-lg"
      style="border-radius: 10px"
      v-morph:test:800="triggers[0]"
    >
      Top left
    </div>

    <div
      class="absolute-top-right bg-blue text-white q-ma-lg q-pa-xl"
      style="border-radius: 20px"
      v-morph:test:1200.tween="triggers[1]"
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
      style="border-radius: 40px"
      v-morph:test:1400.resize.tween="triggers[3]"
    >
      Bottom left
    </div>

    <q-btn
      class="absolute-center"
      :label="`Toggle [${current}]`"
      @click="activateTrigger()"
    />

    <q-btn
      v-morph:dialog:300="dialog.btnTrigger"
      class="fixed-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="openDialog"
    />

    <q-dialog
      v-model="dialog.state"
      seamless
      @before-hide="closeDialog"
    >
      <q-card
        v-morph:dialog:500:transitionend.resize="dialog.dialogTrigger"
        class="bg-primary text-white q-mr-auto q-mt-auto q-mb-sm q-ml-sm"
        style="width: 300px"
      >
        <q-card-section>
          <div class="text-h6">
            Test
          </div>
        </q-card-section>

        <q-card-section>
          Click/Tap on the backdrop.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 1,
      triggers: Array(4).fill(null).map((_, i) => i === 1 ? i : void 0),

      dialog: {
        state: false,
        btnTrigger: 1,
        dialogTrigger: 0
      }
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
    },

    openDialog () {
      this.dialog.state = true
      this.dialog.dialogTrigger += 1
    },

    closeDialog () {
      this.dialog.btnTrigger += 1
    }
  }
}
</script>
