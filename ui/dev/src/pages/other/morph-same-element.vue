<template>
  <div class="q-pa-md q-gutter-y-md">
    <div class="row no-wrap q-gutter-x-lg items-center relative-position">
      <q-btn color="primary" no-wrap label="Morph element" @click="morphContent1" />

      <div ref="morphedElement1" v-bind="props1">
        {{ toggle1 ? 'Small' : 'Large' }}
      </div>
    </div>

    <div
      class="row no-wrap q-gutter-x-lg items-center relative-position"
      :class="{ 'justify-between': toggle2 }"
    >
      <q-btn color="primary" no-wrap label="Morph element" @click="morphContent2" />

      <q-avatar ref="morphedElement2" text-color="white" size="100px" v-bind="props2" />
    </div>
  </div>
</template>

<script>
import { morph } from 'quasar'

export default {
  data () {
    return {
      toggle1: false,
      toggle2: false
    }
  },

  computed: {
    props1 () {
      return this.toggle1 === true
        ? {
          class: 'q-ml-sm q-pa-md bg-orange text-white rounded-borders',
          style: 'font-size: 24px'
        }
        : {
          class: 'q-ml-xl q-px-xl q-py-lg bg-blue text-white',
          style: 'border-radius: 25% 0/50% 0; font-size: 36px'
        }
    },

    props2 () {
      return this.toggle2 === true
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
    }
  },

  methods: {
    morphContent1 () {
      const toggleLogic = () => {
        this.toggle1 = this.toggle1 !== true
      }

      if (this.cancel1 === void 0 || this.cancel1() === false) {
        this.cancel1 = morph({
          from: this.$refs.morphedElement1,
          onToggle: toggleLogic,
          duration: 500,
          tween: true,
          onEnd: end => {
            end === 'from' && toggleLogic()
          }
        })
      }
    },

    morphContent2 () {
      const toggleLogic = () => {
        this.toggle2 = this.toggle2 !== true
      }

      if (this.cancel2 === void 0 || this.cancel2() === false) {
        this.cancel2 = morph({
          from: this.$refs.morphedElement2.$el,
          onToggle: toggleLogic,
          duration: 500,
          tween: true,
          tweenFromOpacity: 0.8,
          tweenToOpacity: 0.4,
          onEnd: end => {
            end === 'from' && toggleLogic()
          }
        })
      }
    }
  }
}
</script>
