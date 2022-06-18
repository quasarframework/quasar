<template>
  <div class="q-pa-md">
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-knob
        name="volume"
        class="text-white q-ma-md"
        v-model="volume"
        size="90px"
        :thickness="0.2"
        color="orange"
        center-color="grey-8"
        track-color="transparent"
        show-value
      >
        <q-icon name="volume_up" />
      </q-knob>

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
      </div>
    </q-form>

    <q-card flat bordered class="q-mt-md bg-grey-2" v-if="submitResult.length > 0">
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
      volume: ref(60),
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
