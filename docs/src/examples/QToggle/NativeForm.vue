<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="q-pa-sm rounded-borders" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
        <q-toggle
          name="music_active"
          v-model="activateMusic"
          label="Activate music"
        />

        <q-toggle
          name="light_active"
          v-model="activateLights"
          label="Activate lights"
          true-value="YES"
        />
      </div>

      <div class="q-pa-sm rounded-borders" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'">
        <q-toggle
          name="music_genre"
          v-model="genreRock"
          true-value="rock"
          label="Rock"
        />

        <q-toggle
          name="music_genre"
          v-model="genreFunk"
          true-value="funk"
          label="Funk"
        />

        <q-toggle
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

    <q-card
      v-if="submitted"
      flat
      bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
      <template v-if="submitEmpty">
        <q-card-section>
          Submitted form contains empty formData.
        </q-card-section>
      </template>
      <template v-else>
        <q-card-section>Submitted form contains the following formData (key = value):</q-card-section>
        <q-separator />
        <q-card-section class="row q-gutter-sm items-center">
          <div
            v-for="(item, index) in submitResult"
            :key="index"
            class="q-px-sm q-py-xs bg-grey-8 text-white rounded-borders text-center text-no-wrap"
          >{{ item.name }} = {{ item.value }}</div>
        </q-card-section>
      </template>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const submitted = ref(false)
    const submitEmpty = ref(false)
    const submitResult = ref([])

    return {
      activateMusic: ref(false),
      activateLights: ref(null),

      genreRock: ref('rock'),
      genreFunk: ref(false),
      genrePop: ref('pop'),

      submitted,
      submitEmpty,
      submitResult,

      onSubmit (evt) {
        const formData = new FormData(evt.target)
        const data = []

        for (const [ name, value ] of formData.entries()) {
          data.push({
            name,
            value
          })
        }

        submitted.value = true
        submitResult.value = data
        submitEmpty.value = data.length === 0
      }
    }
  }
}
</script>
