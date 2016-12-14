<template>
  <div>
    <div class="layout-padding" style="max-width: 600px;">
      <q-autocomplete v-model="terms" @search="search" :minCharacters="3" set-width>
        <q-search v-model="terms" />
      </q-autocomplete>

      <br><br>

      <q-autocomplete v-model="terms" @search="search" :minCharacters="3">
        <input v-model="terms" class="full-width"/>
      </q-autocomplete>

      <br><br>

      <q-autocomplete v-model="terms" @search="search" :minCharacters="3" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      terms: ''
    }
  },
  methods: {
    search (terms, done) {
      console.log('triggered', terms)
      setTimeout(() => {
        done([
          {label: 'alarm', secondLabel: 'Mail alarm', icon: 'alarm', stamp: '10 min', value: 'Alarm'},
          {label: 'email 1 Email1', secondLabel: 'Some email, huh?', icon: 'email', secondImg: '/statics/mountains.jpg', value: 'Email1'},
          {label: 'email 2', img: '/statics/mountains.jpg', value: 'Email2'},
          {label: 'email 3', icon: 'email', secondIcon: 'email', value: 'Email3'},
          {label: 'email 4', icon: 'email', value: 'Email4'},
          {label: 'email 5', value: 'Email5'},
          {label: 'email 6', value: 'Email6'},
          {label: 'email 7', icon: 'email', value: 'Email7'},
          {label: 'email 8', icon: 'email', value: 'Email8'},
          {label: 'email 9', icon: 'email', value: 'Email9'},
          {label: 'email 10', icon: 'email', value: 'Email10'},
          {label: 'email 11', icon: 'email', value: 'Email11'}
        ])
      }, 2000)
    }
  }
}
</script>
