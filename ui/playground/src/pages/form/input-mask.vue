<template>
  <div class="q-layout-padding">
    <div style="max-width: 600px" class="q-gutter-y-md">
      <h1>Input Mask</h1>

      <div>Model: {{ text1 }} | {{ maskedOrNotValue }}</div>
      <q-toggle
        v-model="maskedOrNot"
        @update:model-value="toggleMask"
        label="Masked or not"
      />
      <q-input
        :mask="maskedOrNotValue"
        v-model="text1"
        filled
        hint="Date ##/##/####"
        label="Label"
      />
      <q-input
        filled
        v-model="id"
        label="Special ID"
        mask="#:0:0:##"
        hint="Mask: #:0:0:##"
      ></q-input>

      <div>Model: {{ text2 }}</div>
      <q-input
        mask="((###) ### - ####)"
        v-model="text2"
        filled
        hint="Phone ((###) ### - ####)"
        counter
        label="Label"
      />

      <div>Model: {{ text3 }}</div>
      <q-input
        mask="phone"
        fill-mask
        v-model="text3"
        filled
        hint="Phone (###) ### - #### --- with fill-mask"
        counter
        label="Label"
      />

      <div>Model: {{ text4 }}</div>
      <q-input
        mask="phone"
        unmasked-value
        v-model="text4"
        filled
        hint="Phone (###) ### - #### -- with unmasked-value"
        counter
        label="Label"
      />

      <div>Model: {{ text5 }}</div>
      <q-input
        mask="phone"
        fill-mask="*"
        v-model="text5"
        filled
        hint="Phone (###) ### - #### --- with fill-mask *"
        counter
        label="Label"
      />

      <div>Mixed mask: {{ text6 }}</div>
      <q-input
        filled
        v-model="text6"
        label="Mixed"
        mask="AAAA - #### - #### - SSS"
        hint="Mask: AAAA - #### - #### - SSS"
      />

      <div>Uppercase - letters only mask: {{ text7 }}</div>
      <q-input
        filled
        v-model="text7"
        label="Uppercase letters"
        mask="AAAA - AAAA"
        hint="Mask: AAAA - AAAA"
      />

      <div>Anycase - letters only mask: {{ text8 }}</div>
      <q-input
        filled
        v-model="text8"
        label="Anycase letters"
        mask="SSSS - SSSS"
        hint="Mask: SSSS - SSSS"
      />

      <div>Alphanum only mask: {{ text9 }}</div>
      <q-input
        filled
        v-model="text9"
        label="Alphanum"
        mask="NNNN - NNNN"
        hint="Mask: NNNN - NNNN"
      />

      <div>Custom tokens ((C: 0-4a-eA-E, X override: 5-8))</div>
      <q-input
        filled
        v-model="text10"
        label="Custom tokens"
        mask="AA-CC-XX-CC"
        :mask-tokens="customTokens"
        clearable
        hint="Mask: AA-CC-XX-CC"
      />

      <div class="text-h6">Live mask test: {{ textMask }}</div>
      <div class="row q-gutter-sm">
        <q-input class="col" v-model="mask" outlined dense label="Mask" />
        <q-input
          class="col"
          v-model="fillMaskText"
          outlined
          dense
          label="Fill mask char"
          :disable="!fillMask"
        />
        <q-toggle class="col" v-model="fillMask" label="Mask" />
        <q-toggle class="col" v-model="fillUnmask" label="Unmask" />
        <q-toggle class="col" v-model="fillRight" label="Right" />
      </div>
      <q-input
        :mask="mask"
        :reverse-fill-mask="fillRight"
        :fill-mask="fillMaskComp"
        :unmasked-value="fillUnmask"
        v-model.number="textMask"
        filled
        label="Masked input"
        :input-class="{ 'text-right': fillRight }"
      />

      <pre>
        Variable mask 1: {{ variableMask1 }} - {{ variableMaskValue1 }}
        Variable mask 2: {{ variableMask2 }} - {{ variableMaskValue2 }}
        Variable mask 3: {{ variableMask3 }} - {{ variableMaskValue3 }}
      </pre>
      <q-input
        v-model="variableMaskValue1"
        filled
        label="Variable mask (put 8 on second position) - no fill mask"
        :mask="variableMask1"
      />
      <q-input
        v-model="variableMaskValue2"
        filled
        label="Variable mask (put 8 on second position) - fill mask SPACE"
        :mask="variableMask2"
        fill-mask=" "
      />
      <q-input
        v-model="variableMaskValue3"
        filled
        label="Variable mask (put 8 on second position) - fill mask #"
        :mask="variableMask3"
        fill-mask="#"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      maskedOrNot: true,
      maskedOrNotValue: '##/##/####',
      text1: '12/12/2023',
      id: null,
      text2: '',
      text3: '',
      text4: '',
      text5: '',
      text6: '',
      text7: '',
      text8: '',
      text9: '',
      text10: 'KK-A4-76-1A',
      variableMaskValue1: '',
      variableMaskValue2: '',
      variableMaskValue3: '',

      // mask: '(###) ###S - (###)',
      mask: '#.##',
      textMask: 123.45,

      fillRight: true,
      fillMask: true,
      fillUnmask: false,
      fillMaskText: '0',

      customTokens: {
        C: {
          pattern: '[0-4a-eA-E]',
          negate: '[^0-4a-eA-E]',
          transform: v => v.toLocaleUpperCase()
        },
        X: { pattern: '[5-8]', negate: '[^5-8]' }
      }
    }
  },

  computed: {
    fillMaskComp() {
      return this.fillMask === false ? false : this.fillMaskText
    },

    variableMask1() {
      if (
        this.variableMaskValue1[1] === '8' ||
        (this.variableMaskValue1[1] === '.' &&
          this.variableMaskValue1[2] === '8')
      ) {
        return '#.###.###'
      } else {
        return '###.#.###'
      }
    },

    variableMask2() {
      if (
        this.variableMaskValue2[1] === '8' ||
        (this.variableMaskValue2[1] === '.' &&
          this.variableMaskValue2[2] === '8')
      ) {
        return '#.###.###'
      } else {
        return '###.#.###'
      }
    },

    variableMask3() {
      if (
        this.variableMaskValue3[1] === '8' ||
        (this.variableMaskValue3[1] === '.' &&
          this.variableMaskValue3[2] === '8')
      ) {
        return '#.###.###'
      } else {
        return '###.#.###'
      }
    }
  },

  methods: {
    toggleMask() {
      this.maskedOrNotValue = this.maskedOrNotValue ? '' : '##/##/####'
    }
  }
}
</script>
