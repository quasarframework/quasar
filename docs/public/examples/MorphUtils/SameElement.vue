<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="row no-wrap q-gutter-x-lg items-center relative-position">
      <q-btn color="primary" no-wrap label="Morph element" @click="morphContent1" />

      <div ref="firstMorphRef" v-bind="props1">
        {{ toggle1 ? 'Small' : 'Large' }}
      </div>
    </div>

    <div
      class="row no-wrap q-gutter-x-lg items-center relative-position"
      :class="{ 'justify-between': toggle2 }"
    >
      <q-btn color="primary" no-wrap label="Morph element" @click="morphContent2" />

      <q-avatar ref="secondMorphRef" text-color="white" size="100px" v-bind="props2" />
    </div>
  </div>
</template>

<script>
import { morph } from 'quasar'
import { ref, computed } from 'vue'

export default {
  setup () {
    const toggle1 = ref(false)
    const toggle2 = ref(false)

    const firstMorphRef = ref(null)
    const secondMorphRef = ref(null)

    let cancel1, cancel2

    return {
      toggle1,
      toggle2,

      firstMorphRef,
      secondMorphRef,

      props1: computed(() => {
        return toggle1.value === true
          ? {
              class: 'q-ml-sm q-pa-md bg-orange text-white rounded-borders',
              style: 'font-size: 24px'
            }
          : {
              class: 'q-ml-xl q-px-xl q-py-lg bg-blue text-white',
              style: 'border-radius: 25% 0/50% 0; font-size: 36px'
            }
      }),

      props2: computed(() => {
        return toggle2.value === true
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
      }),

      morphContent1 () {
        const onToggle = () => {
          toggle1.value = toggle1.value !== true
        }

        if (cancel1 === void 0 || cancel1() === false) {
          cancel1 = morph({
            from: firstMorphRef.value,
            onToggle,
            duration: 500,
            tween: true,
            onEnd: end => {
              end === 'from' && onToggle()
            }
          })
        }
      },

      morphContent2 () {
        const onToggle = () => {
          toggle2.value = toggle2.value !== true
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
              end === 'from' && onToggle()
            }
          })
        }
      }
    }
  }
}
</script>
