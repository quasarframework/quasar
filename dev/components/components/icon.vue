<template>
  <div class="layout-padding">
    <div>
      <q-icon :icon="icon" class="gigi" style="font-size: 3rem;" /> Text
    </div>
    <q-input-group type="radio" v-model="icon" :options="[
      {value: 'cloud', label: 'Material'},
      {value: 'fa-github', label: 'Github'}
    ]" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: 'cloud'
    }
  }
}
</script>
