<template>
  <div>
    <div class="layout-padding">
      <quasar-stepper @finish="finish()" v-ref:stepper>
        <quasar-step title="Select campaign settings">
          For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.
        </quasar-step>
        <quasar-step title="Create an ad group" :ready="ready">
          An ad group contains one or more ads which target a shared set of keywords.
          <br><br>
          <label>
            <quasar-toggle :model.sync="ready"></quasar-toggle>
            Enable next step
          </label>
        </quasar-step>
        <quasar-step title="Create an ad">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.
        </quasar-step>
      </quasar-stepper>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ready: false
    }
  },
  methods: {
    finish () {
      console.log('ready!')
    }
  }
}
</script>
