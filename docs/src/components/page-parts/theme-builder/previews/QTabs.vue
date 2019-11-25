<template lang="pug">
q-tabs(v-model="tab")
  q-tab(name="tab1" label="Tab 1")
  q-tab(name="tab2" label="Tab 2" icon="star")
  q-tab(name="tab3" icon="close")
</template>

<script>

export default {
  data () {
    return {
      tab: 'tab1'
    }
  }
}

</script>
