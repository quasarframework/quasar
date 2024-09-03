<template>
  <div class="q-pa-md relative-position" style="height: 400px; max-height: 80vh">
    <q-btn
      v-morph:btn:dialog:300.resize="morphModel"
      class="absolute-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="nextMorph"
    />

    <q-card
      v-morph:card1:dialog:500.resize="morphModel"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <q-card-section>
        <div class="text-h6">
          New user
        </div>
      </q-card-section>

      <q-card-section>
        Please fill the details for a new user.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Next" @click="nextMorph" />
      </q-card-actions>
    </q-card>

    <q-card
      v-morph:card2:dialog:500.tween="morphModel"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <q-card-section>
        <div class="text-h6">
          Finalize registration
        </div>
      </q-card-section>

      <q-card-section class="q-py-xl text-center">
        <div class="text-h6">
          Thank you for registering.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" @click="nextMorph" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
const nextMorph = {
  btn: 'card1',
  card1: 'card2',
  card2: 'btn'
}

export default {
  data () {
    return {
      morphModel: 'btn'
    }
  },

  methods: {
    nextMorph () {
      this.morphModel = nextMorph[ this.morphModel ]
    }
  }
}
</script>
