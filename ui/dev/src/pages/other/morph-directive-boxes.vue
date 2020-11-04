<template>
  <div class="q-pa-md relative-position bg-grey-1" style="width: 600px; max-width: 100vw; height: 600px; max-height: 80vh">
    <div
      class="absolute-top-left bg-red text-white q-ma-md q-pa-lg"
      style="border-radius: 10px"
      v-morph:topleft:boxes:800="modelBox"
    >
      Top left
    </div>

    <div
      class="absolute-top-right bg-blue text-white q-ma-lg q-pa-xl"
      style="border-radius: 20px"
      v-morph:topright:boxes:1200.tween="modelBox"
    >
      Top right
    </div>

    <div
      class="absolute-bottom-right bg-orange text-white q-ma-lg q-pa-lg"
      style="border-radius: 0"
      v-morph:bottomright:boxes:400="modelBox"
    >
      Bottom right
    </div>

    <div
      class="absolute-bottom-left bg-green text-white q-ma-xl q-pa-md"
      style="border-radius: 40px"
      v-morph:bottomleft:boxes:1400.resize.tween="modelBox"
    >
      Bottom left
    </div>

    <q-btn
      class="absolute-center"
      :label="`Toggle [${modelBox}]`"
      @click="toggleBoxes"
    />

    <q-btn
      v-morph:btn:dialog:300="morphBox"
      class="fixed-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="toggleMorph"
    />

    <q-card
      v-morph:card:dialog:500:transitionend.resize="morphBox"
      class="fixed-bottom-left bg-primary text-white q-mr-auto q-mt-auto q-mb-sm q-ml-sm"
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
        <q-btn flat label="OK" @click="toggleMorph" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
const boxValues = [
  'topleft',
  'topright',
  'bottomleft',
  'bottomright'
]

export default {
  data () {
    return {
      modelBox: 'topleft',
      morphBox: 'btn'
    }
  },

  methods: {
    toggleBoxes () {
      let value = this.modelBox

      while (value === this.modelBox) {
        const i = Math.floor(Math.random() * boxValues.length)
        value = boxValues[i]
      }

      this.modelBox = value
    },

    toggleMorph () {
      this.morphBox = this.morphBox === 'card'
        ? 'btn'
        : 'card'
    }
  }
}
</script>
