<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="q-mt-xl">
        <q-range
          name="price_range"
          v-model="range"
          label-always
        />
      </div>

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

    <q-card
      v-if="submitResult.length > 0"
      flat bordered
      class="q-mt-md"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
    >
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
    const submitResult = ref([])

    return {
      range: ref({
        min: 10,
        max: 50
      }),

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

        submitResult.value = data
      }
    }
  }
}
</script>
