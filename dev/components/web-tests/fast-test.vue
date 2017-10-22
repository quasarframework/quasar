<template>
  <div class="layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
    <q-field label="gigi">
      <q-input color="amber" v-model="terms" placeholder="Type 'fre'">
        <q-autocomplete
          @search="search"
          :min-characters="3"
          @selected="selected"
        />
      </q-input>
    </q-field>
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
      setTimeout(() => {
        done([
          {
            label: 'one',
            value: 'one'
          },
          {
            label: 'two',
            value: 'two'
          },
          {
            label: 'three',
            value: 'three'
          }
        ])
      }, 1000)
    },
    selected (val) {
      console.log('selected', val)
    }
  }
}
</script>
