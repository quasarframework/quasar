<template>
  <div class="q-pa-md relative-position" style="height: 400px; max-height: 80vh">
    <q-btn
      v-morph:dialog:300.resize="btnTrigger"
      class="absolute-bottom-left q-ma-md"
      fab
      color="primary"
      size="lg"
      icon="add"
      @click="cardTrigger = showCardStep1"
    />

    <q-card
      v-morph:dialog:500.resize="cardTrigger"
      class="absolute-bottom-left q-ma-md bg-primary text-white"
      style="width: 300px; border-bottom-left-radius: 2em"
    >
      <template v-if="cardStep === 1">
        <q-card-section>
          <div class="text-h6">
            New user
          </div>
        </q-card-section>

        <q-card-section>
          Please fill the details for a new user.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Next" @click="cardTrigger = showCardStep2" />
        </q-card-actions>
      </template>

      <template v-else>
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
          <q-btn flat label="Close" @click="btnTrigger += 1" />
        </q-card-actions>
      </template>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      btnTrigger: 1,
      cardTrigger: 0,
      cardStep: 0
    }
  },

  methods: {
    showCardStep1 () {
      this.cardStep = 1
    },

    showCardStep2 () {
      this.cardStep = 2
    }
  }
}
</script>
