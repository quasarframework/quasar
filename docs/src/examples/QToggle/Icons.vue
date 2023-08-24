<template>
  <div class="q-pa-md q-gutter-sm">
    <div>
      <q-toggle
        v-model="first"
        icon="alarm"
      />
      <q-toggle
        v-model="second"
        color="pink"
        icon="mail"
        label="Same Icon for each state"
      />
    </div>

    <div>
      <q-toggle
        v-model="third"
        checked-icon="check"
        color="green"
        unchecked-icon="clear"
      />
      <q-toggle
        v-model="fourth"
        checked-icon="check"
        color="red"
        label="Different icon for each state"
        unchecked-icon="clear"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      first: ref(true),
      second: ref(true),
      third: ref(false),
      fourth: ref(true)
    }
  }
}
</script>
