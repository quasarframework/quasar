<template>
  <div class="q-layout-padding">
    <!--
      This is for fast tests.
      Use this page but don't add it into your commits (leave it outside
      of your commit).

      For some test that you think it should be persistent,
      make a new *.vue file here or in another folder under /dev/components.
    -->
  </div>
</template>

<script>
/* eslint-disable */
import { debounce } from 'quasar'

const method = debounce(function(){},500)

console.log('global', method, method.cancel)

export default {
  data () {
    return {
    }
  },
  methods: {
    myMethod: method
  },
  created () {
    this.jim = debounce(function(){},500)
    console.log('local', this.jim, this.jim.cancel)
  },
  beforeDestroy() {
    console.log(this.jim.cancel)
    this.jim.cancel()
    console.log(this.myMethod.cancel)
    this.myMethod.cancel() // This won't work!!
  }
}
</script>

<style lang="stylus">
</style>
