<template>
  <div>
    <div class="layout-padding">
      <q-stepper v-model="step" ref="stepper1" :loading="loading">
        <q-stepper-header :alternative-labels="alternativeLabels" setVerticality>
          <q-step :done="done[1]"  :step="1" icon="alarm" :editable="editable[1]">
            Step 1
          <small v-show="step === 1">Let's get going!</small>
          </q-step>

          <q-step :done="done[2]" :step="2" icon="compare_arrows" :editable="editable[2]">
            Step 2
            <small v-show="step === 2">One small step for man!</small>
          </q-step>

          <q-step :done="done[3]" :step="3" icon="accessibility" :error="option === 'opt2'" :editable="editable[3]">
            Step 3
            <small v-show="step === 3">One giant step for mankind!</small>
          </q-step>

          <q-step :done="done[4]" :step="4" icon="bluetooth" :editable="editable[4]">
            Step 4
            <small v-show="step === 4">Almost there!</small>
          </q-step>

          <q-step :step="5" icon="wifi" :editable="editable[5]">
            Step 5
            <small v-show="step === 5">Well Done!</small>
          </q-step>

        </q-stepper-header>

        <q-step-pane :step="1">
          <p>
            Hi ! This is the first step. Usually it is for giving instructions for the rest of the wizard.
            Go ahead and press "Continue" to move to the next step. If you want to go back a step in the process, press "Back".
          </p>
          <div style="margin-top: 35px">
            <q-btn class="primary" @click="next">{{ buttonText }}</q-btn>
          </div>
        </q-step-pane>
        <q-step-pane :step="2">
          <p>
            Great! You made it a step further. Usually you'd have some sort of form for the user to add input here.
            You would also probably have some logic, which would stop the user from continuing, should he or she not add the right input.
          </p>
          <label>
            <q-toggle v-model="toggeledOn"></q-toggle>
            Check to Continue
          </label>
          <div style="margin-top: 35px">
            <q-btn :disable="toggeled" :class="buttonClasses" @click="next">{{ buttonText }}</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>
        <q-step-pane :step="3">
          <p>
            Now were gaining momentum! Notice how the steps in the header are "clickable", once you get past that step.
            Cool huh? Play with the selection below. See the icon change?
          </p>

          <div class="column group">
            <label>
              <q-radio v-model="option" val="opt1"></q-radio>
              Pick this one!
            </label>
            <label>
              <q-radio v-model="option" val="opt2"></q-radio>
              Don't pick this one!
            </label>
          </div>
          <br/>
          <p>
            Go ahead now with the "Continue" button. Or go back. It's nice to be able to go back too, isn't it?
          </p>

          <div style="margin-top: 35px">
            <q-btn :disable="buttonDisabled" :class="buttonClasses" @click="next">{{ buttonText }}</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>

        <q-step-pane :step="4">
          <p>
            Let's get some more input. Notice the "Continue" button is once again disabled. Go ahead and add your first name.
          </p>
          <p class="caption">First Name:</p>
          <input v-model="firstName" placeholder="Add your first name here!">

          <div style="margin-top: 35px">
            <q-btn :disable="buttonDisabled" :class="buttonClasses" @click="next">{{ buttonText }}</q-btn>
            <q-btn class="primary clear" @click="$refs.stepper1.previous()">Back</q-btn>
          </div>
        </q-step-pane>

        <q-step-pane :step="5">
          <p>
            All right {{ firstName }}! You've just enjoyed the coolness of Quasar's stepper component.
            If you click "Finish", you'll be taken back to step one again and everything will be reset.
          </p>
          <p>
            Enjoy Quasar and have fun!
          </p>
          <div style="margin-top: 35px">
            <q-btn class="primary" @click="reset()">{{ buttonText }}</q-btn>
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

          <q-step :step="3" icon="bluetooth">
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
          <q-btn class="primary" @click="$refs.stepper2.next()">{{ buttonText }}</q-btn>
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

      <div class="fixed-top-left">
        <q-toggle v-model="loading"  style="top: 18px; left: 18px;"/>
         <q-tooltip anchor="bottom right" self="center left" :offset="[10, 10]">
           Turn on to see the progress spinners.
         </q-tooltip>
      </div>

      <div class="fixed-top-right">
        <q-toggle v-model="alternativeLabels" style="top: 18px; right: 18px;"/>
         <q-tooltip anchor="bottom left" self="center right" :offset="[10, 10]">
           Turn on to see the alternative lables.
         </q-tooltip>
      </div>



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
      lastStep: 5,
      alternativeLabels: true,
      loading: false,
      firstName: '',
      toggeledOn: false,
      editable: {1: true, 2: false, 3: false, 4: false, 5: false},
      done: {1: false, 2: false, 3: false, 4: false, 5: false},
      option: ''
    }
  },
  computed: {
    stepMessage () {
      return `Step ${this.step}`
    },
    buttonText () {
      return this.step !== this.lastStep
      ? 'Continue'
      : 'Finish'
    },
    buttonClasses () {
      if ((this.step === 2 && !this.toggeledOn) ||
          (this.step === 3 && this.option === 'opt2') ||
          (this.step === 4 && this.firstName === '')
          ) {
        return 'primary disabled'
      }
      return 'primary'
    },
    buttonDisabled () {
      if ((this.step === 3 && this.option === 'opt2') ||
          (this.step === 4 && this.firstName === '')) {
        return true
      }
      return false
    },
    toggeled () {
      if (this.toggeledOn) {
        this.editable = {1: true, 3: true}
        return false
      }
      else if (this.step === 2) {
        this.editable = {1: true, 3: false}
        return true
      }
    }
  },
  methods: {
    next () {
      this.done[this.step] = true
      this.editable[this.step] = true
      this.$refs.stepper1.next()
    },
    reset () {
      this.$refs.stepper1.reset()
      this.$refs.stepper2.reset()
      this.step = 1
      this.firstName = ''
      this.toggeledOn = false
      this.editable = {1: false, 2: false, 3: false, 4: false, 5: false}
      this.done = {1: false, 2: false, 3: false, 4: false, 5: false}
    }
  }
}
</script>
