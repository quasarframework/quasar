<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-select
        name="preferred_genre"
        v-model="preferred"
        :options="options"
        color="primary"
        filled
        clearable
        label="Preferred genre"
      />

      <q-select
        name="accepted_genres"
        v-model="accepted"
        multiple
        :options="options"
        color="primary"
        filled
        clearable
        label="Accepted genres"
      />

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
      preferred: 'rock',
      accepted: [],

      options: [
        {
          label: 'Rock',
          value: 'rock'
        },
        {
          label: 'Funk',
          value: 'funk'
        },
        {
          label: 'Pop',
          value: 'pop'
        }
      ],

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
