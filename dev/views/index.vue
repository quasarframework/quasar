<template>
  Quasar App {{key}}
  <checkbox :model.sync="set"></checkbox>
  {{set}}
</template>

<script>
import Quasar from '../../src'

export default {
  data () {
    return {
      key: Quasar.key.f11,
      set: false
    }
  }
}
</script>
