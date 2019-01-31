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
export default {
  data () {
    return {
      first: true,
      second: true,
      third: false,
      fourth: true
    }
  }
}
</script>
