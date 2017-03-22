<template>
  <div class="layout-padding">
    <div>
      <q-icon :icon="icon" class="gigi" style="font-size: 3rem;" /> Text
    </div>
    <q-input-group
      type="radio"
      v-model="icon"
      :options="[
        {value: 'cloud', label: 'A Material icon'},
        {value: 'fa-github', label: 'A Font Awesome icon'}
      ]"
      style="margin-top: 25px"
    />
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
