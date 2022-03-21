<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-file
        name="poster_file"
        v-model="file"
        filled
        label="Select poster image"
      />

      <q-file
        name="cover_files"
        v-model="files"
        filled
        multiple
        use-chips
        label="Select cover images"
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
import { ref } from 'vue'

export default {
  setup () {
    const submitEmpty = ref(false)
    const submitResult = ref([])

    return {
      file: ref(null),
      files: ref(null),

      submitEmpty,
      submitResult,

      onSubmit (evt) {
        const formData = new FormData(evt.target)
        const data = []

        for (const [ name, value ] of formData.entries()) {
          if (value.name.length > 0) {
            data.push({
              name,
              value: value.name
            })
          }
        }

        submitResult.value = data
        submitEmpty.value = data.length === 0
      }
    }
  }
}
</script>
