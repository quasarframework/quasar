<template>
  <div class="q-pa-md relative-position" style="height: 280px; max-height: 80vh">
    <q-btn
      v-morph:btn:mygroup:300.resize="morphGroupModel"
      class="absolute-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="nextMorph"
    />

    <q-card
      v-morph:card1:mygroup:500.resize="morphGroupModel"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <q-card-section class="text-h6">
        New user
      </q-card-section>

      <q-card-section class="text-subtitle1">
        Please fill the details for a new user.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Next" @click="nextMorph" />
      </q-card-actions>
    </q-card>

    <q-card
      v-morph:card2:mygroup:500.tween="morphGroupModel"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <q-card-section class="text-h6">
        Finalize registration
      </q-card-section>

      <q-card-section class="q-py-xl text-center text-subtitle2">
        Thank you for registering.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" @click="nextMorph" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

const nextMorphStep = {
  btn: 'card1',
  card1: 'card2',
  card2: 'btn'
}

export default {
  setup () {
    const morphGroupModel = ref('btn')

    return {
      morphGroupModel,
      nextMorph () {
        morphGroupModel.value = nextMorphStep[ morphGroupModel.value ]
      }
    }
  }
}
</script>
