<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md column" style="max-width: 300px">
      <q-input
        v-model="inputModel"
        filled
        clearable
        color="purple-12"
        label="Input with shadow text"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="inputShadowText"
        @keydown="processInputFill"
        @focus="processInputFill"
      />

      <q-input
        v-model="textareaModel"
        filled
        clearable
        autogrow
        color="green-8"
        label="Autogrow textarea with shadow text"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textareaShadowText"
        @keydown="processTextareaFill"
        @focus="processTextareaFill"
      />

      <q-input
        v-model="textareaModel"
        filled
        clearable
        type="textarea"
        color="red-12"
        label="Textarea with shadow text"
        hint="Press TAB to autocomplete suggested value or ESC to cancel suggestion"
        :shadow-text="textareaShadowText"
        @keydown="processTextareaFill"
        @focus="processTextareaFill"
      />
    </div>
  </div>
</template>

<script>
import { event } from 'quasar'

const { stopAndPrevent } = event

export default {
  data () {
    return {
      inputModel: '',
      textareaModel: '',

      inputFillCancelled: false,
      textareaFillCancelled: false
    }
  },

  computed: {
    inputShadowText () {
      if (this.inputFillCancelled === true) {
        return ''
      }

      const t = 'Text filled when you press TAB'
      const empty = typeof this.inputModel !== 'string' || this.inputModel.length === 0

      if (empty === true) {
        return t
      }
      else if (t.indexOf(this.inputModel) !== 0) {
        return ''
      }

      return t
        .split(this.inputModel)
        .slice(1)
        .join(this.inputModel)
    },

    textareaShadowText () {
      if (this.textareaFillCancelled === true) {
        return ''
      }

      const
        t = 'This text\nwill be filled\non multiple lines\nwhen you press TAB',
        empty = typeof this.textareaModel !== 'string' || this.textareaModel.length === 0

      if (empty === true) {
        return t.split('\n')[0]
      }
      else if (t.indexOf(this.textareaModel) !== 0) {
        return ''
      }

      return t
        .split(this.textareaModel)
        .slice(1)
        .join(this.textareaModel)
        .split('\n')[0]
    }
  },

  methods: {
    processInputFill (e) {
      if (e === void 0) {
        return
      }

      if (e.keyCode === 27) {
        if (this.inputFillCancelled !== true) {
          this.inputFillCancelled = true
        }
      }
      else if (e.keyCode === 9) {
        if (this.inputFillCancelled !== true && this.inputShadowText.length > 0) {
          stopAndPrevent(e)
          this.inputModel = (typeof this.inputModel === 'string' ? this.inputModel : '') + this.inputShadowText
        }
      }
      else if (this.inputFillCancelled === true) {
        this.inputFillCancelled = false
      }
    },

    processTextareaFill (e) {
      if (e === void 0) {
        return
      }

      if (e.keyCode === 27) {
        if (this.textareaFillCancelled !== true) {
          this.textareaFillCancelled = true
        }
      }
      else if (e.keyCode === 9) {
        if (this.textareaFillCancelled !== true && this.textareaShadowText.length > 0) {
          stopAndPrevent(e)
          this.textareaModel = (typeof this.textareaModel === 'string' ? this.textareaModel : '') + this.textareaShadowText
        }
      }
      else if (this.textareaFillCancelled === true) {
        this.textareaFillCancelled = false
      }
    }
  }
}
</script>
