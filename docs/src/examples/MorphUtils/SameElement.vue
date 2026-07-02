<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="row no-wrap q-gutter-x-lg items-center relative-position">
      <q-btn
        color="primary"
        no-wrap
        label="Morph element"
        @click="morphContent1"
      />

      <div ref="firstMorphRef" v-bind="props1">
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
        ref="secondMorphRef"
        text-color="white"
        size="100px"
        v-bind="props2"
      />
    </div>
  </div>
</template>

<script setup>
import { morph } from 'quasar'
import { computed, ref, useTemplateRef } from 'vue'

const toggle1 = ref(false)
const toggle2 = ref(false)

const firstMorphRef = useTemplateRef('firstMorphRef')
const secondMorphRef = useTemplateRef('secondMorphRef')

let cancel1, cancel2

const props1 = computed(() =>
  toggle1.value
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
  toggle2.value
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
  const onToggle = () => {
    toggle1.value = !toggle1.value
  }

  if (cancel1 === void 0 || cancel1() === false) {
    cancel1 = morph({
      from: firstMorphRef.value,
      onToggle,
      duration: 500,
      tween: true,
      onEnd: end => {
        if (end === 'from') onToggle()
      }
    })
  }
}

function morphContent2() {
  const onToggle = () => {
    toggle2.value = !toggle2.value
  }

  if (cancel2 === void 0 || cancel2() === false) {
    cancel2 = morph({
      from: secondMorphRef.value.$el,
      onToggle,
      duration: 500,
      tween: true,
      tweenFromOpacity: 0.8,
      tweenToOpacity: 0.4,
      onEnd: end => {
        if (end === 'from') onToggle()
      }
    })
  }
}
</script>
