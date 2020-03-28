<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="current"
      :max="5"
      :direction-links="true"
      :boundary-links="true"
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
    >
    </q-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      current: 3
    }
  }
}
</script>
