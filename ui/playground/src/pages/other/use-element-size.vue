<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">target ref, reactive options</div>
        <q-slider v-model="boxWidth" :min="100" :max="400" label />
        <div class="row q-gutter-sm items-center">
          <q-btn color="primary" label="Random height" @click="randomHeight" />
          <q-toggle v-model="disabled" label="disabled" />
          <q-toggle v-model="debounced" label="debounce 300ms" />
          <q-btn
            flat
            label="refreshElementSize()"
            @click="refreshElementSize"
          />
          <q-btn
            flat
            color="negative"
            label="stopElementSize()"
            @click="stopElementSize"
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div
          ref="boxRef"
          class="box bg-amber rounded-borders"
          :style="boxStyle"
        />
        <div class="q-mt-md q-gutter-sm">
          <q-badge :label="`width: ${elementSize.width}`" />
          <q-badge :label="`height: ${elementSize.height}`" />
          <q-badge color="secondary" :label="`onResize calls: ${calls}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">target follows a v-if ref</div>
        <q-toggle v-model="showSecond" label="render the target" />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div
          v-if="showSecond"
          ref="secondRef"
          class="box bg-teal text-white rounded-borders q-pa-sm"
          style="width: 50%"
        >
          resize the window
        </div>
        <div class="q-mt-md q-gutter-sm">
          <q-badge :label="`width: ${second.elementSize.value.width}`" />
          <q-badge :label="`height: ${second.elementSize.value.height}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">component root (no target)</div>
        <div class="q-gutter-sm">
          <q-badge :label="`root width: ${root.elementSize.value.width}`" />
          <q-badge :label="`root height: ${root.elementSize.value.height}`" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref, useTemplateRef } from 'vue'
import { useElementSize } from 'quasar'

const boxRef = useTemplateRef('boxRef')
const secondRef = useTemplateRef('secondRef')

const boxWidth = ref(200)
const boxHeight = ref(120)
const disabled = ref(false)
const debounced = ref(false)
const calls = ref(0)
const showSecond = ref(true)

const boxStyle = computed(() => ({
  width: boxWidth.value + 'px',
  height: boxHeight.value + 'px'
}))

const { elementSize, refreshElementSize, stopElementSize } = useElementSize(
  () => ({
    target: boxRef,
    disabled: disabled.value,
    debounce: debounced.value ? 300 : 0,
    onResize() {
      calls.value++
    }
  })
)

const second = useElementSize({ target: secondRef })

// measures this page's root element
const root = useElementSize()

function randomHeight() {
  boxHeight.value = Math.floor(80 + Math.random() * 200)
}
</script>

<style lang="sass" scoped>
.box
  transition: height .3s
</style>
