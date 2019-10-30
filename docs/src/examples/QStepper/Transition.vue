<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      contracted
      transition-prev="scale"
      transition-next="scale"
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
        color="purple"
      >
        For each ad campaign that you create, you can control how much you're willing to
        spend on clicks and conversions, which networks and geographical locations you want
        your ads to show on, and more.
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
        color="purple"
      >
        An ad group contains one or more ads which target a shared set of keywords.
      </q-step>

      <q-step
        :name="3"
        title="Create an ad"
        icon="add_comment"
        color="purple"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.
      </q-step>
    </q-stepper>

    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      contracted
      transition-prev="jump-up"
      transition-next="jump-down"
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
        color="orange"
      >
        For each ad campaign that you create, you can control how much you're willing to
        spend on clicks and conversions, which networks and geographical locations you want
        your ads to show on, and more.
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
        color="orange"
      >
        An ad group contains one or more ads which target a shared set of keywords.
      </q-step>

      <q-step
        :name="3"
        title="Create an ad"
        icon="add_comment"
        color="orange"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.
      </q-step>
    </q-stepper>

    <q-stepper
      v-model="step"
      ref="stepper"
      animated
      contracted
      transition-prev="slide-left-then-fade"
      transition-next="slide-right-then-fade"
      :transition-duration="{ enter: 2000, leave: 1000 }"
    >
      <q-step
        :name="1"
        title="Select campaign settings"
        icon="settings"
        :done="step > 1"
        color="teal"
        class="nested-fade"
      >
        For each ad campaign that you create, you can control how much you're willing to
        spend on clicks and conversions, which networks and geographical locations you want
        your ads to show on, and more.
      </q-step>

      <q-step
        :name="2"
        title="Create an ad group"
        caption="Optional"
        icon="create_new_folder"
        :done="step > 2"
        color="teal"
        class="nested-fade"
      >
        An ad group contains one or more ads which target a shared set of keywords.
      </q-step>

      <q-step
        :name="3"
        title="Create an ad"
        icon="add_comment"
        color="teal"
        class="nested-fade"
      >
        Try out different ad text to see what brings in the most customers, and learn how to
        enhance your ads using features like ad extensions. If you run into any problems with
        your ads, find out how to tell if they're running and how to resolve approval issues.
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn @click="$refs.stepper.next()" color="deep-orange" :label="step === 3 ? 'Finish' : 'Continue'" />
          <q-btn v-if="step > 1" flat color="deep-orange" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
export default {
  data () {
    return {
      step: 1
    }
  }
}
</script>

<style lang="stylus">
/* A nested transition to demonstrate the transition-duration property */
.q-transition

  &--slide-left-then-fade
  &--slide-right-then-fade

    &-leave-active
      position absolute

    &-enter-active
      transition transform 1s ease-in-out

      & .nested-fade
        transition opacity 1s ease-in 1s

    &-leave-active
      transition transform 1s ease-in-out

      & .nested-fade
        transition opacity 1s ease-out

    &-enter .nested-fade
    &-leave .nested-fade
    &-leave-to .nested-fade
      opacity 0

  &--slide-right-then-fade
    &-enter
      transform translate3d(-100%, 0, 0)
    &-leave-to
      transform translate3d(100%, 0, 0)

  &--slide-left-then-fade
    &-enter
      transform translate3d(100%, 0, 0)
    &-leave-to
      transform translate3d(-100%, 0, 0)

</style>
