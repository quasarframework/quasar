<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input
        :loading="loadingState"
        filled
        v-model="text"
        label="Label"
      />
      <q-toggle v-model="loadingState" label="Loading state" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      text: '',
      loadingState: false
    }
  }
}
</script>
