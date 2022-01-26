<template>
  <div class="q-pa-md relative-position" style="min-height: 300px">
    <div class="absolute-bottom-right q-ma-lg">
      <div ref="refFab" class="absolute-center bg-accent" style="border-radius: 50%; width: 50%; height: 50%" />

      <q-fab
        direction="up"
        icon="add"
        color="accent"
        @update:model-value="val => val === true && morph(false)"
      >
        <q-fab-action color="primary" @click="morph(true)" icon="alarm" />
      </q-fab>
    </div>

    <q-card
      v-if="toggle"
      ref="refCard"
      class="my-card text-white absolute-center bg-grey-10"
      @click="morph(false)"
    >
      <q-card-section>
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { morph } from 'quasar'
import { ref } from 'vue'

export default {
  setup () {
    const toggle = ref(false)
    const refFab = ref(null)
    const refCard = ref(null)

    return {
      toggle,
      refFab,
      refCard,
      lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

      morph (state) {
        if (state !== toggle.value) {
          const getFab = () => refFab.value
          const getCard = () => refCard.value ? refCard.value.$el : void 0

          morph({
            from: toggle.value === true ? getCard : getFab,
            to: toggle.value === true ? getFab : getCard,
            onToggle: () => {
              toggle.value = state
            },
            duration: 500
          })
        }
      }
    }
  }
}
</script>
