<template>
  <div class="q-pa-md">
    <q-option-group
      :options="options"
      type="radio"
      v-model="group"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      group: null,
      options: [
        { label: 'Battery too low', value: 'bat' },
        { label: 'Friend request', value: 'friend', color: 'green' },
        { label: 'Picture uploaded', value: 'upload', color: 'red' }
      ]
    }
  }
}
</script>
