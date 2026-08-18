<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary">Model: "{{ phone }}"</q-badge>

      <q-input
        filled
        v-model="phone"
        label="Phone (BR)"
        :mask="phoneMask"
        unmasked-value
        hint="8 digits: (##) ####-####, 9 digits: (##) #####-####"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const phone = ref('')

// Brazilian landlines have 8 local digits, mobiles 9; pick the mask
// from the unmasked length. Keeping the model unmasked (unmasked-value)
// is what makes this reliable: the plain digit count decides, unaffected
// by the literals of whichever mask is currently applied.
const phoneMask = computed(() =>
  phone.value !== null && phone.value.length > 10
    ? '(##) #####-####'
    : '(##) ####-#####'
)
</script>
