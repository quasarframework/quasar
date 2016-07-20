<template>
  Quasar App {{key}}
  <checkbox :model.sync="set"></checkbox>
  {{set}}
</template>

<script>
import { Keycodes } from 'quasar-framework'

export default {
  data () {
    return {
      key: Keycodes.f11,
      set: false
    }
  }
}
</script>
