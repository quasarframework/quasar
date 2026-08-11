<template>
  <div class="q-pa-md relative-position" style="min-height: 300px">
    <div class="absolute-bottom-right q-ma-lg">
      <div
        ref="fabRef"
        class="absolute-center bg-accent"
        style="border-radius: 50%; width: 50%; height: 50%"
      />

      <q-fab
        direction="up"
        icon="add"
        color="accent"
        @update:model-value="val => val && morphState(false)"
      >
        <q-fab-action color="primary" @click="morphState(true)" icon="alarm" />
      </q-fab>
    </div>

    <q-card
      v-if="toggle"
      ref="cardRef"
      class="my-card text-white absolute-center bg-grey-10"
      @click="morphState(false)"
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

<script setup>
import { morph } from 'quasar'
import { ref, useTemplateRef } from 'vue'

const toggle = ref(false)
const fabRef = useTemplateRef('fabRef')
const cardRef = useTemplateRef('cardRef')

const getFab = () => fabRef.value
const getCard = () => cardRef.value?.$el

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

function morphState(state) {
  if (state === toggle.value) return

  morph({
    from: toggle.value ? getCard : getFab,
    to: toggle.value ? getFab : getCard,
    onToggle: () => {
      toggle.value = state
    },
    duration: 500
  })
}
</script>
