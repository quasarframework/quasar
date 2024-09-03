<template>
  <div class="q-pa-md q-gutter-sm">
    <q-btn
      v-for="filter in backdropFilterList"
      :key="filter.label"
      color="primary"
      :label="filter.label"
      no-caps
      @click="filter.onClick"
    />

    <q-dialog v-model="dialog" :backdrop-filter="backdropFilter">
      <q-card>
        <q-card-section class="row items-center q-pb-none text-h6">
          Dialog
        </q-card-section>

        <q-card-section>
          This dialog has a backdrop filter of {{ backdropFilter }}.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    /**
     * Values for backdrop-filter are the same as in the CSS specs.
     * The following list is not an exhaustive one.
     */
    const list = [
      'blur(4px)',
      'blur(4px) saturate(150%)',
      'brightness(60%)',
      'invert(70%)',
      'grayscale(100%)',
      'contrast(40%)',
      'hue-rotate(120deg)',
      'sepia(90%)',
      'saturate(80%)'
    ]

    const dialog = ref(false)
    const backdropFilter = ref(null)

    return {
      dialog,
      backdropFilter,
      backdropFilterList: list.map(filter => ({
        label: filter,
        onClick: () => {
          backdropFilter.value = filter
          dialog.value = true
        }
      }))
    }
  }
}
</script>
