<template>
  <div class="q-layout-padding">
    <div class="xs">
      XS (<strong>{{ first }}</strong>)
    </div>
    <div class="sm">
      SM (<strong>{{ second }}</strong>)
    </div>
    <div class="md">
      MD (<strong>{{ last }}</strong>)
    </div>
    <div>{{ conf }}</div>
    <div class="row ex">
      <div :class="conf">
        First
      </div>
      <div :class="conf">
        Second
      </div>
      <div :class="conf">
        Last
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      conf: 'col-xs-4 col-sm-auto col-md-6'
    }
  },
  computed: {
    split () {
      return this.conf.split(' ')
    },
    first () {
      return this.split[ 0 ]
    },
    second () {
      return this.split[ 1 ]
    },
    last () {
      return this.split[ 2 ]
    }
  }
}
</script>

<style lang="sass">
.ex
  border: 1px solid #ccc
  padding: 2px
  > div
    background: #ddd
    border: 1px solid #ccc
    padding: 5px
</style>
