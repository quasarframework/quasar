<template>
  <div class="q-layout-padding q-mx-auto" style="max-width: 600px">
    <q-card class="q-mt-sm">
      <q-card-section class="bg-primary text-center">
        <q-btn push color="orange" @click="show = !show">Toggle</q-btn>
      </q-card-section>

      <q-card-section>
        <div class="caption text-center text-italic q-mb-sm"
          >(only 4 anims showcased here)</div
        >

        <div class="row q-col-gutter-sm">
          <q-select
            class="col-6"
            v-model="enter"
            :options="enterSelectOptions"
            emit-value
            stack-label
            outlined
            dense
            label="CSS Enter Class"
          />

          <q-select
            class="col-6"
            v-model="leave"
            :options="leaveSelectOptions"
            emit-value
            stack-label
            outlined
            dense
            label="CSS Leave Class"
          />

          <q-select
            class="col-4"
            v-model="duration"
            :options="durationOptions"
            emit-value
            stack-label
            outlined
            dense
            label="Animation Duration"
          />

          <q-select
            class="col-4"
            v-model="delay"
            :options="delayOptions"
            emit-value
            stack-label
            outlined
            dense
            label="Animation Delay"
          />

          <q-select
            class="col-4"
            v-model="repeat"
            :options="repeatOptions"
            emit-value
            stack-label
            outlined
            dense
            label="Animation Repeat"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-sm overflow-hidden">
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

    <q-card class="q-mt-sm overflow-hidden">
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

    <q-card class="q-mt-sm overflow-hidden">
      <q-card-section class="text-center">
        <div class="text-h6">Group</div>
      </q-card-section>

      <q-card-section>
        <transition-group
          appear
          :enter-active-class="enterClass"
          :leave-active-class="leaveClass"
        >
          <template v-if="show">
            <div v-for="n in 3" :key="n" class="q-py-xs" v-html="loremipsum" />
          </template>
        </transition-group>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'
import '@quasar/extras/animate/bounceInLeft.css'
import '@quasar/extras/animate/bounceOutRight.css'

function generateOptions(name) {
  return {
    label: name,
    value: name
  }
}

const enterAnimations = ['fadeIn', 'bounceInLeft']
const leaveAnimations = ['fadeOut', 'bounceOutRight']

const enterSelectOptions = ref(enterAnimations.map(generateOptions))
const leaveSelectOptions = ref(leaveAnimations.map(generateOptions))
const durationOptions = ref(['faster', 'fast', 'default', 'slow', 'slower'])
const delayOptions = ref(['default', '1s', '2s', '3s', '4s', '5s'])
const repeatOptions = ref(['default', '1', '2', '3', 'infinite'])
const enter = ref('bounceInLeft')
const leave = ref('bounceOutRight')
const duration = ref('default')
const delay = ref('default')
const repeat = ref('default')
const show = ref(true)
const showContinuous = ref(true)
const loremipsum = ref(
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
)

// v-if hack to trigger animation
watch(show, () => {
  showContinuous.value = false

  nextTick(() => {
    showContinuous.value = true
  })
})

const baseClasses = computed(() => {
  let classes = 'animated'

  if (duration.value !== 'default') {
    classes += ` ${duration.value}`
  }

  if (delay.value !== 'default') {
    classes += ` delay-${delay.value}`
  }

  return classes
})

const enterClass = computed(() => `${baseClasses.value} ${enter.value}`)

const leaveClass = computed(() => `${baseClasses.value} ${leave.value}`)

const continuousClasses = computed(() => {
  let classes = baseClasses.value

  if (repeat.value !== 'default') {
    classes +=
      repeat.value === 'infinite' ? ' infinite' : ` repeat-${repeat.value}`
  }

  return `${classes} ${enter.value}`
})
</script>
