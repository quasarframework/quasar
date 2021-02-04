<template>
  <div class="q-layout-padding q-mx-auto" style="max-width: 600px">
    <q-card style="margin-top: 25px">
      <q-card-section class="bg-primary text-center">
        <q-btn push color="orange" @click="show = !show">Toggle</q-btn>
      </q-card-section>

      <q-card-section>
        <div class="caption text-center text-italic">
          (only 4 anims showcased here)
        </div>

        <br />

        <div class="row no-wrap q-col-gutter-sm">
          <q-select
            class="col"
            v-model="enter"
            :options="enterSelectOptions"
            emit-value
            stack-label
            label="CSS Enter Class"
          />

          <q-select
            class="col"
            v-model="leave"
            :options="leaveSelectOptions"
            emit-value
            stack-label
            label="CSS Leave Class"
          />
        </div>

        <br />

        <div class="row no-wrap q-col-gutter-sm">
          <q-select
            class="col"
            v-model="duration"
            :options="durationOptions"
            emit-value
            stack-label
            label="Animation Duration"
          />

          <q-select
            class="col"
            v-model="delay"
            :options="delayOptions"
            emit-value
            stack-label
            label="Animation Delay"
          />

          <q-select
            class="col"
            v-model="repeat"
            :options="repeatOptions"
            emit-value
            stack-label
            label="Animation Repeat"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card style="margin-top: 25px" class="overflow-hidden">
      <q-card-section class="text-center">
        <div class="text-h6">Continuous Enter</div>
      </q-card-section>

      <q-card-section>
        <transition appear>
          <div
            v-if="showContinuous"
            :class="continuousClasses"
            v-html="loremipsum"
          />
        </transition>
      </q-card-section>
    </q-card>

    <q-card style="margin-top: 25px" class="overflow-hidden">
      <q-card-section class="text-center">
        <div class="text-h6">Single</div>
      </q-card-section>

      <q-card-section>
        <transition
          appear
          :enter-active-class="enterClass"
          :leave-active-class="leaveClass"
        >
          <div v-if="show" v-html="loremipsum" />
        </transition>
      </q-card-section>
    </q-card>

    <q-card style="margin-top: 25px" class="overflow-hidden">
      <q-card-section class="text-center">
        <div class="text-h6">Group</div>
      </q-card-section>

      <q-card-section>
        <transition-group
          appear
          :enter-active-class="enterClass"
          :leave-active-class="leaveClass"
          class="group"
        >
          <template v-if="show">
            <div v-for="n in 3" :key="n" v-html="loremipsum" />
          </template>
        </transition-group>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'
import '@quasar/extras/animate/bounceInLeft.css'
import '@quasar/extras/animate/bounceOutRight.css'

function generateOptions (name) {
  return {
    label: name,
    value: name
  }
}

const enter = ['fadeIn', 'bounceInLeft']
const leave = ['fadeOut', 'bounceOutRight']

export default {
  data () {
    return {
      enterSelectOptions: enter.map(generateOptions),
      leaveSelectOptions: leave.map(generateOptions),
      durationOptions: ['faster', 'fast', 'default', 'slow', 'slower'],
      delayOptions: ['default', '1s', '2s', '3s', '4s', '5s'],
      repeatOptions: ['default', '1', '2', '3', 'infinite'],
      enter: 'bounceInLeft',
      leave: 'bounceOutRight',
      duration: 'default',
      delay: 'default',
      repeat: 'default',
      show: true,
      showContinuous: true,
      loremipsum: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  watch: {
    // v-if hack to trigger animation
    show () {
      this.showContinuous = false

      this.$nextTick(() => {
        this.showContinuous = true
      })
    }
  },
  computed: {
    baseClasses () {
      let classes = 'animated'

      if (this.duration !== 'default') {
        classes += ` ${this.duration}`
      }

      if (this.delay !== 'default') {
        classes += ` delay-${this.delay}`
      }

      return classes
    },
    enterClass () {
      return `${this.baseClasses} ${this.enter}`
    },
    leaveClass () {
      return `${this.baseClasses} ${this.leave}`
    },
    continuousClasses () {
      let classes = this.baseClasses

      if (this.repeat !== 'default') {
        classes += this.repeat === 'infinite' ? ' infinite' : ` repeat-${this.repeat}`
      }

      return `${classes} ${this.enter}`
    }
  }
}
</script>
