<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="bg-grey-2 q-pa-sm rounded-borders">
        Preferred genre:
        <q-option-group
          name="preferred_genre"
          v-model="preferred"
          :options="options"
          color="primary"
          inline
        />
      </div>

      <div class="bg-grey-2 q-pa-sm rounded-borders">
        Accepted genres:
        <q-option-group
          name="accepted_genres"
          v-model="accepted"
          :options="options"
          type="checkbox"
          color="primary"
          inline
        />
      </div>

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

    <q-card v-if="submitResult.length > 0" flat bordered class="q-mt-md bg-grey-2">
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
    }
  }
}
</script>
