<template>
  <div class="layout-padding">
    <div>
      <q-icon :name="icon" class="gigi" style="font-size: 5rem;" @click="clicked" />
      <span style="margin: 0 15px;">{{icon}}</span>
      <q-icon :name="icon" class="gigi" style="font-size: 5rem;">
        <q-tooltip>{{icon}}</q-tooltip>
      </q-icon>
    </div>
    <q-option-group
      type="radio"
      v-model="icon"
      :options="[
        {value: 'cloud', label: 'A Material icon'},
        {value: 'fa-github', label: 'A Font Awesome icon'},
        {value: 'ion-social-apple-outline', label: 'A Ionicon'}
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
  },
  methods: {
    clicked () {
      console.log('clicked')
    }
  }
}
</script>
