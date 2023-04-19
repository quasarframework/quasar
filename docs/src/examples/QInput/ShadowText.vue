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
import { ref, computed } from 'vue'

const { stopAndPrevent } = event

export default {
  setup () {
    const inputModel = ref('')
    const inputFillCancelled = ref(false)
    const inputShadowText = computed(() => {
      if (inputFillCancelled.value === true) {
        return ''
      }

      const t = 'Text filled when you press TAB'
      const empty = typeof inputModel.value !== 'string' || inputModel.value.length === 0

      if (empty === true) {
        return t
      }
      else if (t.indexOf(inputModel.value) !== 0) {
        return ''
      }

      return t
        .split(inputModel.value)
        .slice(1)
        .join(inputModel.value)
    })

    const textareaModel = ref('')
    const textareaFillCancelled = ref(false)
    const textareaShadowText = computed(() => {
      if (textareaFillCancelled.value === true) {
        return ''
      }

      const
        t = 'This text\nwill be filled\non multiple lines\nwhen you press TAB',
        empty = typeof textareaModel.value !== 'string' || textareaModel.value.length === 0

      if (empty === true) {
        return t.split('\n')[ 0 ]
      }
      else if (t.indexOf(textareaModel.value) !== 0) {
        return ''
      }

      return t
        .split(textareaModel.value)
        .slice(1)
        .join(textareaModel.value)
        .split('\n')[ 0 ]
    })

    return {
      inputModel,
      inputFillCancelled,
      inputShadowText,

      processInputFill (e) {
        if (e === void 0) {
          return
        }

        if (e.keyCode === 27) {
          if (inputFillCancelled.value !== true) {
            inputFillCancelled.value = true
          }
        }
        else if (e.keyCode === 9) {
          if (inputFillCancelled.value !== true && inputShadowText.value.length > 0) {
            stopAndPrevent(e)
            inputModel.value = (typeof inputModel.value === 'string' ? inputModel.value : '') + inputShadowText.value
          }
        }
        else if (inputFillCancelled.value === true) {
          inputFillCancelled.value = false
        }
      },

      textareaModel,
      textareaFillCancelled,
      textareaShadowText,

      processTextareaFill (e) {
        if (e === void 0) {
          return
        }

        if (e.keyCode === 27) {
          if (textareaFillCancelled.value !== true) {
            textareaFillCancelled.value = true
          }
        }
        else if (e.keyCode === 9) {
          if (textareaFillCancelled.value !== true && textareaShadowText.value.length > 0) {
            stopAndPrevent(e)
            textareaModel.value = (typeof textareaModel.value === 'string' ? textareaModel.value : '') + textareaShadowText.value
          }
        }
        else if (textareaFillCancelled.value === true) {
          textareaFillCancelled.value = false
        }
      }
    }
  }
}
</script>
