<template>
  <div>
    <div class="layout-padding">
      <quasar-stepper @finish="finish()" v-ref:stepper v-show="!finished">
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

      <div v-show="finished" class="items-center column justify-center full-width full-height">
        <p class="caption">
          <i class="text-primary" style="font-size: 2rem; margin-right: 1rem;">check</i>
          <span>Finished. Well done!</span>
        </p>
        <button class="primary" @click="reset()">Reset</button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ready: false,
      finished: false
    }
  },
  methods: {
    finish () {
      this.finished = true
    },
    reset () {
      this.$refs.stepper.reset()
      this.finished = false
    }
  }
}
</script>
