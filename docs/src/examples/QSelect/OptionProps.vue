<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
        :options="options"
        filled
        option-disable="blocked"
        option-label="company"
        option-value="id"
        v-model="selected">
    </q-select>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selected: null,
      options: [
        {
          'id': 1,
          'company': 'Google',
          'blocked': false
        },
        {
          'id': 2,
          'display-name': 'Facebook Inc.',
          'company': 'Facebook',
          'blocked': false
        },
        {
          'id': 3,
          'company': 'Twitter',
          'blocked': true
        }
      ]
    }
  }
}
</script>
