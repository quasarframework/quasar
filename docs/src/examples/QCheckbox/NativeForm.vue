<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="bg-grey-2 q-pa-sm rounded-borders">
        <q-checkbox
          name="accept_agreement"
          v-model="acceptAgreement"
          label="Accept agreement"
        />

        <q-checkbox
          name="subscribe_newsletter"
          v-model="subscribeNewsletter"
          label="Subscribe to newsletter"
          true-value="YES"
        />
      </div>

      <div class="bg-grey-2 q-pa-sm rounded-borders">
        <q-checkbox
          name="music_genre"
          v-model="genreRock"
          true-value="rock"
          label="Rock"
        />

        <q-checkbox
          name="music_genre"
          v-model="genreFunk"
          true-value="funk"
          label="Funk"
        />

        <q-checkbox
          name="music_genre"
          v-model="genrePop"
          true-value="pop"
          label="Pop"
        />
      </div>

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

    <q-card v-if="submitEmpty" flat bordered class="q-mt-md bg-grey-2">
      <q-card-section>
        Submitted form contains empty formData.
      </q-card-section>
    </q-card>
    <q-card v-else-if="submitResult.length > 0" flat bordered class="q-mt-md bg-grey-2">
      <q-card-section>Submitted form contains the following formData (key = value):</q-card-section>
      <q-separator />
      <q-card-section class="row q-gutter-sm items-center">
        <div
          v-for="(item, index) in submitResult"
          :key="index"
          class="q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap"
        >{{ item.name }} = {{ item.value }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      acceptAgreement: false,
      subscribeNewsletter: null,

      genreRock: 'rock',
      genreFunk: false,
      genrePop: 'pop',

      submitEmpty: false,
      submitResult: []
    }
  },

  methods: {
    onSubmit (evt) {
      const formData = new FormData(evt.target)
      const submitResult = []

      for (const [ name, value ] of formData.entries()) {
        submitResult.push({
          name,
          value
        })
      }

      this.submitResult = submitResult
      this.submitEmpty = submitResult.length === 0
    }
  }
}
</script>
