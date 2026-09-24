<template>
  <div class="q-layout-padding q-gutter-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">scrollTarget ref, axis both, reactive options</div>
        <div class="row q-gutter-sm items-center">
          <q-toggle v-model="disabled" label="disabled" />
          <q-toggle v-model="debounced" label="debounce 300ms" />
          <q-btn flat label="refresh()" @click="refresh" />
          <q-btn flat color="negative" label="stop()" @click="stop" />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div ref="boxRef" class="scroll box rounded-borders">
          <div class="content">
            <div v-for="n in 40" :key="n" class="q-pa-sm">Line #{{ n }}</div>
          </div>
        </div>
        <div class="q-mt-md q-gutter-sm">
          <q-badge :label="`top: ${position.top}`" />
          <q-badge :label="`left: ${position.left}`" />
          <q-badge :label="`direction: ${direction}`" />
          <q-badge
            :color="directionChanged ? 'positive' : 'grey'"
            :label="directionChanged ? 'direction changed' : 'same direction'"
          />
          <q-badge :label="`delta: ${delta.top} / ${delta.left}`" />
          <q-badge
            :label="`inflection: ${inflectionPoint.top} / ${inflectionPoint.left}`"
          />
          <q-badge color="secondary" :label="`onScroll calls: ${calls}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">page (auto detected from the root element)</div>
        <div class="q-gutter-sm">
          <q-badge :label="`top: ${page.position.value.top}`" />
          <q-badge :label="`direction: ${page.direction.value}`" />
          <q-badge :label="`delta: ${page.delta.value.top}`" />
          <q-badge :label="`inflection: ${page.inflectionPoint.value.top}`" />
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6"
          >target inside a .scroll parent (auto detection)</div
        >
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="scroll box rounded-borders">
          <div ref="innerRef" class="q-pa-sm">Line #0 (target)</div>
          <div v-for="n in 40" :key="n" class="q-pa-sm">Line #{{ n }}</div>
        </div>
        <div class="q-mt-md q-gutter-sm">
          <q-badge :label="`top: ${inner.position.value.top}`" />
          <q-badge :label="`direction: ${inner.direction.value}`" />
        </div>
      </q-card-section>
    </q-card>

    <div v-for="n in 30" :key="n" class="q-pa-sm">Page filler #{{ n }}</div>
  </div>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useScroll } from 'quasar'

const boxRef = useTemplateRef('boxRef')
const innerRef = useTemplateRef('innerRef')

const disabled = ref(false)
const debounced = ref(false)
const calls = ref(0)

const page = useScroll()

const {
  position,
  direction,
  directionChanged,
  delta,
  inflectionPoint,
  refresh,
  stop
} = useScroll(() => ({
  scrollTarget: boxRef,
  axis: 'both',
  disabled: disabled.value,
  debounce: debounced.value ? 300 : void 0,
  onScroll() {
    calls.value++
  }
}))

const inner = useScroll({ target: innerRef })
</script>

<style lang="sass" scoped>
.box
  height: 200px
  border: 1px solid #ccc

.content
  width: 150%
</style>
