<template>
  <div>
    <div class="layout-padding">
      <q-stepper v-model="step" ref="stepper1" :loading="loading">
        <q-stepper-header :alternative-labels="alternativeLabels">
          <q-step :step="1" icon="alarm" :editable="editable[1]">
            Step 1
          </q-step>

          <q-step :step="2" :editable="editable[2]">
            Step 2
            <small>Almost there</small>
          </q-step>

          <q-step :step="3" icon="bluetooth" error :editable="editable[3]">
            Step 3
          </q-step>

          <q-step :step="4" icon="bluetooth" :editable="editable[4]">
            Step 4
          </q-step>

          <q-step :step="5" icon="wifi" :editable="editable[5]">
            Step 5 Step 4 Step 4 Step 4 Step 4 Step 4
          </q-step>

        </q-stepper-header>

        <q-step-pane :step="1">
          For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="next">Continue</q-btn>
          </div>
        </q-step-pane>
        <q-step-pane :step="2">
          An ad group contains one or more ads which target a shared set of keywords.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="next">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>
        <q-step-pane :step="3">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="next">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>

        <q-step-pane :step="4">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="next">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>

        <q-step-pane :step="5">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="$refs.stepper1.goToStep(1)">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>
      </q-stepper>

      <br><br>

      <q-stepper v-model="step" ref="stepper2" :loading="loading">
        <q-stepper-header :alternative-labels="alternativeLabels">
          <q-step :step="1" icon="alarm">
            Step 1
          </q-step>

          <q-step :step="2">
            Step 2
            <small>Almost there</small>
          </q-step>

          <q-step :step="3" icon="bluetooth" error>
            Step 3
          </q-step>

          <q-step :step="4" icon="wifi">
            Step 4 Step 4 Step 4 Step 4 Step 4 Step 4
          </q-step>

        </q-stepper-header>

        <q-step-pane :step="1">
          For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.
        </q-step-pane>
        <q-step-pane :step="2">
          An ad group contains one or more ads which target a shared set of keywords.
        </q-step-pane>
        <q-step-pane :step="3">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.
        </q-step-pane>
        <q-step-pane :step="4">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.
        </q-step-pane>

        <q-stepper-navigation>
          <q-btn slot="left" class="primary clear" :disabled="step < 2" @click="$refs.stepper2.previous()">Back</q-btn>
          <q-btn class="primary clear">Cancel</q-btn>
          <q-btn class="primary" @click="$refs.stepper2.next()">Continue</q-btn>
        </q-stepper-navigation>
      </q-stepper>

      <br><br>

      <q-stepper v-model="step" ref="stepper3" :loading="loading">
        <q-step :step="1" icon="alarm">
          Step 1
        </q-step>
        <q-step-pane :step="1">
          For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="$refs.stepper3.next()">Continue</q-btn>
          </div>
        </q-step-pane>

        <q-step :step="2">
          Step 2
          <small>Almost there</small>
        </q-step>
        <q-step-pane :step="2">
          An ad group contains one or more ads which target a shared set of keywords.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="$refs.stepper3.next()">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper3.previous()">Back</q-btn>
          </div>
        </q-step-pane>

        <q-step :step="3" icon="bluetooth" error>
          Step 3
        </q-step>
        <q-step-pane :step="3">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="$refs.stepper3.next()">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper3.previous()">Back</q-btn>
          </div>
        </q-step-pane>

        <q-step :step="4" icon="wifi">
          Step 4
          <small>Please revise</small>
        </q-step>
        <q-step-pane :step="4">
          Try out different ad text to see what brings in the most customers, and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.

          <div style="margin-top: 35px">
            <q-btn class="primary" @click="$refs.stepper3.goToStep(1)">Continue</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper3.previous()">Back</q-btn>
          </div>
        </q-step-pane>
      </q-stepper>

      <q-btn
        class="primary small fixed-bottom-right"
        style="right: 18px; bottom: 18px;"
        @click="reset"
      >
        Reset
      </q-btn>

      <q-toggle v-model="loading" class="fixed-top-left" style="top: 18px; left: 18px;"/>

      <q-toggle v-model="alternativeLabels" class="fixed-top-right" style="top: 18px; right: 18px;"/>

      <span class="label bg-amber fixed-bottom-left" style="left: 18px; bottom: 18px;">
        <span class="left-detail">Step</span> {{ step }} {{ stepMessage }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      step: 1,
      alternativeLabels: true,
      loading: false,
      editable: {1: true, 2: false, 3: false, 4: false, 5: false}
    }
  },
  computed: {
    stepMessage () {
      return `Step ${this.step}`
    }
  },
  methods: {
    next () {
      this.editable[this.step] = true
      this.$refs.stepper1.next()
    },
    reset () {
      this.$refs.stepper1.reset()
      this.$refs.stepper2.reset()
    }
  }
}
</script>
