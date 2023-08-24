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
      file: ref(null),
      files: ref(null),

      submitted,
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

        submitted.value = true
        submitResult.value = data
        submitEmpty.value = data.length === 0
      }
    }
  }
}
</script>
