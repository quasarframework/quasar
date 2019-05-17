<template>
  <div class="q-pa-md" style="max-width: 300px">
    <div class="q-gutter-md">
      <q-badge color="secondary">Id model: "{{ id }}"</q-badge>
      <q-input
        filled
        v-model="id"
        label="Special Id"
        mask="###/##"
        unmasked-value
        hint="Mask: ###/##"
      />

      <q-badge color="secondary">Phone model: "{{ phone }}"</q-badge>
      <q-input
        filled
        v-model="phone"
        label="Phone"
        mask="(###) ### - ####"
        unmasked-value
        hint="Mask: (###) ### - ####"
      />

      <q-badge color="secondary">Card model: "{{ card }}"</q-badge>
      <q-input
        filled
        v-model="card"
        label="Card"
        mask="#### - #### - #### - ####"
        fill-mask="#"
        unmasked-value
        hint="Mask: #### - #### - #### - ####, FillMask: #"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: null,
      phone: null,
      card: null
    }
  }
}
</script>
