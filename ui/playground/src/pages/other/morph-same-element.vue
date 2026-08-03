<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="row no-wrap q-gutter-x-lg items-center relative-position">
      <q-btn
        color="primary"
        no-wrap
        label="Morph element"
        @click="morphContent1"
      />

      <div ref="morphedElement1" v-bind="props1">
        {{ toggle1 ? 'Small' : 'Large' }}
      </div>
    </div>

    <div
      class="row no-wrap q-gutter-x-lg items-center relative-position"
      :class="{ 'justify-between': toggle2 }"
    >
      <q-btn
        color="primary"
        no-wrap
        label="Morph element"
        @click="morphContent2"
      />

      <q-avatar
        ref="morphedElement2"
        text-color="white"
        size="100px"
        v-bind="props2"
      />
    </div>
  </div>
</template>

<script setup>
import { morph } from 'quasar'
import { computed, ref } from 'vue'

const toggle1 = ref(false)
const toggle2 = ref(false)

const morphedElement1 = ref(null)
const morphedElement2 = ref(null)

let cancel1, cancel2

const props1 = computed(() =>
  toggle1.value === true
    ? {
        class: 'q-ml-sm q-pa-md bg-orange text-white rounded-borders',
        style: 'font-size: 24px'
      }
    : {
        class: 'q-ml-xl q-px-xl q-py-lg bg-blue text-white',
        style: 'border-radius: 25% 0/50% 0; font-size: 36px'
      }
)

const props2 = computed(() =>
  toggle2.value === true
    ? {
        fontSize: '52px',
        color: 'positive',
        icon: 'check',
        rounded: true
      }
    : {
        fontSize: '32px',
        color: 'negative',
        icon: 'close'
      }
)

function morphContent1() {
  const toggleLogic = () => {
    toggle1.value = toggle1.value !== true
  }

  if (cancel1 === void 0 || cancel1() === false) {
    cancel1 = morph({
      from: morphedElement1.value,
      onToggle: toggleLogic,
      duration: 500,
      tween: true,
      onEnd: end => {
        if (end === 'from') toggleLogic()
      }
    })
  }
}

function morphContent2() {
  const toggleLogic = () => {
    toggle2.value = toggle2.value !== true
  }

  if (cancel2 === void 0 || cancel2() === false) {
    cancel2 = morph({
      from: morphedElement2.value.$el,
      onToggle: toggleLogic,
      duration: 500,
      tween: true,
      tweenFromOpacity: 0.8,
      tweenToOpacity: 0.4,
      onEnd: end => {
        if (end === 'from') toggleLogic()
      }
    })
  }
}
</script>
