<template>
  <div class="layout-padding" style="max-width: 600px;">
    <q-card style="margin-top: 25px">
      <q-card-title class="bg-primary text-center">
        <q-btn push color="orange" @click="show = !show">Toggle</q-btn>
      </q-card-title>
      <q-card-main>
        <q-select filter v-model="enter" :options="enterSelectOptions" stack-label="CSS Enter Class" />
        <q-select filter v-model="leave" :options="leaveSelectOptions" stack-label="CSS Leave Class" />
      </q-card-main>
    </q-card>

    <q-card style="margin-top: 25px" class="overflow-hidden">
      <q-card-title class="text-center">
        Single
      </q-card-title>
      <q-card-main>
        <transition
          appear
          :enter-active-class="enterClass"
          :leave-active-class="leaveClass"
        >
          <div v-if="show" v-html="loremipsum"></div>
        </transition>
      </q-card-main>
    </q-card>

    <q-card style="margin-top: 25px" class="overflow-hidden">
      <q-card-title class="text-center">
        Group
      </q-card-title>
      <q-card-main>
        <transition-group
          appear
          :enter-active-class="enterClass"
          :leave-active-class="leaveClass"
          class="group"
        >
          <div
            v-if="show"
            v-for="n in 3"
            :key="n"
            v-html="loremipsum"
          ></div>
        </transition-group>
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { generalAnimations, inAnimations, outAnimations } from 'quasar-extras/animate/animate-list.js'

function alphabetically (a, b) {
  return a.localeCompare(b)
}
function generateOptions (name) {
  return {
    label: name,
    value: name
  }
}

const enter = generalAnimations.concat(inAnimations).sort(alphabetically)
const leave = generalAnimations.concat(outAnimations).sort(alphabetically)

export default {
  data () {
    return {
      enterSelectOptions: enter.map(generateOptions),
      leaveSelectOptions: leave.map(generateOptions),
      enter: 'bounceInLeft',
      leave: 'bounceOutRight',
      show: true,
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  computed: {
    enterClass () {
      return `animated ${this.enter}`
    },
    leaveClass () {
      return `animated ${this.leave}`
    }
  }
}
</script>
