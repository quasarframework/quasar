<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="date" clearable stack-label label="Date" mask="##/##/####">
      <q-popup-proxy ref="qDatePopupRef">
        <q-date v-model="date" minimal mask="DD/MM/YYYY" @update:model-value="closeQDatePopup" />
      </q-popup-proxy>
    </q-input>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const qDatePopupRef = ref(null)
    return {
      date: ref('01/02/2022'),
      qDatePopupRef,
      closeQDatePopup: () => qDatePopupRef.value.hide()
    }
  }
}
</script>
